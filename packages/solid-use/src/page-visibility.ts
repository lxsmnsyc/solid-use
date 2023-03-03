import { createEffect, createSignal, onCleanup } from 'solid-js';
import { isServer } from 'solid-js/web';

export default function usePageVisibility(): () => boolean {
  if (isServer) {
    return () => true;
  }

  const [state, setState] = createSignal(true);

  createEffect(() => {
    const callback = () => {
      setState(document.visibilityState === 'visible');
    };
    callback();
    document.addEventListener('visibilitychange', callback, false);
    onCleanup(() => {
      document.removeEventListener('visibilitychange', callback, false);
    });
  });

  return state;
}
