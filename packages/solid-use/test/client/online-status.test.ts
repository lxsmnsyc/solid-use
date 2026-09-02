import { createRoot, createTrackedEffect, flush } from 'solid-js';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useOnlineStatus from '../../src/online-status';

function setOnline(value: boolean, event: 'online' | 'offline') {
  Object.defineProperty(navigator, 'onLine', {
    configurable: true,
    get: () => value,
  });
  window.dispatchEvent(new Event(event));
}

afterEach(() => {
  Object.defineProperty(navigator, 'onLine', {
    configurable: true,
    get: () => true,
  });
});

describe('useOnlineStatus', () => {
  it('starts as online', () => {
    createRoot((dispose) => {
      expect(useOnlineStatus()()).toBe(true);
      dispose();
    });
  });

  it('adopts the current status once effects have settled', () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => false,
    });

    createRoot((dispose) => {
      const isOnline = useOnlineStatus();
      flush();
      expect(isOnline()).toBe(false);
      dispose();
    });
  });

  it('tracks the online and offline events', () => {
    createRoot((dispose) => {
      const isOnline = useOnlineStatus();
      const seen: boolean[] = [];

      createTrackedEffect(() => {
        seen.push(isOnline());
      });
      flush();

      setOnline(false, 'offline');
      flush();
      setOnline(true, 'online');
      flush();

      expect(seen).toEqual([true, false, true]);
      dispose();
    });
  });

  it('removes its listeners when disposed', () => {
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');

    createRoot((dispose) => {
      useOnlineStatus();
      flush();
      expect(add.mock.calls.map((call) => call[0])).toEqual(
        expect.arrayContaining(['online', 'offline']),
      );
      dispose();
    });
    flush();

    expect(remove.mock.calls.map((call) => call[0])).toEqual(
      expect.arrayContaining(['online', 'offline']),
    );

    add.mockRestore();
    remove.mockRestore();
  });
});
