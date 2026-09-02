import { render } from '@solidjs/web';
import { Loading, createComponent, createRoot, flush } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import { ClientOnly, clientComponent, clientOnly, createClientSignal } from '../../src/client-only';

function mount(code: () => unknown) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const dispose = render(code as never, container);
  // `createClientSignal` only flips once the user effects have run.
  flush();
  return {
    container,
    dispose: (): void => {
      dispose();
      container.remove();
    },
  };
}

describe('createClientSignal', () => {
  it('is false until effects have settled', () => {
    createRoot((dispose) => {
      const isClient = createClientSignal();
      expect(isClient()).toBe(false);
      flush();
      expect(isClient()).toBe(true);
      dispose();
    });
  });
});

describe('ClientOnly', () => {
  it('swaps the fallback for the children on the client', () => {
    const { container, dispose } = mount(() =>
      createComponent(ClientOnly, {
        fallback: 'server',
        children: 'client',
      }),
    );

    expect(container.textContent).toBe('client');
    dispose();
  });

  it('renders nothing when no fallback is given', () => {
    const { container, dispose } = mount(() => createComponent(ClientOnly, { children: 'client' }));

    expect(container.textContent).toBe('client');
    dispose();
  });
});

describe('clientComponent', () => {
  it('renders the wrapped component on the client', () => {
    const Comp = vi.fn(() => 'rendered' as unknown as never);
    const Wrapped = clientComponent(Comp);

    const { container, dispose } = mount(() => createComponent(Wrapped, {} as never));

    expect(container.textContent).toBe('rendered');
    expect(Comp).toHaveBeenCalledTimes(1);
    dispose();
  });

  it('forwards props', () => {
    const Wrapped = clientComponent((props: { value: string }) => props.value as unknown as never);

    const { container, dispose } = mount(() => createComponent(Wrapped, { value: 'forwarded' }));

    expect(container.textContent).toBe('forwarded');
    dispose();
  });
});

describe('clientOnly', () => {
  it('loads the module only on the client', async () => {
    const load = vi.fn(
      async () =>
        await Promise.resolve({
          default: () => 'lazy' as unknown as never,
        }),
    );
    const Lazy = clientOnly(load);

    const { container, dispose } = mount(() =>
      createComponent(Loading, {
        fallback: 'loading',
        get children() {
          return createComponent(Lazy, {} as never);
        },
      }),
    );

    await vi.waitFor(() => {
      expect(container.textContent).toBe('lazy');
    });
    expect(load).toHaveBeenCalledTimes(1);
    dispose();
  });
});
