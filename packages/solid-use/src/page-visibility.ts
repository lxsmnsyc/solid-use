import { isServer } from '@solidjs/web';
import { createSignal, onSettled } from 'solid-js';

const usePageVisibility = isServer
  ? (): (() => boolean) => () => true
  : (): (() => boolean) => {
      const [state, setState] = createSignal(true);

      onSettled(() => {
        const callback = () => {
          setState(document.visibilityState === 'visible');
        };
        callback();
        document.addEventListener('visibilitychange', callback, false);

        return () => {
          document.removeEventListener('visibilitychange', callback, false);
        };
      });

      return state;
    };

export default usePageVisibility;
