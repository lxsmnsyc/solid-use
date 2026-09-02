import { createSignal, onSettled } from 'solid-js';

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

/**
 * Tracks whether the given media query currently matches.
 *
 * `window.matchMedia` is only touched inside `onSettled`, which is a no-op on
 * the server, so the primitive resolves to `false` during SSR. Solid's
 * hydration keys keep the signal aligned across both environments, so no
 * server-specific implementation is needed.
 */
export function useMediaQuery(query: string): () => boolean {
  // `ownedWrite` because the value is written from a DOM event listener, which
  // may fire while a reactive scope is active.
  const [state, setState] = createSignal(false, { ownedWrite: true });

  onSettled((): (() => void) => {
    const media = getMediaMatcher(query);
    const callback = (): void => {
      setState(media.matches);
    };
    callback();
    media.addEventListener('change', callback, false);
    return () => {
      media.removeEventListener('change', callback, false);
    };
  });

  return state;
}

export function usePrefersDark(): () => boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

export function usePrefersLight(): () => boolean {
  return useMediaQuery('(prefers-color-scheme: light)');
}

export function usePrefersReducedMotion(): () => boolean {
  return useMediaQuery('(prefers-reduced-motion)');
}
