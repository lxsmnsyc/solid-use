import type { Component, Element } from 'solid-js';
import {
  Show,
  createComponent,
  createMemo,
  createSignal,
  createTrackedEffect,
  lazy,
} from 'solid-js';

/**
 * A signal that is `false` while rendering on the server (and during
 * hydration) and flips to `true` once the client has rendered.
 *
 * `createTrackedEffect` is a no-op on the server but still consumes a
 * hydration key, which keeps the server and client trees aligned without an
 * environment-specific implementation.
 */
export function createClientSignal(): () => boolean {
  // `ownedWrite` because the flag is flipped from inside the effect that owns
  // it, which Solid otherwise rejects as a write in an owned scope.
  const [flag, setFlag] = createSignal(false, { ownedWrite: true });

  createTrackedEffect(() => {
    setFlag(true);
  });

  return flag;
}

export interface ClientOnlyProps {
  fallback?: Element;
  children?: Element;
}

export const ClientOnly = (props: ClientOnlyProps): Element => {
  const isClient = createClientSignal();

  return Show({
    keyed: false,
    get when() {
      return isClient();
    },
    get fallback() {
      return props.fallback;
    },
    get children() {
      return props.children;
    },
  });
};

export function clientComponent<T extends Component<any>>(Comp: T): T {
  return ((props: any) => {
    const isClient = createClientSignal();

    return createMemo(() => {
      if (isClient()) {
        return createComponent(Comp, props);
      }
      return undefined;
    });
  }) as unknown as T;
}

export function clientOnly<T extends Component<any>>(fn: () => Promise<{ default: T }>): T {
  const Lazy = lazy(fn);
  return clientComponent(Lazy);
}
