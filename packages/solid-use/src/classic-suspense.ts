import {
  JSX,
  getOwner,
  runWithOwner,
  createMemo,
  createResource,
} from 'solid-js';

interface ClassicResourcePending<T> {
  status: 'pending';
  value: Promise<T>;
}

interface ClassicResourceSuccess<T> {
  status: 'success';
  value: T;
}

interface ClassicResourceFailure<F> {
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

export function useClassicResource<T, F>(
  resource: ClassicResource<T, F>,
): T {
  const result = resource.read();

  if (result.status === 'success') {
    return result.value;
  }
  throw result.value;
}
