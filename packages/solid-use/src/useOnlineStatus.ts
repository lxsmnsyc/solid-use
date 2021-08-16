import { createSignal, createEffect, onCleanup } from 'solid-js';

export default function useOnlineStatus(): () => boolean {
  if (typeof navigator === undefined) {
    return () => true;
  }
  const [state, setState] = createSignal(navigator.onLine);

  createEffect(() => {
    const callback = () => {
      setState(navigator.onLine);
    };
    window.addEventListener('online', callback, false);
    window.addEventListener('offline', callback, false);
    onCleanup(() => {
      window.removeEventListener('online', callback, false);
      window.removeEventListener('offline', callback, false);
    });
  });

  return state;
}
