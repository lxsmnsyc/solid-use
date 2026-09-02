import { renderToString } from '@solidjs/web';
import { createRoot, flush } from 'solid-js';
import { describe, expect, it } from 'vitest';
import usePageVisibility from '../../src/page-visibility';

describe('usePageVisibility (SSR)', () => {
  it('resolves to true without touching the DOM', () => {
    // `document` does not exist here, so an eager subscription would throw.
    expect(typeof document).toBe('undefined');
    expect(renderToString(() => String(usePageVisibility()()))).toContain('true');
  });

  it('stays true after effects are flushed', () => {
    createRoot((dispose) => {
      const isVisible = usePageVisibility();
      flush();
      expect(isVisible()).toBe(true);
      dispose();
    });
  });
});
