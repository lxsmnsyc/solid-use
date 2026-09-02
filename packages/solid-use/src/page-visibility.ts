import { createSignal, onSettled } from 'solid-js';

/**
 * Tracks `document.visibilityState`, updating whenever the browser fires the
 * `visibilitychange` event.
 *
 * The subscription lives inside `onSettled`, which is a no-op on the server, so
 * the primitive resolves to `true` during SSR and only reaches for `document`
 * once it is running in the browser. Solid's hydration keys keep the signal
 * aligned across both environments, so no server-specific implementation is
 * needed.
 */
export default function usePageVisibility(): () => boolean {
  // `ownedWrite` because the value is written from a DOM event listener, which
  // may fire while a reactive scope is active.
  const [state, setState] = createSignal(true, { ownedWrite: true });

  onSettled((): (() => void) => {
    const callback = (): void => {
      setState(document.visibilityState === 'visible');
    };
    callback();
    document.addEventListener('visibilitychange', callback, false);

    return () => {
      document.removeEventListener('visibilitychange', callback, false);
    };
  });

  return state;
}
