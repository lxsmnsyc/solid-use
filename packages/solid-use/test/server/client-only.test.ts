import { renderToString } from '@solidjs/web';
import { createComponent, createRoot, flush } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import { ClientOnly, clientComponent, clientOnly, createClientSignal } from '../../src/client-only';

describe('createClientSignal (SSR)', () => {
  it('stays false, even after effects are flushed', () => {
    createRoot((dispose) => {
      const isClient = createClientSignal();
      expect(isClient()).toBe(false);
      flush();
      expect(isClient()).toBe(false);
      dispose();
    });
  });
});

describe('ClientOnly (SSR)', () => {
  it('renders the fallback', () => {
    const html = renderToString(() =>
      createComponent(ClientOnly, {
        fallback: 'server',
        children: 'client',
      }),
    );
    expect(html).toContain('server');
    expect(html).not.toContain('client');
  });

  it('renders nothing when there is no fallback', () => {
    const html = renderToString(() => createComponent(ClientOnly, { children: 'client' }));
    expect(html).not.toContain('client');
  });
});

describe('clientComponent (SSR)', () => {
  it('never invokes the wrapped component', () => {
    const Comp = vi.fn(() => 'rendered' as unknown as never);
    const Wrapped = clientComponent(Comp);

    const html = renderToString(() => createComponent(Wrapped, {} as never));

    expect(html).not.toContain('rendered');
    expect(Comp).not.toHaveBeenCalled();
  });
});

describe('clientOnly (SSR)', () => {
  it('never loads the module', () => {
    const load = vi.fn(
      async () =>
        await Promise.resolve({
          default: () => 'lazy' as unknown as never,
        }),
    );
    const Lazy = clientOnly(load);

    const html = renderToString(() => createComponent(Lazy, {} as never));

    expect(html).not.toContain('lazy');
    expect(load).not.toHaveBeenCalled();
  });
});
