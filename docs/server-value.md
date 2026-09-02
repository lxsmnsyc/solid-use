# `solid-use/server-value`

A primitive that carries a server-computed value over to the client. This is
useful to prevent hydration mismatches caused by values that cannot be
reproduced consistently on both sides.

## `useServerValue`

```js
import useServerValue from 'solid-use/server-value';

// This is the most common problem for SSR + hydration:
// a function that isn't idempotent may cause hydration mismatches
// since there's no way to be consistent between the server
// and the client.
// Some examples of this are `Math.random` and `Date.now`.
const initialState = useServerValue(() => Math.random());

const [value, setValue] = createSignal(initialState);
```

## How it works

`useServerValue` claims the next hydration id for the current owner and uses it
as the key for the value:

- While rendering on the server, the callback runs and the result is serialized
  into the page's hydration payload under that id.
- While hydrating on the client, the id is looked up in that payload. If a value
  is found it is returned as-is and **the callback never runs**.

The server and the client walk the owner tree in the same order, so both sides
agree on the id without any coordination. That is what lets one implementation
serve both environments.

## When the callback still runs

The callback is invoked normally whenever there is no payload entry to read:

- on a client-only render (no SSR at all);
- when the server did not serialize a value for that id, for example inside a
  `NoHydration` boundary;
- outside of a hydratable owner.

Design the callback so that running it twice is merely wasteful, not incorrect.

## Constraints

The value is serialized into the HTML, so it has to be serializable, and it is
visible to anyone who can view the page source. Do not pass secrets through it.

`renderToString` only accepts synchronous values. Use `renderToStream` if the
callback needs to resolve a promise.
