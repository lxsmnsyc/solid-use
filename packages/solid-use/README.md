# solid-use

> A collection of SolidJS utilities

[![NPM](https://img.shields.io/npm/v/solid-use.svg)](https://www.npmjs.com/package/solid-use) [![JavaScript Style Guide](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript) [![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?style=flat-square&logo=codesandbox)](https://codesandbox.io/s/github/lxsmnsyc/solid-use/tree/main/examples/solid-use)

## Install

```bash
npm install --save solid-js solid-use
```

```bash
yarn add solid-js solid-use
```

## Usage

### `atom`

A simplified version of `createSignal`. Instead of returning a tuple, it returns a single function that serves as the accessor and the dispatcher.

```ts
import { atom } from 'solid-use';

const message = atom('Hello');

createEffect(() => {
  console.log(message());
});

message('Bonjour');
```

### `string`

`string` is a tagged template for reactive string templates. It returns an accessor function that returns the latest computed string.

```ts
import { createSignal } from 'solid-js';
import { string } from 'solid-use';

const [greeting, setGreeting] = createSignal('Hello');
const [target, setTarget] = createSignal('Solid');

const message = string`${greeting}, ${target}!`;

createEffect(() => {
  console.log(message()); // Hello, Solid!
});

setGreeting('Bonjour'); // Bonjour, Solid!
```

### `spread` and `destructure`

Allows splitting a reactive object (ideally, the props) into a field of accessors. `spread` is eager while `destructure` is lazy.

```tsx
import { spread, destructure } from 'solid-use';

function MyComponent(props) {
  // destructure only creates accessors
  // based on the defined destructured fields
  const { greeting, target } = destructure(props);

  return <h1>{greeting()}, {target()}!</h1>
}

function AnotherComponent(props) {
  // spread creates accessors for every field in the object
  return <MyComponent {...spread(props)} />
}

<AnotherComponent greeting="Hello" target="Solid" />
```

### Provider

SolidJS already provides the [Context API](https://www.solidjs.com/docs/latest/api#createcontext) for injecting values down the component tree, however, this may lead into an unwanted pyramid of doom for nested Context.

Provider provides a compositional way to inject values not just the component tree, but also inside captured callbacks. You can also use the Provider API outside components, useful for injecting values inside global side-effects.

#### `createProvider`

Creates a unique provider key that also holds a default value. This is similar to `createContext` although with different behaviors.

```ts
import { createProvider } from 'solid-use';

const MessageProvider = createProvider('Hello World');
```

#### `provide` and `inject`

`provide` accepts a Provider instance and a value to be injected. `inject` performs a lookup in the provider scope for the corresponding Provider value. If `inject` cannot find the Provider instance, the default value of the Provider is returned.

```ts
provide(MessageProvider, 'Hello Solid');
//...
const value = inject(MessageProvider); // Hello Solid
```

#### `providerScope`

Accepts a callback that is executed synchronously. `providerScope` provides an internal context that allows injecting values across boundaries. This is must be used for `provide` and `inject` to work.

```ts
providerScope(() => {
  provide(XProvider, 'X');
  provide(YProvider, 'Y');
});
```

#### `capturedProvider`

Wraps a callback into a captured callback that holds the current Provider scope. This allows `inject` to perform lookup even outside the synchronous scope.

```ts
createEffect(capturedProvider(() => {
  const value = inject(MessageProvider);
}));
```

#### `withProvider`

A higher-order component that internally wraps a component with a `providerScope`.

### Others

- useMediaQuery
- useOnlineStatus
- usePageVisibility
- usePrefersDark
- usePrefersLight
- usePrefersReducedMotion

## License

MIT © [lxsmnsyc](https://github.com/lxsmnsyc)
