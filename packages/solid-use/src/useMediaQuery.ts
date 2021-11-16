import { createEffect, createSignal, onCleanup } from 'solid-js';

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

export default function useMediaQuery(query: string): () => boolean {
  if (typeof window === 'undefined') {
    return () => false;
  }
  const media = getMediaMatcher(query);
  const [state, setState] = createSignal(media.matches);

  createEffect(() => {
    const callback = () => {
      setState(media.matches);
    };
    media.addEventListener('change', callback, false);
    onCleanup(() => {
      media.removeEventListener('change', callback, false);
    });
  });

  return state;
}
