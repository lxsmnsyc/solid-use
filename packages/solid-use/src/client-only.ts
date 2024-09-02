import type { Component, JSX } from 'solid-js';
import {
  Show,
  createComponent,
  createMemo,
  createSignal,
  lazy,
  onMount,
  sharedConfig,
} from 'solid-js';
import { isServer } from 'solid-js/web';

export const createClientSignal = isServer
  ? (): (() => boolean) => () => false
  : (): (() => boolean) => {
      const [flag, setFlag] = createSignal(false);

      onMount(() => {
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

export function clientOnly<T extends Component<any>>(
  fn: () => Promise<{ default: T }>,
): T {
  const Lazy = lazy(fn);
  return ((props: any) => {
    if (sharedConfig.context) {
      const isClient = createClientSignal();

      return createMemo(() => {
        if (isClient()) {
          return createComponent(Lazy, props);
        }
        return undefined;
      });
    }
    return createComponent(Lazy, props);
  }) as unknown as T;
}

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
