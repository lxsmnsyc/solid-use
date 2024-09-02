import type { Resource } from 'solid-js';
import { createEffect, createResource, createSignal } from 'solid-js';

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

export class SuspensefulFetchResponse {
  private input: Signalify<RequestInfo | URL>;

  private init?: Signalify<RequestInit | undefined>;

  constructor(
    input: Signalify<RequestInfo | URL>,
    init?: Signalify<RequestInit | undefined>,
  ) {
    this.input = input;
    this.init = init;
  }

  private readResponse(): FetchParameters {
    return [fromSignal(this.input), fromSignal(this.init)];
  }

  arrayBuffer(): Resource<ArrayBuffer | undefined> {
    return createResource(
      () => this.readResponse(),
      async ([localInput, localInit]) => {
        const response = await nativeFetch(localInput, localInit);
        return response.arrayBuffer();
      },
    )[0];
  }

  blob(): Resource<Blob | undefined> {
    return createResource(
      () => this.readResponse(),
      async ([localInput, localInit]) => {
        const response = await nativeFetch(localInput, localInit);
        return response.blob();
      },
    )[0];
  }

  formData(): Resource<FormData | undefined> {
    return createResource(
      () => this.readResponse(),
      async ([localInput, localInit]) => {
        const response = await nativeFetch(localInput, localInit);
        return response.formData();
      },
    )[0];
  }

  json<T>(): Resource<T> {
    return createResource(
      () => this.readResponse(),
      async ([localInput, localInit]) => {
        const response = await nativeFetch(localInput, localInit);
        return response.json();
      },
    )[0];
  }

  text(): Resource<string | undefined> {
    return createResource(
      () => this.readResponse(),
      async ([localInput, localInit]) => {
        const response = await nativeFetch(localInput, localInit);
        return response.text();
      },
    )[0];
  }
}

export interface FetchPending<T> {
  status: 'pending';
  value?: Promise<T>;
}

export interface FetchSuccess<T> {
  status: 'success';
  value: T;
}

export interface FetchFailure {
  status: 'failure';
  value: any;
}

export type FetchResult<T> = FetchPending<T> | FetchSuccess<T> | FetchFailure;

class InternalFetchResult<T> {
  private source: () => FetchResult<T>;

  constructor(source: () => FetchResult<T>) {
    this.source = source;
  }

  get value(): FetchResult<T>['value'] {
    return this.source().value;
  }

  get status(): FetchResult<T>['status'] {
    return this.source().status;
  }
}

function useAsync<T>(source: () => Promise<T>): FetchResult<T> {
  const [value, setValue] = createSignal<FetchResult<T>>({
    status: 'pending',
  });

  createEffect(() => {
    const result = source();

    setValue({
      status: 'pending',
      value: result,
    });

    result.then(
      val => {
        setValue({
          status: 'success',
          value: val,
        });
      },
      val => {
        setValue({
          status: 'failure',
          value: val,
        });
      },
    );
  });

  return new InternalFetchResult(value);
}

export class SuspenselessFetchResponse {
  private input: Signalify<RequestInfo | URL>;

  private init?: Signalify<RequestInit | undefined>;

  constructor(
    input: Signalify<RequestInfo | URL>,
    init?: Signalify<RequestInit | undefined>,
  ) {
    this.input = input;
    this.init = init;
  }

  private async readResponse() {
    return await nativeFetch(fromSignal(this.input), fromSignal(this.init));
  }

  arrayBuffer(): FetchResult<ArrayBuffer> {
    return useAsync(async () => {
      const response = await this.readResponse();
      return response.arrayBuffer();
    });
  }

  blob(): FetchResult<Blob> {
    return useAsync(async () => {
      const response = await this.readResponse();
      return response.blob();
    });
  }

  formData(): FetchResult<FormData> {
    return useAsync(async () => {
      const response = await this.readResponse();
      return response.formData();
    });
  }

  json<T>(): FetchResult<T> {
    return useAsync(async () => {
      const response = await this.readResponse();
      return response.json();
    });
  }

  text(): FetchResult<string> {
    return useAsync(async () => {
      const response = await this.readResponse();
      return response.text();
    });
  }
}

function fetch(
  input: Signalify<RequestInfo | URL>,
  init?: Signalify<RequestInit | undefined>,
  suspense?: false,
): SuspenselessFetchResponse;
function fetch(
  input: Signalify<RequestInfo | URL>,
  init?: Signalify<RequestInit | undefined>,
  suspense?: true,
): SuspensefulFetchResponse;
function fetch(
  input: Signalify<RequestInfo | URL>,
  init?: Signalify<RequestInit | undefined>,
  suspense?: boolean,
): SuspenselessFetchResponse | SuspensefulFetchResponse {
  if (suspense) {
    return new SuspensefulFetchResponse(input, init);
  }
  return new SuspenselessFetchResponse(input, init);
}

export default fetch;
