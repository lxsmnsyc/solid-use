import {
  JSX,
  getOwner,
  runWithOwner,
  createMemo,
  createResource,
} from 'solid-js';

export interface ClassicResourcePending<T> {
  status: 'pending';
  value: Promise<T>;
}

export interface ClassicResourceSuccess<T> {
  status: 'success';
  value: T;
}

export interface ClassicResourceFailure<F> {
  status: 'failure';
  value: F;
}

export type ClassicResourceResult<T, F> =
  | ClassicResourcePending<T>
  | ClassicResourceSuccess<T>
  | ClassicResourceFailure<F>;

export interface ClassicResource<T, F, Args extends any[] = []> {
  read: (...args: Args) => ClassicResourceResult<T, F>;
  clear: () => void;
}

export function createClassicResource<T, F, Args extends any[] = []>(
  fetcher: (...args: Args) => Promise<T>,
): ClassicResource<T, F, Args> {
  let result: ClassicResourceResult<T, F> | undefined;

  return {
    read(...args) {
      if (result == null) {
        try {
          const promise = fetcher(...args);
          promise.then(
            (value) => {
              result = {
                status: 'success',
                value,
              };
              return value;
            },
            (value: F) => {
              result = {
                status: 'failure',
                value,
              };
            },
          );
          result = {
            status: 'pending',
            value: promise,
          };
        } catch (error) {
          result = {
            status: 'failure',
            value: error as F,
          };
        }
      }
      return result;
    },
    clear() {
      result = undefined;
    },
  };
}

async function retryRender(
  constructor: () => JSX.Element,
  owner: ReturnType<typeof getOwner>,
): Promise<JSX.Element> {
  try {
    if (owner) {
      return runWithOwner(owner, constructor);
    }
    return constructor();
  } catch (error) {
    if (error instanceof Promise) {
      await error;
      return retryRender(constructor, owner);
    }
    throw error;
  }
}

export function createClassicSuspense(
  constructor: () => JSX.Element,
): () => JSX.Element {
  const result = createMemo(() => {
    const owner = getOwner();
    return retryRender(constructor, owner);
  });

  const [resource] = createResource(result, (value) => value);

  return () => resource();
}

export function waitForAll<S, F>(
  resources: ClassicResource<S, F>[],
): ClassicResource<S[], F> {
  return createClassicResource<S[], F>(() => {
    const results = resources.map((values) => values.read());
    const mappedResult = results.map((result) => {
      if (result.status === 'failure') {
        throw result.value;
      }
      return result.value;
    });

    return Promise.all(mappedResult);
  });
}

export function waitForAny<S, F>(
  resources: ClassicResource<S, F>[],
): ClassicResource<S, F> {
  return createClassicResource<S, F>(() => {
    const results = resources.map((values) => values.read());
    const mappedResult = results.map((result) => {
      if (result.status === 'failure') {
        throw result.value;
      }
      return result.value;
    });

    return Promise.race(mappedResult) as Promise<S>;
  });
}

export function useResourceResult<T, F>(result: ClassicResourceResult<T, F>) {
  if (result.status === 'success') {
    return result.value;
  }
  throw result.value;
}

export function useClassicResource<T, F, Args extends any[] = []>(
  resource: ClassicResource<T, F, Args>,
  args: Args,
): T {
  return useResourceResult(resource.read(...args));
}

const nativeFetch = globalThis.fetch;

type Signalify<T> = T | (() => T);

function isSignal<T>(value: Signalify<T>): value is () => T {
  return typeof value === 'function';
}

function fromSignal<T>(value: Signalify<T>): T {
  if (isSignal(value)) {
    return value();
  }
  return value;
}

type FetchParameters = [RequestInfo | URL, RequestInit | undefined];

export class ClassicSuspenseFetchResponse {
  private input: Signalify<RequestInfo | URL>;

  private init?: Signalify<RequestInit | undefined>;

  constructor(
    input: Signalify<RequestInfo | URL>,
    init?: Signalify<RequestInit | undefined>,
  ) {
    this.input = input;
    this.init = init;
  }

  private readInputs() {
    return createMemo((): FetchParameters => [
      fromSignal(this.input),
      fromSignal(this.init),
    ], undefined, {
      equals: (a, b) => a[0] !== b[0] && a[1] !== b[1],
    });
  }

  arrayBuffer(): () => ClassicResourceResult<ArrayBuffer, any> {
    const resource = createClassicResource(async (
      input: RequestInfo | URL,
      init: RequestInit | undefined,
    ) => {
      const response = await nativeFetch(input, init);
      return response.arrayBuffer();
    });

    const args = this.readInputs();

    return () => resource.read(...args());
  }

  blob(): () => ClassicResourceResult<Blob, any> {
    const resource = createClassicResource(async (
      input: RequestInfo | URL,
      init: RequestInit | undefined,
    ) => {
      const response = await nativeFetch(input, init);
      return response.blob();
    });

    const args = this.readInputs();

    return () => resource.read(...args());
  }

  formData(): () => ClassicResourceResult<FormData, any> {
    const resource = createClassicResource(async (
      input: RequestInfo | URL,
      init: RequestInit | undefined,
    ) => {
      const response = await nativeFetch(input, init);
      return response.formData();
    });

    const args = this.readInputs();

    return () => resource.read(...args());
  }

  json<T>(): () => ClassicResourceResult<T, any> {
    const resource = createClassicResource(async (
      input: RequestInfo | URL,
      init: RequestInit | undefined,
    ) => {
      const response = await nativeFetch(input, init);
      return response.json();
    });

    const args = this.readInputs();

    return () => resource.read(...args());
  }

  text(): () => ClassicResourceResult<string, any> {
    const resource = createClassicResource(async (
      input: RequestInfo | URL,
      init: RequestInit | undefined,
    ) => {
      const response = await nativeFetch(input, init);
      return response.text();
    });

    const args = this.readInputs();

    return () => resource.read(...args());
  }
}

export function fetch(
  input: Signalify<RequestInfo | URL>,
  init?: Signalify<RequestInit | undefined>,
): ClassicSuspenseFetchResponse {
  return new ClassicSuspenseFetchResponse(input, init);
}