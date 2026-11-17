import { renderToString } from '@solidjs/web';
import { createRoot, flush } from 'solid-js';
import { describe, expect, it } from 'vitest';
import useOnlineStatus from '../../src/online-status';

describe('useOnlineStatus (SSR)', () => {
  it('resolves to true without touching the DOM', () => {
    // `window` does not exist here, so an eager subscription would throw.
    expect(typeof window).toBe('undefined');
    expect(renderToString(() => String(useOnlineStatus()()))).toContain('true');
  });

  it('stays true after effects are flushed', () => {
    createRoot((dispose) => {
      const isOnline = useOnlineStatus();
      flush();
      expect(isOnline()).toBe(true);
      dispose();
    });
  });
});
