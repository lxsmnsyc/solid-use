import { createRoot } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import { destructure, omitProps, pickProps, spread } from '../../src/props';

// Reactive tracking is asserted in `test/client/props.test.ts`.
describe('omitProps', () => {
  it('drops the listed keys', () => {
    const result = omitProps({ a: 1, b: 2, c: 3 }, ['b']);
    expect(Object.keys(result)).toEqual(['a', 'c']);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('keeps every key when nothing is omitted', () => {
    expect(omitProps({ a: 1, b: 2 }, [])).toEqual({ a: 1, b: 2 });
  });

  it('ignores keys that are not present', () => {
    expect(omitProps({ a: 1 }, ['b' as never])).toEqual({ a: 1 });
  });

  it('reads the source lazily', () => {
    const getter = vi.fn(() => 1);
    const source = {};
    Object.defineProperty(source, 'a', { get: getter, enumerable: true });

    const result = omitProps(source as { a: number }, []);
    expect(getter).not.toHaveBeenCalled();

    expect(result.a).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);
  });
});

describe('pickProps', () => {
  it('keeps only the listed keys', () => {
    const result = pickProps({ a: 1, b: 2, c: 3 }, ['a', 'c']);
    expect(Object.keys(result)).toEqual(['a', 'c']);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('returns an empty object when nothing is picked', () => {
    expect(pickProps({ a: 1, b: 2 }, [])).toEqual({});
  });

  it('reads the source lazily', () => {
    const getter = vi.fn(() => 1);
    const source = {};
    Object.defineProperty(source, 'a', { get: getter, enumerable: true });

    const result = pickProps(source as { a: number }, ['a']);
    expect(getter).not.toHaveBeenCalled();

    expect(result.a).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);
  });
});

describe('destructure', () => {
  it('exposes each field as an accessor', () => {
    createRoot((dispose) => {
      const { greeting, target } = destructure({
        greeting: 'Hello',
        target: 'Solid',
      });
      expect(greeting()).toBe('Hello');
      expect(target()).toBe('Solid');
      dispose();
    });
  });

  it('reuses the accessor it created for a field', () => {
    createRoot((dispose) => {
      const props = destructure({ a: 1 });
      expect(props.a).toBe(props.a);
      dispose();
    });
  });

  it('only creates accessors for the fields that are read', () => {
    createRoot((dispose) => {
      const getter = vi.fn(() => 1);
      const source = {};
      Object.defineProperty(source, 'a', { get: getter, enumerable: true });
      Object.defineProperty(source, 'b', {
        get: () => 2,
        enumerable: true,
      });

      const props = destructure(source as { a: number; b: number });
      expect(getter).not.toHaveBeenCalled();
      expect(props.b()).toBe(2);
      expect(getter).not.toHaveBeenCalled();
      dispose();
    });
  });

  it('supports arrays by index', () => {
    createRoot((dispose) => {
      const source = destructure([1, 2]);
      expect(source[0]()).toBe(1);
      expect(source[1]()).toBe(2);
      dispose();
    });
  });

  it('supports array destructuring', () => {
    createRoot((dispose) => {
      const [first, second] = destructure([1, 2]);
      expect(first()).toBe(1);
      expect(second()).toBe(2);
      dispose();
    });
  });

  it('keeps array length and iteration intact', () => {
    createRoot((dispose) => {
      const source = destructure([1, 2, 3]);
      expect(Array.isArray(source)).toBe(true);
      expect(source.length).toBe(3);
      expect([...source].map((read) => read())).toEqual([1, 2, 3]);
      dispose();
    });
  });

  it('treats length as a field on non-array sources', () => {
    createRoot((dispose) => {
      const source = destructure({ length: 7 });
      expect(source.length()).toBe(7);
      dispose();
    });
  });
});

describe('spread', () => {
  it('exposes every field as an accessor', () => {
    createRoot((dispose) => {
      const props = spread({ greeting: 'Hello', target: 'Solid' });
      expect(Object.keys(props)).toEqual(['greeting', 'target']);
      expect(props.greeting()).toBe('Hello');
      expect(props.target()).toBe('Solid');
      dispose();
    });
  });

  it('reads every field eagerly', () => {
    createRoot((dispose) => {
      const getter = vi.fn(() => 1);
      const source = {};
      Object.defineProperty(source, 'a', { get: getter, enumerable: true });

      spread(source as { a: number });
      expect(getter).toHaveBeenCalled();
      dispose();
    });
  });
});
