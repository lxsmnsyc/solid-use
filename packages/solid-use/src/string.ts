import { createMemo } from 'solid-js';

function isAccessor(value: unknown): value is () => unknown {
  return typeof value === 'function';
}

/**
 * A tagged template that produces a reactive string.
 *
 * Interpolations may be plain values or accessors, and they are stringified
 * individually, so a single template can mix types freely.
 */
export default function string(strings: TemplateStringsArray, ...args: unknown[]): () => string {
  return createMemo(() => {
    let result = '';
    let a = 0;
    for (let i = 0, len = strings.length; i < len; i++) {
      result = `${result}${strings[i]}`;
      if (a < args.length) {
        const node = args[a++];
        if (isAccessor(node)) {
          result = `${result}${String(node())}`;
        } else {
          result = `${result}${String(node)}`;
        }
      }
    }
    return result;
  });
}
