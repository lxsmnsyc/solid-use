import { createRoot, createTrackedEffect, flush } from 'solid-js';
import { describe, expect, it } from 'vitest';
import atom from '../../src/atom';
import { destructure, omitProps, pickProps, spread } from '../../src/props';

function reactiveSource() {
  const a = atom(1);
  const b = atom(2);
  return {
    write: { a, b },
    props: {
      get a() {
        return a();
      },
      get b() {
        return b();
      },
    },
  };
}

describe('omitProps', () => {
  it('stays reactive for the keys it keeps', () => {
    createRoot((dispose) => {
      const { write, props } = reactiveSource();
      const result = omitProps(props, ['b']);
      const seen: number[] = [];

      createTrackedEffect(() => {
        seen.push(result.a);
      });
      flush();

      write.a(10);
      flush();

      expect(seen).toEqual([1, 10]);
      dispose();
    });
  });
});

describe('pickProps', () => {
  it('stays reactive for the keys it picks', () => {
    createRoot((dispose) => {
      const { write, props } = reactiveSource();
      const result = pickProps(props, ['a']);
      const seen: number[] = [];

      createTrackedEffect(() => {
        seen.push(result.a);
      });
      flush();

      write.a(10);
      flush();

      expect(seen).toEqual([1, 10]);
      dispose();
    });
  });
});

describe('destructure', () => {
  it('tracks the source through the generated accessors', () => {
    createRoot((dispose) => {
      const { write, props } = reactiveSource();
      const { a } = destructure(props);

      expect(a()).toBe(1);
      write.a(10);
      flush();
      expect(a()).toBe(10);
      dispose();
    });
  });

  it('does not recompute an accessor for an untouched field', () => {
    createRoot((dispose) => {
      const { write, props } = reactiveSource();
      const { a } = destructure(props);
      const seen: number[] = [];

      createTrackedEffect(() => {
        seen.push(a());
      });
      flush();

      write.b(20);
      flush();

      expect(seen).toEqual([1]);
      dispose();
    });
  });
});

describe('destructure (arrays)', () => {
  it('tracks array entries through destructuring', () => {
    createRoot((dispose) => {
      const first = atom(1);
      const source: number[] = [];
      Object.defineProperty(source, 0, {
        configurable: true,
        enumerable: true,
        get: () => first(),
      });
      source[1] = 2;

      const [a, b] = destructure(source);
      expect(a()).toBe(1);
      expect(b()).toBe(2);

      first(10);
      flush();
      expect(a()).toBe(10);
      dispose();
    });
  });
});

describe('spread', () => {
  it('tracks the source through the generated accessors', () => {
    createRoot((dispose) => {
      const { write, props } = reactiveSource();
      const result = spread(props);

      expect(result.a()).toBe(1);
      write.a(10);
      flush();
      expect(result.a()).toBe(10);
      dispose();
    });
  });
});
