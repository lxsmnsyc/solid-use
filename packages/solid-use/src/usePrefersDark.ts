import useMediaQuery from './useMediaQuery';

export default function usePrefersDark(): () => boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}
