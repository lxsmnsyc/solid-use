# `solid-use/media-query`

## `useMediaQuery`

Returns an accessor that is `true` while a CSS media query matches. It updates when the match changes.

```js
import { useMediaQuery } from 'solid-use/media-query';

const isPortrait = useMediaQuery('(orientation: portrait)');

createEffect(() => {
  console.log('Is portrait?', isPortrait());
});
```

- The query is read once. Create a new primitive to watch a different query.
- One `MediaQueryList` is shared per query string.
- During SSR the accessor always returns `false`. The server cannot know the viewport or user preferences.
- In the browser the listener is removed when the owner is cleaned up.

If the server and client must look different without a flash, use a CSS media query instead.

## Shorthands

```js
import { usePrefersDark, usePrefersLight, usePrefersReducedMotion } from 'solid-use/media-query';

const isDark = usePrefersDark();
```

| Primitive                 | Query                           |
| ------------------------- | ------------------------------- |
| `usePrefersDark`          | `(prefers-color-scheme: dark)`  |
| `usePrefersLight`         | `(prefers-color-scheme: light)` |
| `usePrefersReducedMotion` | `(prefers-reduced-motion)`      |
