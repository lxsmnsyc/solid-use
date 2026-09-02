import { createRoot, createTrackedEffect, flush } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import atom from '../../src/atom';

describe('atom', () => {
  it('exposes the written value once the update has settled', () => {
    createRoot((dispose) => {
      const value = atom('Hello');
      value('Bonjour');
      flush();
      expect(value()).toBe('Bonjour');
      dispose();
    });
  });

  it('notifies dependents when the value changes', () => {
    createRoot((dispose) => {
      const value = atom(0);
      const seen: number[] = [];

      createTrackedEffect(() => {
        seen.push(value());
      });
      flush();

      value(1);
      flush();
      value(2);
      flush();

      expect(seen).toEqual([0, 1, 2]);
      dispose();
    });
  });

  it('skips notifications for equal values', () => {
    createRoot((dispose) => {
      const value = atom(0);
      const spy = vi.fn();

      createTrackedEffect(() => {
        spy(value());
      });
      flush();

      value(0);
      flush();

      expect(spy).toHaveBeenCalledTimes(1);
      dispose();
    });
  });

  it('honors a custom equality function', () => {
    createRoot((dispose) => {
      const value = atom({ id: 1 }, (a, b) => a.id === b.id);
      const spy = vi.fn();

      createTrackedEffect(() => {
        spy(value());
      });
      flush();

      // Different reference, same identity: no notification.
      value({ id: 1 });
      flush();
      expect(spy).toHaveBeenCalledTimes(1);

      value({ id: 2 });
      flush();
      expect(spy).toHaveBeenCalledTimes(2);
      dispose();
    });
  });

  it('writes a function as a value instead of treating it as an updater', () => {
    createRoot((dispose) => {
      const first = () => 'first';
      const second = () => 'second';
      const value = atom<() => string>(first);

      value(second);
      flush();

      expect(value()).toBe(second);
      dispose();
    });
  });

  it('notifies dependents when a function value changes', () => {
    createRoot((dispose) => {
      const first = () => 'first';
      const second = () => 'second';
      const value = atom<() => string>(first);
      const seen: (() => string)[] = [];

      createTrackedEffect(() => {
        seen.push(value());
      });
      flush();

      value(second);
      flush();

      expect(seen).toEqual([first, second]);
      dispose();
    });
  });

  it('stops notifying after the owner is disposed', () => {
    const spy = vi.fn();
    let value!: ReturnType<typeof atom<number>>;

    createRoot((dispose) => {
      value = atom(0);
      createTrackedEffect(() => {
        spy(value());
      });
      flush();
      dispose();
    });

    value(1);
    flush();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
