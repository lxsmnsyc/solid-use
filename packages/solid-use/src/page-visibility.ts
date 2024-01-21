import { createEffect, createSignal, onCleanup } from 'solid-js';
import { isServer } from 'solid-js/web';

const usePageVisibility = isServer
  ? (): (() => boolean) => () => true
  : (): (() => boolean) => {
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
    };

export default usePageVisibility;
