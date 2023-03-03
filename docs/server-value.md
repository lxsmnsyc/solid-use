# `solid-use/server-value`

This set of primitives allow to pass server-side values to client-side. This is useful to prevent potential hydration mismatches (e.g. inconsistent initial state).

## Requirement

This package uses [`seroval`](https://github.com/lxsmnsyc/seroval) to serialize JS values such as `RegExp`, `Date`, `Map`, `Set`, etc. `solid-use/server-value` has `seroval` as an optional peer dependency, so you must install this manually.

```bash
npm i seroval
```

```bash
yarn add seroval
```

```bash
pnpm add seroval
```

## `useServerValue`

```js
import { useServerValue } from 'solid-use/server-value';

// This is the most common problem for SSR + hydration
// A function that isn't idempotent may cause hydration mismatches
// since there's no way to be consistent between the server
// and the client.
// Some example of this is `Math.random` and `Date.now`
const initialState = useServerValue(() => Math.random());

const [value, setValue] = createSignal(initialState);
```

## `<ServerValueBoundary>`

`useServerValue` uses `useAssets` under the hood, but this may pollute the SSR result with countless redundant `script`. You can use `<ServerValueBoundary>` to batch `useServerValue` instead.

```js
import { ServerValueBoundary } from 'solid-use/server-value';

<ServerValueBoundary>
  <SSRComponent />
</ServerValueBoundary>
```

## `serializeServerValues`

`useAssets` only runs if the SSR output is a full HTML document, in which case `useServerValue` can be broken. To have control as to when and where to serialize these values, you need to use `serializeServerValues` in combination with `ServerValueBoundary`.

```js
import { serializeServerValues, ServerValueBoundary } from 'solid-use/server-value';

const values = {};

<ServerValueBoundary values={values}>
  <SSRComponent />
</ServerValueBoundary>

const markup = serializeServerValues(values); // returns an html markup
```
