import { renderToString } from '@solidjs/web';
import { createRoot } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import useServerValue from '../../src/server-value';
import {
  SCENARIO_IDS,
  SCENARIO_PAYLOAD,
  parsePayload,
  renderScenario,
} from '../fixtures/server-value';

describe('useServerValue (SSR)', () => {
  it('returns the value produced by the callback', () => {
    let value: number | undefined;
    renderToString(() => {
      value = useServerValue(() => 42);
      return '';
    });
    expect(value).toBe(42);
  });

  it('serializes the value into the hydration payload', () => {
    const html = renderToString(() => {
      const result = renderScenario(
        () => 42,
        () => 'hello',
      );
      return `${result.first}-${result.second}`;
    });

    expect(parsePayload(html)).toEqual(SCENARIO_PAYLOAD);
  });

  it('keys each value with its own hydration id', () => {
    const html = renderToString(() => {
      renderScenario(
        () => 42,
        () => 'hello',
      );
      return '';
    });

    expect(Object.keys(parsePayload(html))).toEqual([...SCENARIO_IDS]);
  });

  it('runs the callback exactly once per render', () => {
    const cb = vi.fn(() => 'once');
    renderToString(() => {
      useServerValue(cb);
      return '';
    });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('falls back to the callback outside of an SSR render', () => {
    createRoot((dispose) => {
      expect(useServerValue(() => 'plain')).toBe('plain');
      dispose();
    });
  });

  it('falls back to the callback without an owner', () => {
    expect(useServerValue(() => 'ownerless')).toBe('ownerless');
  });
});
