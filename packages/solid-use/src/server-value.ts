import {
  createComponent,
  createContext,
  createUniqueId,
  JSX,
  useContext,
} from 'solid-js';
import {
  serialize,
  ServerValue,
} from 'seroval';
import {
  isServer,
  useAssets,
} from 'solid-js/web';

const ServerValueContext = createContext<Record<string, ServerValue>>();

const SOLID_USE = '__SOLID_USE_SV__';

function serializeServerValue<T extends ServerValue>(id: string, value: T): JSX.Element {
  const target = `window.${SOLID_USE}`;
  const init = `${target}=${target}||{}`;
  const assignment = `(${init})[${JSON.stringify(id)}]=${serialize(value)};`;
  return {
    t: `<script>${assignment}</script>`,
  } as unknown as JSX.Element;
}

declare const window: Window & {
  [key in typeof SOLID_USE]: Record<string, ServerValue>;
};

export function useServerValue<T extends ServerValue>(source: () => T): T {
  const id = createUniqueId();

  const record = useContext(ServerValueContext);

  if (record) {
    if (isServer) {
      record[id] = source();
    }
    if (id in record) {
      return record[id] as T;
    }
    return source();
  }
  if (isServer) {
    const value = source();
    useAssets(() => serializeServerValue(id, value));
    return value;
  }
  if (id in window[SOLID_USE]) {
    return window[SOLID_USE][id] as T;
  }
  return source();
}

export interface ServerValueBoundaryProps {
  values: Record<string, ServerValue>;
  children: JSX.Element;
}

export function serializeServerValues(value: Record<string, ServerValue>): JSX.Element {
  const target = `window.${SOLID_USE}`;
  const assignment = `${target}=Object.assign(${target}||{},${serialize(value)});`;
  return {
    t: `<script>${assignment}</script>`,
  } as unknown as JSX.Element;
}

export function useSerializeServerValues(
  values: Record<string, ServerValue>,
): void {
  useAssets(() => serializeServerValues(values));
}

export function ServerValueBoundary(props: ServerValueBoundaryProps): JSX.Element {
  const values = props.values || {};
  if (!isServer) {
    Object.assign(values, window[SOLID_USE]);
  } else if (!props.values) {
    useAssets(() => serializeServerValues(values));
  }
  return (
    createComponent(ServerValueContext.Provider, {
      value: values,
      get children() {
        return props.children;
      },
    })
  );
}
