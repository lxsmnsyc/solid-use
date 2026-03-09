import { isServer } from '@solidjs/web';
import { createSignal, createTrackedEffect, onCleanup } from 'solid-js';

const useOnlineStatus = isServer
  ? (): (() => boolean) => () => true
  : (): (() => boolean) => {
      const [state, setState] = createSignal(true);

      createTrackedEffect(() => {
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
