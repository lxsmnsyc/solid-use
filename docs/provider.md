# `solid-use/provider`

A way to pass values down without nesting context providers. Values can also be read inside captured callbacks and outside components.

Solid's [Context API](https://docs.solidjs.com/concepts/context) covers most cases. Use this when many nested providers become hard to read.

## `createProvider`

Creates a provider key with a default value.

```ts
import { createProvider } from 'solid-use/provider';

const MessageProvider = createProvider('Hello World');
```

## `provide` and `inject`

- `provide` sets a value for a provider in the current scope.
- `inject` looks up the nearest value for a provider. It returns the default value when none is found.

```ts
import { inject, provide } from 'solid-use/provider';

provide(MessageProvider, 'Hello Solid');
// ...
const value = inject(MessageProvider); // 'Hello Solid'
```

`provide` does nothing outside a `providerScope`.

## `providerScope`

Runs a callback in a new scope. `provide` and `inject` need a scope to work. Scopes nest, and an inner scope can override an outer value.

```ts
import { provide, providerScope } from 'solid-use/provider';

providerScope(() => {
  provide(XProvider, 'X');
  provide(YProvider, 'Y');
});
```

## `capturedProvider`

Wraps a callback so it keeps the scope that was active when it was wrapped. Use it for code that runs later, such as effects and event handlers.

```ts
import { capturedProvider, inject } from 'solid-use/provider';

createEffect(
  capturedProvider(() => {
    const value = inject(MessageProvider);
  }),
);
```

## `withProvider`

Wraps a component in its own `providerScope`.

```tsx
import { provide, withProvider } from 'solid-use/provider';

const App = withProvider((props) => {
  provide(MessageProvider, 'Hello Solid');
  return <Child {...props} />;
});
```

## Lifetime

- A value set with `provide` is removed when the owning reactive scope is cleaned up.
- A scope is restored even when its callback throws.
- The provider tree is plain JavaScript, so it behaves the same during SSR.
