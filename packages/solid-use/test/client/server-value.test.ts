import { hydrate, render } from '@solidjs/web';
import { createRoot } from 'solid-js';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useServerValue from '../../src/server-value';
import { SCENARIO_PAYLOAD, renderScenario } from '../fixtures/server-value';

interface HydrationGlobal {
  events: unknown[];
  completed: WeakSet<object>;
  r: Record<string, unknown>;
  fe(): void;
  done?: boolean;
}

/** Recreates what Solid's hydration script installs on the page. */
function installPayload(payload: Record<string, unknown>): void {
  const hy: HydrationGlobal = {
    events: [],
    completed: new WeakSet(),
    r: { ...payload },
    fe() {
      // The real script uses this to flush queued events; nothing to do here.
    },
  };
  (globalThis as { _$HY?: HydrationGlobal })._$HY = hy;
}

function mount() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return container;
}

afterEach(() => {
  delete (globalThis as { _$HY?: HydrationGlobal })._$HY;
  document.body.innerHTML = '';
});

describe('useServerValue (hydration)', () => {
  it('replays the serialized values instead of running the callbacks', () => {
    installPayload(SCENARIO_PAYLOAD);

    const first = vi.fn(() => -1);
    const second = vi.fn(() => 'client');
    let result: { first: number; second: string } | undefined;

    const dispose = hydrate(() => {
      result = renderScenario(first, second);
      return null;
    }, mount());

    expect(result).toEqual({ first: 42, second: 'hello' });
    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
    dispose();
  });

  it('runs the callback for an id the server did not serialize', () => {
    installPayload({});

    const cb = vi.fn(() => 'computed');
    let value: string | undefined;

    const dispose = hydrate(() => {
      value = useServerValue(cb);
      return null;
    }, mount());

    expect(value).toBe('computed');
    expect(cb).toHaveBeenCalledTimes(1);
    dispose();
  });

  it('runs the callback on a client-only render', () => {
    const cb = vi.fn(() => 'client only');
    let value: string | undefined;

    const dispose = render(() => {
      value = useServerValue(cb);
      return null;
    }, mount());

    expect(value).toBe('client only');
    expect(cb).toHaveBeenCalledTimes(1);
    dispose();
  });

  it('runs the callback outside of an owner', () => {
    expect(useServerValue(() => 'ownerless')).toBe('ownerless');
  });

  it('runs the callback inside a bare root', () => {
    createRoot((dispose) => {
      expect(useServerValue(() => 'bare')).toBe('bare');
      dispose();
    });
  });
});
