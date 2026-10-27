export interface MdxCodeBlock {
  language?: string;
  filename?: string;
  code: string;
}

/**
 * Extracts all non-mermaid fenced code blocks from the canonical English MDX `sourceCode`
 * so localized guides share the exact same code snippets (comments, filenames, languages) without duplication.
 */
export function extractMdxCodeBlocks(sourceCode: string): MdxCodeBlock[] {
  if (!sourceCode) return [];
  const regex = /^([ \t]*)```([^\n]*)\n([\s\S]*?)^\1```/gm;
  const blocks: MdxCodeBlock[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(sourceCode)) !== null) {
    const indent = match[1] ?? '';
    const meta = (match[2] ?? '').trim();
    if (meta === 'mermaid') continue;
    const langMatch = meta.match(/^([a-zA-Z0-9_-]+)/);
    const fnMatch = meta.match(/filename="([^"]+)"/);
    const rawBody = (match[3] ?? '').replace(/\n$/, '');
    const code = indent
      ? rawBody
          .split('\n')
          .map((line) => (line.startsWith(indent) ? line.slice(indent.length) : line))
          .join('\n')
      : rawBody;
    blocks.push({
      language: langMatch ? langMatch[1] : undefined,
      filename: fnMatch ? fnMatch[1] : undefined,
      code,
    });
  }

  return blocks;
}
