# `solid-use/media-query`

## `useMediaQuery`

Tracks whether a CSS media query currently matches, updating whenever the
`MediaQueryList` fires a `change` event.

```js
import { useMediaQuery } from 'solid-use/media-query';

const isPortrait = useMediaQuery('(orientation: portrait)');

createEffect(() => {
  console.log('Is portrait?', isPortrait());
});
```

The query string is read once, when the subscription is set up. To react to a
changing query, create the primitive inside a scope that re-runs, or derive one
accessor per query.

`MediaQueryList` instances are cached per query string, so calling
`useMediaQuery` with the same query from several components only creates one
underlying matcher.

## Other primitives

Shorthands for the media queries that come up most often:

```js
import {
  usePrefersDark,
  usePrefersLight,
  usePrefersReducedMotion,
} from 'solid-use/media-query';

const isDark = usePrefersDark();
const isLight = usePrefersLight();
const prefersReducedMotion = usePrefersReducedMotion();
```

| Primitive                 | Query                            |
| ------------------------- | -------------------------------- |
| `usePrefersDark`          | `(prefers-color-scheme: dark)`   |
| `usePrefersLight`         | `(prefers-color-scheme: light)`  |
| `usePrefersReducedMotion` | `(prefers-reduced-motion)`       |

### Server-side rendering

The primitive is isomorphic: the same implementation runs on the server and on
the client.

- During SSR every accessor resolves to `false`. Effects do not run on the
  server, so `window.matchMedia` is never called.
- On the client the real match is read once effects settle, and the listener is
  removed automatically when the owner is disposed.

Since the server cannot know the viewport or the user's preferences, `false` is
the neutral starting point: render the default experience on the server and let
the client refine it after hydration. If you need the two to differ visually
without a flash, prefer a CSS media query.
