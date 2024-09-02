import { createEffect, createSignal, onCleanup } from 'solid-js';
import { isServer } from 'solid-js/web';

const useOnlineStatus = isServer
  ? (): (() => boolean) => () => true
  : (): (() => boolean) => {
      const [state, setState] = createSignal(true);

      createEffect(() => {
        const callback = () => {
          setState(navigator.onLine);
        };
        callback();
        window.addEventListener('online', callback, false);
        window.addEventListener('offline', callback, false);
        onCleanup(() => {
          window.removeEventListener('online', callback, false);
          window.removeEventListener('offline', callback, false);
        });
      });

      return state;
    };

export default useOnlineStatus;
