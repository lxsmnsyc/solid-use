import { renderToString } from '@solidjs/web';
import { createRoot, flush } from 'solid-js';
import { describe, expect, it } from 'vitest';
import {
  useMediaQuery,
  usePrefersDark,
  usePrefersLight,
  usePrefersReducedMotion,
} from '../../src/media-query';

describe('useMediaQuery (SSR)', () => {
  it('resolves to false without calling matchMedia', () => {
    // `window.matchMedia` does not exist here, so an eager lookup would throw.
    expect(typeof window).toBe('undefined');
    expect(renderToString(() => String(useMediaQuery('(min-width: 100px)')()))).toContain('false');
  });

  it('stays false after effects are flushed', () => {
    createRoot((dispose) => {
      const matches = useMediaQuery('(orientation: portrait)');
      flush();
      expect(matches()).toBe(false);
      dispose();
    });
  });

  it.each([
    ['usePrefersDark', usePrefersDark],
    ['usePrefersLight', usePrefersLight],
    ['usePrefersReducedMotion', usePrefersReducedMotion],
  ])('%s resolves to false', (_name, use) => {
    createRoot((dispose) => {
      expect(use()()).toBe(false);
      dispose();
    });
  });
});
