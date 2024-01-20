import { createEffect, createSignal, onCleanup } from 'solid-js';
import { isServer } from 'solid-js/web';

const MEDIA = new Map<string, MediaQueryList>();

function getMediaMatcher(query: string): MediaQueryList {
  const media = MEDIA.get(query);
  if (media) {
    return media;
  }
  const newMedia = window.matchMedia(query);
  MEDIA.set(query, newMedia);
  return newMedia;
}

export const useMediaQuery = isServer
  ? (_query: string): (() => boolean) =>
      () =>
        false
  : (query: string): (() => boolean) => {
      const media = getMediaMatcher(query);
      const [state, setState] = createSignal(false);

      createEffect(() => {
        const callback = () => {
          setState(media.matches);
        };
        callback();
        media.addEventListener('change', callback, false);
        onCleanup(() => {
          media.removeEventListener('change', callback, false);
        });
      });

      return state;
    };

export function usePrefersDark(): () => boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

export function usePrefersLight(): () => boolean {
  return useMediaQuery('(prefers-color-scheme: light)');
}

export function usePrefersReducedMotion(): () => boolean {
  return useMediaQuery('(prefers-reduced-motion)');
}
