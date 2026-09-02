import { createRoot, createTrackedEffect, flush } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useMediaQuery,
  usePrefersDark,
  usePrefersLight,
  usePrefersReducedMotion,
} from '../../src/media-query';

interface FakeMediaQueryList {
  media: string;
  matches: boolean;
  listeners: Set<() => void>;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  /** Flip `matches` and notify, the way a real `MediaQueryList` would. */
  emit(matches: boolean): void;
}

const registry = new Map<string, FakeMediaQueryList>();

function createFakeMedia(query: string): FakeMediaQueryList {
  const listeners = new Set<() => void>();
  const instance: FakeMediaQueryList = {
    media: query,
    matches: false,
    listeners,
    addEventListener: vi.fn((_type: string, listener: () => void) => {
      listeners.add(listener);
    }),
    removeEventListener: vi.fn((_type: string, listener: () => void) => {
      listeners.delete(listener);
    }),
    emit(matches: boolean): void {
      instance.matches = matches;
      for (const listener of listeners) {
        listener();
      }
    },
  };
  return instance;
}

function media(query: string): FakeMediaQueryList {
  const existing = registry.get(query);
  if (existing) {
    return existing;
  }
  const created = createFakeMedia(query);
  registry.set(query, created);
  return created;
}

// `src/media-query.ts` caches `MediaQueryList` instances per query string, so
// every test uses a query of its own to stay independent.
let counter = 0;
function uniqueQuery(): string {
  counter += 1;
  return `(min-width: ${counter}px)`;
}

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => media(query)),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useMediaQuery', () => {
  it('starts as not matching', () => {
    createRoot((dispose) => {
      expect(useMediaQuery(uniqueQuery())()).toBe(false);
      dispose();
    });
  });

  it('does not touch matchMedia before effects settle', () => {
    createRoot((dispose) => {
      useMediaQuery(uniqueQuery());
      expect(window.matchMedia).not.toHaveBeenCalled();
      flush();
      expect(window.matchMedia).toHaveBeenCalledTimes(1);
      dispose();
    });
  });

  it('adopts the current match once effects have settled', () => {
    const query = uniqueQuery();
    media(query).matches = true;

    createRoot((dispose) => {
      const matches = useMediaQuery(query);
      flush();
      expect(matches()).toBe(true);
      dispose();
    });
  });

  it('tracks change events', () => {
    const query = uniqueQuery();

    createRoot((dispose) => {
      const matches = useMediaQuery(query);
      const seen: boolean[] = [];

      createTrackedEffect(() => {
        seen.push(matches());
      });
      flush();

      media(query).emit(true);
      flush();
      media(query).emit(false);
      flush();

      expect(seen).toEqual([false, true, false]);
      dispose();
    });
  });

  it('removes its listener when disposed', () => {
    const query = uniqueQuery();

    createRoot((dispose) => {
      useMediaQuery(query);
      flush();
      expect(media(query).listeners.size).toBe(1);
      dispose();
    });
    flush();

    expect(media(query).listeners.size).toBe(0);
  });

  it('reuses one MediaQueryList per query', () => {
    const query = uniqueQuery();

    createRoot((dispose) => {
      useMediaQuery(query);
      useMediaQuery(query);
      flush();
      expect(window.matchMedia).toHaveBeenCalledTimes(1);
      dispose();
    });
  });
});

describe('media query shorthands', () => {
  it.each([
    [usePrefersDark, '(prefers-color-scheme: dark)'],
    [usePrefersLight, '(prefers-color-scheme: light)'],
    [usePrefersReducedMotion, '(prefers-reduced-motion)'],
  ])('subscribes to the matching query', (use, query) => {
    createRoot((dispose) => {
      const matches = use();
      flush();
      expect(matches()).toBe(false);

      media(query).emit(true);
      flush();
      expect(matches()).toBe(true);

      media(query).emit(false);
      flush();
      dispose();
    });
  });
});
