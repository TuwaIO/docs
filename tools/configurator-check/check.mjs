// Type-checks every stack of the Stack Configurator (apps/docs-hub/src/lib/configurator/generate.ts) against the
// published TUWA packages installed here, and checks its install command: every imported package is installed, and
// every required peer of a TUWA package is installed or brought by another installed package.
//
//   pnpm install --ignore-workspace   (once, in this folder)
//   node check.mjs [filter]           (a filter keeps the stacks whose key contains it, for example `vite-evm`)
//
// Node runs the generator with its built-in type stripping (Node 22.18 or newer).

import { spawn } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { builtinModules } from 'node:module';
import { availableParallelism } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { allStackOptions, generateStack, stackKey } from '../../apps/docs-hub/src/lib/configurator/generate.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(here, '.out');
const tsc = path.join(here, 'node_modules', '.bin', 'tsc');
// The Prettier of the docs repository, with its config: the generated code must come out formatted
const prettier = path.join(here, '../../node_modules/.bin/prettier');
const filter = process.argv[2];

const npmData = JSON.parse(
  await readFile(path.join(here, '../../apps/docs-hub/src/generated/npm-packages.json'), 'utf8'),
).packages;

// Installed by create-next-app or create-vite, not by the configurator's command
const FRAMEWORK_PACKAGES = {
  next: ['next', 'react', 'react-dom', 'tailwindcss'],
  vite: ['react', 'react-dom', 'vite', '@vitejs/plugin-react'],
  vanilla: ['vite'],
};

const compilerOptions = {
  target: 'ES2022',
  lib: ['DOM', 'DOM.Iterable', 'ESNext'],
  module: 'ESNext',
  moduleResolution: 'bundler',
  jsx: 'react-jsx',
  strict: true,
  noEmit: true,
  skipLibCheck: true,
  isolatedModules: true,
  esModuleInterop: true,
  ignoreDeprecations: '6.0',
};

const packageOf = (specifier) =>
  specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0];

/** The bare module specifiers a file imports */
function importsOf(code) {
  const specifiers = new Set();
  for (const match of code.matchAll(/(?:from|import)\s+'([^'.][^']*)'/g)) specifiers.add(match[1]);
  return [...specifiers].filter((specifier) => !specifier.startsWith('@/'));
}

/** Problems with the install command of a stack */
function checkPackages(stack) {
  const problems = [];
  const installed = new Set([...stack.packages, ...stack.devPackages, ...FRAMEWORK_PACKAGES[stack.options.framework]]);
  const builtins = new Set(builtinModules.flatMap((name) => [name, `node:${name}`]));

  for (const file of stack.files) {
    for (const specifier of importsOf(file.code)) {
      const name = packageOf(specifier);
      if (!builtins.has(specifier) && !installed.has(name))
        problems.push(`${file.path} imports ${name}, which is not installed`);
    }
  }

  // Packages brought by an installed TUWA package as regular dependencies (the SDK brings the projects)
  const brought = new Set(stack.packages.flatMap((name) => Object.keys(npmData[name]?.dependencies ?? {})));
  for (const name of stack.packages) {
    const optional = npmData[name]?.peerDependenciesMeta ?? {};
    for (const peer of Object.keys(npmData[name]?.peerDependencies ?? {})) {
      if (optional[peer]?.optional) continue;
      if (!installed.has(peer) && !brought.has(peer)) problems.push(`${name} needs its peer ${peer}`);
    }
  }
  return problems;
}

async function writeStack(stack, dir) {
  await rm(dir, { recursive: true, force: true });
  for (const file of stack.files) {
    const target = path.join(dir, file.path);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, file.code);
  }
  const next = stack.options.framework === 'next';
  // The ambient types the frameworks generate in a new project
  if (next) {
    await writeFile(
      path.join(dir, 'next-env.d.ts'),
      '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n',
    );
  } else {
    await mkdir(path.join(dir, 'src'), { recursive: true });
    await writeFile(path.join(dir, 'src', 'vite-env.d.ts'), '/// <reference types="vite/client" />\n');
  }
  await writeFile(
    path.join(dir, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          ...compilerOptions,
          types: ['node'],
          ...(next && { paths: { '@/*': ['./src/*'] } }),
        },
        include: ['**/*.ts', '**/*.tsx'],
      },
      null,
      2,
    ),
  );
}

/** Runs a command in this folder and resolves with its exit status and output */
function run(command, args) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd: here });
    let output = '';
    child.stdout.on('data', (chunk) => (output += chunk));
    child.stderr.on('data', (chunk) => (output += chunk));
    child.on('close', (code) => resolve({ ok: code === 0, output }));
  });
}

/** The generated files Prettier would change (the files the frameworks generate are not checked) */
async function formatCheck(stack, dir) {
  const files = stack.files.filter((file) => file.language !== 'dotenv').map((file) => path.join(dir, file.path));
  // No ignore file: the .gitignore of this folder ignores .out, and Prettier reads it by default
  const { ok, output } = await run(prettier, ['--list-different', '--ignore-path', 'no-ignore-file', ...files]);
  return ok
    ? []
    : output
        .trim()
        .split('\n')
        .map((file) => `${path.relative(dir, file)} is not formatted`);
}

function typeCheck(dir) {
  return new Promise((resolve) => {
    const child = spawn(tsc, ['-p', path.join(dir, 'tsconfig.json')], { cwd: here });
    let output = '';
    child.stdout.on('data', (chunk) => (output += chunk));
    child.stderr.on('data', (chunk) => (output += chunk));
    child.on('close', (code) => resolve({ ok: code === 0, output: output.replaceAll(`${dir}/`, '') }));
  });
}

const stacks = allStackOptions()
  .filter((options) => !filter || stackKey(options).includes(filter))
  .map((options) => generateStack(options));

console.log(`Checking ${stacks.length} stacks…`);
let failed = 0;
const queue = [...stacks];

async function worker() {
  for (let stack = queue.shift(); stack; stack = queue.shift()) {
    const key = stackKey(stack.options);
    const dir = path.join(outDir, key);
    await writeStack(stack, dir);
    const problems = [...checkPackages(stack), ...(await formatCheck(stack, dir))];
    const { ok, output } = await typeCheck(dir);
    if (ok && problems.length === 0) {
      console.log(`✓ ${key}`);
    } else {
      failed++;
      console.log(`✗ ${key}\n${[...problems, output.trim()].filter(Boolean).join('\n')}\n`);
    }
  }
}

await Promise.all(Array.from({ length: Math.max(1, availableParallelism() - 1) }, worker));
console.log(failed ? `${failed} of ${stacks.length} stacks failed` : `All ${stacks.length} stacks compile`);
process.exitCode = failed ? 1 : 0;
