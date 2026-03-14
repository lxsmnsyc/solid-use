import { isServer } from '@solidjs/web';
import { createSignal, onSettled } from 'solid-js';

const useOnlineStatus = isServer
  ? (): (() => boolean) => () => true
  : (): (() => boolean) => {
      const [state, setState] = createSignal(true);

      onSettled(() => {
        const callback = () => {
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
    };

export default useOnlineStatus;
