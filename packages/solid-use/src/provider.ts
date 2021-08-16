import { onCleanup } from 'solid-js';

let PROVIDER: ContextTree | undefined;

interface ContextData<T> {
  value: T;
}

interface ContextTree {
  parent?: ContextTree;
  data: Record<string, ContextData<any> | undefined>;
}

export function capturedProvider<T extends any[], R>(
  callback: (...args: T) => R,
): (...args: T) => R {
  const current = PROVIDER;
  return (...args) => {
    const parent = PROVIDER;
    PROVIDER = current;
    try {
      return callback(...args);
    } finally {
      PROVIDER = parent;
    }
  };
}

export function withProvider<T>(callback: () => T): T {
  const parent = PROVIDER;
  PROVIDER = {
    parent,
    data: {},
  };
  try {
    return callback();
  } finally {
    PROVIDER = parent;
  }
}

export interface Context<T> {
  id: number;
  defaultValue: T;
}

let ID = 0;

export function createProvider<T>(defaultValue: T): Context<T> {
  return {
    id: ID++,
    defaultValue,
  };
}

export function provide<T>(context: Context<T>, value: T): void {
  const parent = PROVIDER;
  if (parent) {
    parent.data[context.id] = { value };

    // If provide is called in a linked work,
    // make sure to delete the written data.
    onCleanup(() => {
      parent.data[context.id] = undefined;
    });
  }
}

export function inject<T>(context: Context<T>): T {
  let current = PROVIDER;
  while (current) {
    const currentData = current.data[context.id];
    if (currentData) {
      return currentData.value;
    }
    current = PROVIDER?.parent;
  }
  return context.defaultValue;
}
