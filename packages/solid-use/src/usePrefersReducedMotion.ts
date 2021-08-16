import useMediaQuery from './useMediaQuery';

export default function usePrefersReducedMotion(): () => boolean {
  return useMediaQuery('(prefers-reduced-motion)');
}
