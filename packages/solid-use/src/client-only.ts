import { isServer } from '@solidjs/web';
import type { Component, JSX } from 'solid-js';
import {
  createComponent,
  createMemo,
  createSignal,
  createTrackedEffect,
  lazy,
  Show,
} from 'solid-js';

export const createClientSignal = isServer
  ? (): (() => boolean) => () => false
  : (): (() => boolean) => {
      const [flag, setFlag] = createSignal(false);

      createTrackedEffect(() => {
        setFlag(true);
      });

      return flag;
    };

export interface ClientOnlyProps {
  fallback?: JSX.Element;
  children?: JSX.Element;
}

export const ClientOnly = (props: ClientOnlyProps): JSX.Element => {
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

export function clientOnly<T extends Component<any>>(
  fn: () => Promise<{ default: T }>,
): T {
  const Lazy = lazy(fn);
  return clientComponent(Lazy);
}
