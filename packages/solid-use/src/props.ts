import { createMemo } from 'solid-js';

export function omitProps<T extends Record<string, any>, K extends keyof T>(
  value: T,
  keys: K[],
): Omit<T, K> {
  const newObject = {};

  const currentKeys = Object.keys(value);

  for (let i = 0, len = currentKeys.length; i < len; i += 1) {
    const key = currentKeys[i];
    if (!keys.includes(key as K)) {
      Object.defineProperty(newObject, key, {
        get() {
          return value[key];
        },
        configurable: true,
        enumerable: true,
      });
    }
  }

  return newObject as Omit<T, K>;
}

export function pickProps<T extends Record<string, any>, K extends keyof T>(
  value: T,
  keys: K[],
): Pick<T, K> {
  const newObject = {};

  const currentKeys = Object.keys(value);

  for (let i = 0, len = currentKeys.length; i < len; i += 1) {
    const key = currentKeys[i];
    if (keys.includes(key as K)) {
      Object.defineProperty(newObject, key, {
        get() {
          return value[key];
        },
        configurable: true,
        enumerable: true,
      });
    }
  }

  return newObject as Pick<T, K>;
}

/**
 * What `destructure` and `spread` accept: any object or array whose fields may
 * be reactive. Exported because it is the constraint on their type parameters.
 */
export type ReactiveObject = Record<string | symbol, any> | any[];

/**
 * The result of `destructure` or `spread`: the same shape as the source, with
 * every field replaced by an accessor for it.
 */
// Each field is exposed as an accessor. `Readonly<() => T>` would strip the
// call signature, which makes the documented `props.field()` usage fail to
// type-check, so the accessor type is used directly.
export type Spread<T extends ReactiveObject> = {
  [key in keyof T]: () => T[key];
};

/**
 * The type of a key into a `ReactiveObject`: `number` for arrays, `keyof T`
 * otherwise. Useful when writing a helper that has to be generic over both.
 */
export type KeyType<T extends ReactiveObject> = T extends any[] ? number : keyof T;

export function destructure<T extends ReactiveObject>(source: T): Spread<T> {
  const isArray = Array.isArray(source);
  // The accessors live outside the proxy target. Writing them onto the target
  // would mean assigning an accessor to `length` on an array, which throws.
  const refs = new Map<PropertyKey, () => unknown>();

  return new Proxy((isArray ? [] : {}) as Spread<T>, {
    get(_target, key) {
      // `length` and the symbol-keyed members (`Symbol.iterator` above all)
      // have to keep their original meaning, otherwise the proxy stops
      // behaving like an array and destructuring it throws. They are read off
      // the source directly, so reading them inside a reactive scope still
      // tracks whatever the source tracks.
      if (typeof key === 'symbol' || (isArray && key === 'length')) {
        return source[key as keyof T];
      }
      const ref = refs.get(key);
      if (ref) {
        return ref;
      }
      const newRef = createMemo(() => source[key as keyof T]);
      refs.set(key, newRef);
      return newRef;
    },
  });
}

export function spread<T extends ReactiveObject>(source: T): Spread<T> {
  const proxy = (Array.isArray(source) ? [] : {}) as Spread<T>;

  for (const key of Object.keys(source)) {
    const k = key as keyof Spread<T>;
    proxy[k] = createMemo(() => source[k]);
  }

  return proxy;
}
