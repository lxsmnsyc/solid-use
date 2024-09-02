import type { Component } from 'solid-js';
import { onCleanup } from 'solid-js';

let PROVIDER: ProviderTree | undefined;

interface ProviderData<T> {
  value: T;
}

interface ProviderTree {
  parent?: ProviderTree;
  data: Record<string, ProviderData<any> | undefined>;
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

export function providerScope<T>(callback: () => T): T {
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

export interface Provider<T> {
  id: number;
  defaultValue: T;
}

let ID = 0;

export function createProvider<T>(defaultValue: T): Provider<T> {
  return {
    id: ID++,
    defaultValue,
  };
}

export function provide<T>(context: Provider<T>, value: T): void {
  const parent = PROVIDER;
  if (parent) {
    parent.data[context.id] = { value };

    onCleanup(() => {
      parent.data[context.id] = undefined;
    });
  }
}

export function inject<T>(context: Provider<T>): T {
  let current = PROVIDER;
  while (current) {
    const currentData = current.data[context.id];
    if (currentData) {
      return currentData.value;
    }
    current = current.parent;
  }
  return context.defaultValue;
}

export function withProvider<T>(Comp: Component<T>): Component<T> {
  return props => providerScope(() => Comp(props));
}
