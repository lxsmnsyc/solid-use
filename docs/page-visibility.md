# `solid-use/page-visibility`

## `usePageVisibility`

Tracks whether the document is currently visible. The accessor mirrors
`document.visibilityState === 'visible'` and updates whenever the
`visibilitychange` event fires.

```js
import usePageVisibility from 'solid-use/page-visibility';

const isVisible = usePageVisibility();

createEffect(() => {
  console.log('Is page visible?', isVisible());
});
```

A common use is pausing work while the user is on another tab:

```js
const isVisible = usePageVisibility();

createEffect(() => {
  if (!isVisible()) {
    return;
  }
  const interval = setInterval(refresh, 5000);
  onCleanup(() => clearInterval(interval));
});
```

### Server-side rendering

The primitive is isomorphic: the same implementation runs on the server and on
the client.

- During SSR the accessor resolves to `true`. Effects do not run on the server,
  so `document` is never touched.
- On the client the real state is read once effects settle, and the listener is
  removed automatically when the owner is disposed.
