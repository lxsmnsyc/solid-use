import { createEffect, createSignal, onCleanup } from 'solid-js';

export default function usePageVisibility(): () => boolean {
  if (typeof document === 'undefined') {
    return () => true;
  }

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
