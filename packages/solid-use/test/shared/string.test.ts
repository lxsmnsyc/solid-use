import { createRoot } from 'solid-js';
import { describe, expect, it } from 'vitest';
import string from '../../src/string';

// Reactive updates are asserted in `test/client/string.test.ts`.
describe('string', () => {
  it('returns a template with no interpolation unchanged', () => {
    createRoot((dispose) => {
      expect(string`Hello`()).toBe('Hello');
      dispose();
    });
  });

  it('interpolates plain values', () => {
    createRoot((dispose) => {
      expect(string`${'Hello'}, ${'Solid'}!`()).toBe('Hello, Solid!');
      dispose();
    });
  });

  it('interpolates accessors', () => {
    createRoot((dispose) => {
      const greeting = () => 'Bonjour';
      expect(string`${greeting}, Solid!`()).toBe('Bonjour, Solid!');
      dispose();
    });
  });

  it('mixes accessors and plain values', () => {
    createRoot((dispose) => {
      expect(string`${() => 'Hi'} ${'there'} ${42}`()).toBe('Hi there 42');
      dispose();
    });
  });

  it('stringifies non-string values', () => {
    createRoot((dispose) => {
      expect(string`${null} ${undefined} ${0} ${false}`()).toBe('null undefined 0 false');
      dispose();
    });
  });

  it('supports an interpolation in the leading position', () => {
    createRoot((dispose) => {
      expect(string`${'a'}b${'c'}`()).toBe('abc');
      dispose();
    });
  });
});
