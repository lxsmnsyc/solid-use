# `solid-use/media-query`

## `useMediaQuery`

```js
import { useMediaQuery } from 'solid-use/media-query';

const isPortrait = useMediaQuery('(orientation: portrait)');

createEffect(() => {
  console.log('Is portrait?', isPortrait());
});
```

## Other primitives

```js
import {
  usePrefersDark,
  usePrefersLight,
  usePrefersReducedMotion,
} from 'solid-use/media-query';

const isDark = usePrefersDark();
```
