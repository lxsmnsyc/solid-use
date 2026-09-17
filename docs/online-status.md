# `solid-use/online-status`

## `useOnlineStatus`

Returns an accessor for `navigator.onLine`. It updates when the browser fires the `online` or `offline` event.

```js
import useOnlineStatus from 'solid-use/online-status';

const isOnline = useOnlineStatus();

createEffect(() => {
  console.log('Is online?', isOnline());
});
```

- During SSR the accessor always returns `true`.
- In the browser the listeners are removed when the owner is cleaned up.
- `navigator.onLine` only says whether a network connection exists. It does not prove your server is reachable.
