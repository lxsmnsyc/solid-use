import { createRoot } from 'solid-js';
import { describe, expect, it } from 'vitest';
import atom from '../../src/atom';

// Reactive behavior is asserted in `test/client/atom.test.ts`; signals are
// inert during SSR, so only the value semantics are shared.
describe('atom', () => {
  it('reads the initial value', () => {
    createRoot((dispose) => {
      const value = atom('Hello');
      expect(value()).toBe('Hello');
      dispose();
    });
  });

  it('reads an initial value of any type', () => {
    createRoot((dispose) => {
      const object = { id: 1 };
      expect(atom(object)()).toBe(object);
      expect(atom(null)()).toBeNull();
      expect(atom<number | undefined>(undefined)()).toBeUndefined();
      dispose();
    });
  });

  it('holds a function as a value instead of calling it', () => {
    createRoot((dispose) => {
      const fn = () => 'called';
      expect(atom<() => string>(fn)()).toBe(fn);
      dispose();
    });
  });
});
