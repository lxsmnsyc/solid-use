import { createMemo } from 'solid-js';

function isAccessor<T>(value: any): value is () => T {
  return typeof value === 'function';
}

export default function string<T>(
  strings: TemplateStringsArray,
  ...args: (T | (() => T))[]
): () => string {
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
