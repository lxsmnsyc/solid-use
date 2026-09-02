# `solid-use/online-status`

## `useOnlineStatus`

Tracks whether the browser believes it has a network connection. The accessor
mirrors `navigator.onLine` and updates whenever the `online` or `offline` event
fires.

```js
import useOnlineStatus from 'solid-use/online-status';

const isOnline = useOnlineStatus();

createEffect(() => {
  console.log('Is online?', isOnline());
});
```

### Server-side rendering

The primitive is isomorphic: the same implementation runs on the server and on
the client.

- During SSR the accessor resolves to `true`. Effects do not run on the server,
  so `navigator` and `window` are never touched.
- On the client the real status is read once effects settle, and the listeners
  are removed automatically when the owner is disposed.

Because the value only changes after hydration, the server and client markup
always agree on the initial render.

### Caveats

`navigator.onLine` only reports whether the device has *a* network interface
attached. It cannot tell you whether the network actually reaches your server,
so treat it as a hint rather than a guarantee.
