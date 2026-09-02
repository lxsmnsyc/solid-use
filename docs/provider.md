
# `solid-use/provider`

SolidJS already provides the [Context API](https://www.solidjs.com/docs/latest/api#createcontext) for injecting values down the component tree, however, this may lead into an unwanted pyramid of doom for nested Context.

Provider provides a compositional way to inject values not just the component tree, but also inside captured callbacks. You can also use the Provider API outside components, useful for injecting values inside global side-effects.

## `createProvider`

Creates a unique provider key that also holds a default value. This is similar to `createContext` although with different behaviors.

```ts
import { createProvider } from 'solid-use/provider';

const MessageProvider = createProvider('Hello World');
```

## `provide` and `inject`

`provide` accepts a Provider instance and a value to be injected. `inject` performs a lookup in the provider scope for the corresponding Provider value. If `inject` cannot find the Provider instance, the default value of the Provider is returned.

```ts
import { provide, inject } from 'solid-use/provider';

provide(MessageProvider, 'Hello Solid');
//...
const value = inject(MessageProvider); // Hello Solid
```

## `providerScope`

Accepts a callback that is executed synchronously. `providerScope` provides an internal context that allows injecting values across boundaries. This is must be used for `provide` and `inject` to work.

```ts
import { providerScope, provide } from 'solid-use/provider';

providerScope(() => {
  provide(XProvider, 'X');
  provide(YProvider, 'Y');
});
```

## `capturedProvider`

Wraps a callback into a captured callback that holds the current Provider scope. This allows `inject` to perform lookup even outside the synchronous scope.

```ts
import { capturedProvider, inject } from 'solid-use/provider';

createEffect(capturedProvider(() => {
  const value = inject(MessageProvider);
}));
```

## `withProvider`

A higher-order component that internally wraps a component with a `providerScope`.

```js
import { withProvider } from 'solid-use/provider';

const App = withProvider(props => {
  provide(MessageProvider, 'Hello Solid');
  return <Child {...props} />;
});
```

## Scope lifetime

A `provide` call registers the value on the *current* scope and removes it again
through `onCleanup`, so a value provided under a reactive owner disappears once
that owner is disposed. `provide` outside of any `providerScope` is a no-op.

Scopes are restored even when a callback throws, so a failed render cannot leak
a value into the surrounding scope.

## Server-side rendering

The provider tree is plain JavaScript with no reactive state of its own, so it
behaves identically during SSR and on the client.
