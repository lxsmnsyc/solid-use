# `solid-use/client-only`

A set of primitives for enforcing client-only code.

All of them build on the same idea: effects do not run during SSR, so a signal
that is only written from an effect stays at its server value until the client
takes over. Solid's hydration keys keep the server and client trees aligned, so
these primitives need no separate server build.

## `createClientSignal`

A signal that is `false` on the server and during hydration, and flips to `true`
once the component has rendered on the client.

```js
import { createClientSignal } from 'solid-use/client-only';

// In a component
const isClient = createClientSignal();

createEffect(() => {
  if (isClient()) {
    console.log('Running in the browser');
  }
});
```

## `ClientOnly`

Render a set of children only on the client.

```js
import { ClientOnly } from 'solid-use/client-only';

<ClientOnly fallback={<div>This a server-only element</div>}>
  <div>This is a client-only element.</div>
</ClientOnly>
```

`fallback` is optional; without it the server renders nothing.

## `clientOnly`

Alternative to `lazy`, but instead of loading for both server and client, it
only loads on the client. The module is never imported during SSR.

```js
import { clientOnly } from 'solid-use/client-only';

const MyLazyComponent = clientOnly(() => import('./path/to/my-lazy-component'));

<Suspense>
  <MyLazyComponent />
</Suspense>
```

## `clientComponent`

A higher-order component utility to indicate that the given component would only
render on the client side. Props are forwarded unchanged.

```js
import { clientComponent } from 'solid-use/client-only';

const Example = clientComponent(() => <h1>I'm client only!</h1>);
```

## Choosing between them

| Need                                             | Use               |
| ------------------------------------------------ | ----------------- |
| Branch on "are we on the client yet?"             | `createClientSignal` |
| Skip a subtree during SSR, with a fallback        | `ClientOnly`      |
| Skip an existing component during SSR             | `clientComponent` |
| Skip a component *and* its module download        | `clientOnly`      |
