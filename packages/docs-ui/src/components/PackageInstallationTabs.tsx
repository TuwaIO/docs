'use client';

import { CommandLineIcon } from '@heroicons/react/24/outline';
import { Tabs } from 'nextra/components';

import { CodeBlock } from './CodeBlock';
import { CodeHighlighter, CodeHighlighterProps } from './CodeHighlighter';

const tabsItems = [
  {
    title: 'pnpm',
    command: 'pnpm add',
  },
  {
    title: 'bun',
    command: 'bun add',
  },
  {
    title: 'npm',
    command: 'npm install',
  },
  {
    title: 'yarn',
    command: 'yarn add',
  },
];

export function PackageInstallationTabs({
  packagesList,
  resolvedTheme,
}: { packagesList: string } & Pick<CodeHighlighterProps, 'resolvedTheme'>) {
  return (
    <div className="my-4">
      <Tabs items={tabsItems.map((tab) => tab.title)}>
        {tabsItems.map((tab) => (
          <Tabs.Tab key={tab.title}>
            <CodeBlock title="Terminal" titleIcons={<CommandLineIcon />} textToCopy={`${tab.command} ${packagesList}`}>
              <CodeHighlighter
                resolvedTheme={resolvedTheme}
                language="bash"
              >{`${tab.command} ${packagesList}`}</CodeHighlighter>
            </CodeBlock>
          </Tabs.Tab>
        ))}
      </Tabs>
    </div>
  );
}
