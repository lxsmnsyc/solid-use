import { createRoot, createTrackedEffect, flush } from 'solid-js';
import { afterEach, describe, expect, it, vi } from 'vitest';
import usePageVisibility from '../../src/page-visibility';

function setVisibility(value: DocumentVisibilityState) {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => value,
  });
  document.dispatchEvent(new Event('visibilitychange'));
}

afterEach(() => {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => 'visible',
  });
});

describe('usePageVisibility', () => {
  it('starts as visible', () => {
    createRoot((dispose) => {
      expect(usePageVisibility()()).toBe(true);
      dispose();
    });
  });

  it('adopts the current state once effects have settled', () => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });

    createRoot((dispose) => {
      const isVisible = usePageVisibility();
      flush();
      expect(isVisible()).toBe(false);
      dispose();
    });
  });

  it('tracks visibilitychange events', () => {
    createRoot((dispose) => {
      const isVisible = usePageVisibility();
      const seen: boolean[] = [];

      createTrackedEffect(() => {
        seen.push(isVisible());
      });
      flush();

      setVisibility('hidden');
      flush();
      setVisibility('visible');
      flush();

      expect(seen).toEqual([true, false, true]);
      dispose();
    });
  });

  it('removes its listener when disposed', () => {
    const remove = vi.spyOn(document, 'removeEventListener');

    createRoot((dispose) => {
      usePageVisibility();
      flush();
      dispose();
    });
    flush();

    expect(remove.mock.calls.map((call) => call[0])).toContain('visibilitychange');
    remove.mockRestore();
  });
});
