# `solid-use/client-only`

Primitives for code that must only run in the browser.

| Need                                        | Use                  |
| ------------------------------------------- | -------------------- |
| Check whether the client has taken over     | `createClientSignal` |
| Skip part of the tree during SSR            | `ClientOnly`         |
| Skip an existing component during SSR       | `clientComponent`    |
| Skip a component and its module during SSR  | `clientOnly`         |

## `createClientSignal`

Returns an accessor that is `false` on the server and during hydration. It becomes `true` once the component has mounted in the browser.

```js
import { createClientSignal } from 'solid-use/client-only';

// In a component
const isClient = createClientSignal();
```

## `ClientOnly`

Renders its children only in the browser. The server renders `fallback`, or nothing.

```jsx
import { ClientOnly } from 'solid-use/client-only';

<ClientOnly fallback={<div>Rendered on the server</div>}>
  <div>Rendered in the browser</div>
</ClientOnly>;
```

## `clientComponent`

Wraps a component so it only renders in the browser. Props are passed through.

```jsx
import { clientComponent } from 'solid-use/client-only';

const Example = clientComponent(() => <h1>I'm client only!</h1>);
```

## `clientOnly`

Works like `lazy`, but the module is not loaded during SSR.

```jsx
import { clientOnly } from 'solid-use/client-only';

const MyLazyComponent = clientOnly(() => import('./path/to/my-lazy-component'));

<Suspense>
  <MyLazyComponent />
</Suspense>;
```

- While hydrating, the component renders after mount.
- In an app without SSR, it behaves like `lazy`.
