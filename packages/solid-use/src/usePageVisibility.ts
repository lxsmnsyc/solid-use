import { createEffect, createSignal, onCleanup } from 'solid-js';

export default function usePageVisibility(): () => boolean {
  if (document != null) {
    const [state, setState] = createSignal(document.visibilityState === 'visible');

    createEffect(() => {
      const callback = () => {
        setState(document.visibilityState === 'visible');
      };
      document.addEventListener('visibilitychange', callback, false);
      onCleanup(() => {
        document.removeEventListener('visibilitychange', callback, false);
      });
    });

    return state;
  }

  return () => true;
}
