import { getOwner, sharedConfig } from 'solid-js';

/**
 * The subset of Solid's `sharedConfig` that this primitive relies on.
 *
 * `sharedConfig` is a different object on the server and on the client, but
 * their shapes overlap: both expose `getNextContextId`, the server adds
 * `context` (used to serialize a value into the HTML payload) and the client
 * adds `hydrating`/`has`/`load` (used to read that payload back). Describing
 * the union lets a single implementation cover both environments, so the
 * primitive no longer needs to be branched on `isServer` at build time.
 */
interface UniversalSharedConfig {
  context?: {
    serialize: (id: string, value: unknown, deferStream?: boolean) => void;
  };
  hydrating?: boolean;
  has?: (id: string) => boolean;
  load?: (id: string) => unknown;
  getNextContextId: () => string | undefined;
}

/**
 * Reads the next hydration id for the current owner, or `undefined` when there
 * is none to read.
 *
 * `getNextContextId` throws when the owner is not part of a hydratable tree -
 * a bare `createRoot`, for instance - and returns `undefined` inside a
 * `NoHydration` boundary. Both mean the same thing here: there is no id to key
 * the value with.
 */
function nextHydrationId(config: UniversalSharedConfig): string | undefined {
  if (!getOwner()) {
    return undefined;
  }
  try {
    return config.getNextContextId();
  } catch {
    return undefined;
  }
}

/**
 * Runs `cb` on the server and replays its result on the client so that
 * non-idempotent values (`Math.random`, `Date.now`, generated ids, ...) stay
 * identical across the SSR/hydration boundary.
 *
 * Both halves key the value by the same hydration id, which is why they can
 * share one implementation: whichever half of `sharedConfig` is present
 * decides whether the id is written to or read from the payload.
 *
 * When neither half applies - a client-only render, a render that has already
 * finished hydrating, a call outside of a hydratable owner, or a call inside a
 * `NoHydration` boundary - there is no id to key against and `cb` is simply
 * invoked.
 */
export default function useServerValue<T>(cb: () => T): T {
  const config = sharedConfig as UniversalSharedConfig;
  const { context, has, load } = config;
  const hydrating = config.hydrating === true && has != null && load != null;

  if (!(hydrating || context != null)) {
    return cb();
  }

  const id = nextHydrationId(config);
  if (id == null) {
    return cb();
  }

  if (hydrating && has(id)) {
    return load(id) as T;
  }

  const value = cb();
  context?.serialize(id, value, false);
  return value;
}
