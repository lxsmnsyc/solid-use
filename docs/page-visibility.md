# `solid-use/page-visibility`

## `usePageVisibility`

Returns an accessor that is `true` while the page is visible. It updates when the browser fires the `visibilitychange` event.

```js
import usePageVisibility from 'solid-use/page-visibility';

const isVisible = usePageVisibility();

createEffect(() => {
  console.log('Is page visible?', isVisible());
});
```

A common use is pausing work while the tab is in the background.

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

- During SSR the accessor always returns `true`.
- In the browser the listener is removed when the owner is cleaned up.
