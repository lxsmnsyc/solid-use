
# `solid-use/client-only`

A set of primitives for enforcing client-only code.

## `createClientSignal`

A signal that updates to `true` when component has rendered on the client.

```js
import { createClientSignal } from 'solid-use/client-only';

// In a component
const isClient = createClientSignal();
```

## `ClientOnly`

Render a set of children only on the client.

```js
import { ClientOnly } from 'solid-use/client-only';

<ClientOnly fallback={<div>This a server-only element</div>}>
  <div>This is a client-only element.</div>
</ClientOnly>
```

## `clientOnly`

Alternative to `lazy`, but instead of loading for both server and client, it only loads on the client.

```js
import { clientOnly } from 'solid-use/client-only';

const MyLazyComponent = clientOnly(() => import('./path/to/my-lazy-component'));

<Suspense>
  <MyLazyComponent />
</Suspense>
```

## `clientComponent`

A higher-order component utility to indicate that the given component would only render on the eclient-side.

```js
import { clientComponent } from 'solid-use/client-only';

const Example = clientComponent(() => <h1>I'm client only!</h1>);
```
