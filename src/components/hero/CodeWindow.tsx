import { GitBranch } from 'lucide-react';
import type { CSSProperties } from 'react';
import styles from './CodeWindow.module.css';

type TokenKind = 'keyword' | 'fn' | 'type' | 'string' | 'prop' | 'punct' | 'literal' | 'plain';
type Token = readonly [TokenKind, string];

// Conceptual TypeScript shown in the hero editor. Lines stay short to fit small screens.
const CODE_LINES: readonly (readonly Token[])[] = [
  [
    ['keyword', 'type'],
    ['plain', ' '],
    ['type', 'Idea'],
    ['punct', ' = {'],
  ],
  [
    ['plain', '  '],
    ['prop', 'problem'],
    ['punct', ': '],
    ['type', 'string'],
    ['punct', ';'],
  ],
  [
    ['plain', '  '],
    ['prop', 'users'],
    ['punct', ': '],
    ['type', 'string'],
    ['punct', '[];'],
  ],
  [['punct', '};']],
  [],
  [
    ['keyword', 'export function'],
    ['plain', ' '],
    ['fn', 'build'],
    ['punct', '('],
    ['prop', 'idea'],
    ['punct', ': '],
    ['type', 'Idea'],
    ['punct', ') {'],
  ],
  [
    ['plain', '  '],
    ['keyword', 'const'],
    ['plain', ' plan '],
    ['punct', '= '],
    ['fn', 'design'],
    ['punct', '('],
    ['plain', 'idea'],
    ['punct', ');'],
  ],
  [
    ['plain', '  '],
    ['keyword', 'const'],
    ['plain', ' app '],
    ['punct', '= '],
    ['fn', 'develop'],
    ['punct', '('],
    ['plain', 'plan'],
    ['punct', ', {'],
  ],
  [
    ['plain', '    '],
    ['prop', 'stack'],
    ['punct', ': ['],
    ['string', "'React'"],
    ['punct', ', '],
    ['string', "'TypeScript'"],
    ['punct', '],'],
  ],
  [
    ['plain', '    '],
    ['prop', 'tested'],
    ['punct', ': '],
    ['literal', 'true'],
    ['punct', ','],
  ],
  [
    ['plain', '  '],
    ['punct', '});'],
  ],
  [],
  [
    ['plain', '  '],
    ['keyword', 'return'],
    ['plain', ' '],
    ['fn', 'deploy'],
    ['punct', '('],
    ['plain', 'app'],
    ['punct', ');'],
  ],
  [['punct', '}']],
  [],
];

const LAST_LINE = CODE_LINES.length - 1;

/** Decorative editor window for the hero. Rendered with aria-hidden by its parent. */
export function CodeWindow() {
  return (
    <div className={styles.window}>
      <div className={styles.titleBar}>
        <span className={styles.dots}>
          <span />
          <span />
          <span />
        </span>
        <span className={styles.tabs}>
          <span className={styles.tab} data-active="true">
            <span className={styles.fileBadge}>TS</span>
            build.ts
          </span>
          <span className={styles.tab}>
            <span className={styles.fileBadge}>TS</span>
            projects.ts
          </span>
        </span>
      </div>

      <pre className={styles.code}>
        <code>
          {CODE_LINES.map((tokens, index) => (
            <span
              key={index}
              className={styles.line}
              data-current={index === LAST_LINE}
              style={{ '--line': index } as CSSProperties}
            >
              <span className={styles.lineNumber}>{index + 1}</span>
              <span className={styles.lineContent}>
                {tokens.map(([kind, text], tokenIndex) => (
                  <span key={tokenIndex} className={styles[kind]}>
                    {text}
                  </span>
                ))}
                {index === LAST_LINE && <span className={styles.caret} />}
              </span>
            </span>
          ))}
        </code>
      </pre>

      <div className={styles.statusBar}>
        <span className={styles.branch}>
          <GitBranch size={12} strokeWidth={2.2} />
          main
        </span>
        <span>TypeScript</span>
      </div>
    </div>
  );
}
