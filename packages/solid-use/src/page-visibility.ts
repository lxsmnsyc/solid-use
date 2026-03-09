import { isServer } from '@solidjs/web';
import { createSignal, createTrackedEffect, onCleanup } from 'solid-js';

const usePageVisibility = isServer
  ? (): (() => boolean) => () => true
  : (): (() => boolean) => {
      const [state, setState] = createSignal(true);

      createTrackedEffect(() => {
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
