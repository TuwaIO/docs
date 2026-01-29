import { Prism } from 'react-syntax-highlighter';
import { materialLight, materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism';

import NoSSR from './NoSSR';

export interface CodeHighlighterProps {
  children: string | string[];
  language?: string;
  resolvedTheme: string;
}

export function CodeHighlighter({ children, language, resolvedTheme }: CodeHighlighterProps) {
  return (
    <div className="tuwadocs:border-t tuwadocs:border-[var(--tuwa-border-secondary)]">
      <NoSSR>
        <Prism
          language={language ?? 'bash'}
          customStyle={{ margin: 0, background: 'transparent' }}
          style={resolvedTheme === 'dark' ? materialOceanic : materialLight}
        >
          {String(children).replace(/\n$/, '')}
        </Prism>
      </NoSSR>
    </div>
  );
}
