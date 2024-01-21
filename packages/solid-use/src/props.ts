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

export type Spread<T extends ReactiveObject> = {
  [key in keyof T]: Readonly<() => T[key]>;
};

export type KeyType<T extends ReactiveObject> = T extends any[]
  ? number
  : keyof T;

export function destructure<T extends ReactiveObject>(source: T): Spread<T> {
  const proxy = new Proxy((Array.isArray(source) ? [] : {}) as Spread<T>, {
    get(target, key) {
      const ref = Reflect.get(target, key);
      if (ref) {
        return ref;
      }
      const newRef = createMemo(() => source[key as keyof T]);
      Reflect.set(target, key, newRef);
      return newRef;
    },
  });

  return proxy;
}

export function spread<T extends ReactiveObject>(source: T): Spread<T> {
  const proxy = (Array.isArray(source) ? [] : {}) as Spread<T>;

  for (const key of Object.keys(source)) {
    const k = key as keyof Spread<T>;
    proxy[k] = createMemo(() => source[k]);
  }

  return proxy;
}
