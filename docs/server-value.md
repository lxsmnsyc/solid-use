# `solid-use/server-value`

Computes a value on the server and reuses it in the browser. Use it for values that would differ between the two and cause a hydration mismatch, such as `Math.random()` or `Date.now()`.

## `useServerValue`

```js
import useServerValue from 'solid-use/server-value';

const initialState = useServerValue(() => Math.random());

const [value, setValue] = createSignal(initialState);
```

## How it works

- During SSR the callback runs, and the result is written into the page's hydration data.
- During hydration the stored result is returned. The callback does not run.
- Both sides find the value by the same hydration key, so calls must happen in the same order on the server and the client.

The callback still runs when there is no stored value. This happens in an app without SSR, or when rendering after hydration has finished.

## Limits

- The value is serialized into the HTML. It must be serializable.
- Anyone can read the page source. Do not pass secrets.
