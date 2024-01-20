# `solid-use/server-value`

A primitive that allows to pass server-side values to client-side. This is useful to prevent potential hydration mismatches (e.g. inconsistent initial state).

## `useServerValue`

```js
import useServerValue from 'solid-use/server-value';

// This is the most common problem for SSR + hydration
// A function that isn't idempotent may cause hydration mismatches
// since there's no way to be consistent between the server
// and the client.
// Some example of this is `Math.random` and `Date.now`
const initialState = useServerValue(() => Math.random());

const [value, setValue] = createSignal(initialState);
```
