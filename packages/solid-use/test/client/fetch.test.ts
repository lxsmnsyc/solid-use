import { createRoot, createTrackedEffect, flush, resolve } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import atom from '../../src/atom';

/**
 * The stand-in for `globalThis.fetch`. Handlers answer synchronously - or throw
 * - and the stub below is what turns that into the promise `fetch` returns.
 */
type FetchHandler = (input: RequestInfo | URL, init?: RequestInit) => Response;

let handler: FetchHandler = () => new Response('');
const nativeFetch = vi.fn(
  async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> =>
    await Promise.resolve(handler(input, init)),
);

// `src/fetch.ts` captures `globalThis.fetch` when it is first imported, so the
// stub has to be installed before the module is pulled in.
vi.stubGlobal('fetch', nativeFetch);
const {
  default: useFetch,
  SuspensefulFetchResponse,
  SuspenselessFetchResponse,
} = await import('../../src/fetch');

/** Subscribes to `read` so that the reactive source behind it starts running. */
function track(read: () => unknown): void {
  createTrackedEffect(() => {
    read();
  });
}

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    headers: { 'content-type': 'application/json' },
  });
}

beforeEach(() => {
  handler = () => jsonResponse({ message: 'ok' });
  nativeFetch.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('fetch', () => {
  it('returns a suspenseless response by default', () => {
    expect(useFetch('/api')).toBeInstanceOf(SuspenselessFetchResponse);
    expect(useFetch('/api', undefined, false)).toBeInstanceOf(SuspenselessFetchResponse);
  });

  it('returns a suspenseful response when asked for one', () => {
    expect(useFetch('/api', undefined, true)).toBeInstanceOf(SuspensefulFetchResponse);
  });

  it('does not request anything until a body is read', () => {
    useFetch('/api');
    expect(nativeFetch).not.toHaveBeenCalled();
  });
});

describe('SuspenselessFetchResponse', () => {
  it('starts pending and settles on success', async () => {
    await createRoot(async (dispose) => {
      const result = useFetch('/api').json<{ message: string }>();
      expect(result.status).toBe('pending');

      track(() => result.status);
      flush();

      await vi.waitFor(() => {
        flush();
        expect(result.status).toBe('success');
      });
      expect(result.value).toEqual({ message: 'ok' });
      dispose();
    });
  });

  it('reports a failure when the request rejects', async () => {
    const error = new Error('offline');
    handler = () => {
      throw error;
    };

    await createRoot(async (dispose) => {
      const result = useFetch('/api').json();

      track(() => result.status);
      flush();

      await vi.waitFor(() => {
        flush();
        expect(result.status).toBe('failure');
      });
      expect(result.value).toBe(error);
      dispose();
    });
  });

  it('reads the response as text', async () => {
    handler = () => new Response('plain body');

    await createRoot(async (dispose) => {
      const result = useFetch('/api').text();

      track(() => result.status);
      flush();

      await vi.waitFor(() => {
        flush();
        expect(result.value).toBe('plain body');
      });
      dispose();
    });
  });

  it('passes the input and init through to fetch', async () => {
    const init: RequestInit = { method: 'POST' };

    await createRoot(async (dispose) => {
      const result = useFetch('/api', init).text();

      track(() => result.status);
      flush();

      await vi.waitFor(() => {
        flush();
        expect(result.status).toBe('success');
      });
      expect(nativeFetch).toHaveBeenCalledWith('/api', init);
      dispose();
    });
  });

  it('refetches when a reactive input changes', async () => {
    await createRoot(async (dispose) => {
      const url = atom('/api/a');
      const result = useFetch(url).text();

      track(() => result.status);
      flush();

      await vi.waitFor(() => {
        flush();
        expect(nativeFetch).toHaveBeenCalledWith('/api/a', undefined);
      });

      url('/api/b');
      flush();

      await vi.waitFor(() => {
        flush();
        expect(nativeFetch).toHaveBeenCalledWith('/api/b', undefined);
      });
      dispose();
    });
  });
});

describe('SuspensefulFetchResponse', () => {
  it('resolves the parsed body', async () => {
    const value = await createRoot(async (dispose) => {
      const result = useFetch('/api', undefined, true).json<{
        message: string;
      }>();
      const awaited = await resolve(() => result());
      dispose();
      return awaited;
    });

    expect(value).toEqual({ message: 'ok' });
  });

  it('resolves the response as text', async () => {
    handler = () => new Response('plain body');

    const value = await createRoot(async (dispose) => {
      const result = useFetch('/api', undefined, true).text();
      const awaited = await resolve(() => result());
      dispose();
      return awaited;
    });

    expect(value).toBe('plain body');
  });

  it('reads reactive init options', async () => {
    const method = atom('GET');

    await createRoot(async (dispose) => {
      const result = useFetch('/api', () => ({ method: method() }), true).text();
      await resolve(() => result());
      dispose();
    });

    expect(nativeFetch).toHaveBeenCalledWith('/api', { method: 'GET' });
  });
});
