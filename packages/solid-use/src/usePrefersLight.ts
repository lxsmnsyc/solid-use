import useMediaQuery from './useMediaQuery';

export default function usePrefersLight(): () => boolean {
  return useMediaQuery('(prefers-color-scheme: light)');
}
