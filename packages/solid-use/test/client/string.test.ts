import { createRoot, createTrackedEffect, flush } from 'solid-js';
import { describe, expect, it } from 'vitest';
import atom from '../../src/atom';
import string from '../../src/string';

describe('string', () => {
  it('recomputes when an interpolated accessor changes', () => {
    createRoot((dispose) => {
      const greeting = atom('Hello');
      const target = atom('Solid');
      const message = string`${greeting}, ${target}!`;

      expect(message()).toBe('Hello, Solid!');

      greeting('Bonjour');
      flush();
      expect(message()).toBe('Bonjour, Solid!');

      target('World');
      flush();
      expect(message()).toBe('Bonjour, World!');
      dispose();
    });
  });

  it('drives dependents of the returned accessor', () => {
    createRoot((dispose) => {
      const target = atom('Solid');
      const message = string`Hello, ${target}!`;
      const seen: string[] = [];

      createTrackedEffect(() => {
        seen.push(message());
      });
      flush();

      target('World');
      flush();

      expect(seen).toEqual(['Hello, Solid!', 'Hello, World!']);
      dispose();
    });
  });
});
