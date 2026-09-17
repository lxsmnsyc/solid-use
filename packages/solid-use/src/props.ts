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

type ReactiveObject = Record<string | symbol, any> | any[];

// `Readonly<() => T>` would drop the call signature and make `props.field()` a type error.
export type Spread<T extends ReactiveObject> = {
  [key in keyof T]: () => T[key];
};

export type KeyType<T extends ReactiveObject> = T extends any[] ? number : keyof T;

export function destructure<T extends ReactiveObject>(source: T): Spread<T> {
  const isArray = Array.isArray(source);
  // Accessors are cached outside the proxy target.
  // Storing them on an array target would assign a function to `length`, which throws.
  const refs = new Map<PropertyKey, () => unknown>();

  return new Proxy((isArray ? [] : {}) as Spread<T>, {
    get(_target, key) {
      // `length` and symbol keys such as `Symbol.iterator` are read from the source as is.
      // Without this, array destructuring and iteration break.
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
