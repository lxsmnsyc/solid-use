import { createSignal, onSettled } from 'solid-js';

/**
 * Tracks `navigator.onLine`, updating whenever the browser fires the `online`
 * or `offline` event.
 *
 * The subscription lives inside `onSettled`, which is a no-op on the server, so
 * the primitive resolves to `true` during SSR and only reaches for `navigator`
 * once it is running in the browser. Solid's hydration keys keep the signal
 * aligned across both environments, so no server-specific implementation is
 * needed.
 */
export default function useOnlineStatus(): () => boolean {
  // `ownedWrite` because the value is written from a DOM event listener, which
  // may fire while a reactive scope is active.
  const [state, setState] = createSignal(true, { ownedWrite: true });

  onSettled((): (() => void) => {
    const callback = (): void => {
      setState(navigator.onLine);
    };
    callback();
    window.addEventListener('online', callback, false);
    window.addEventListener('offline', callback, false);

    return () => {
      window.removeEventListener('online', callback, false);
      window.removeEventListener('offline', callback, false);
    };
  });

  return state;
}
