# ![solid-use](https://github.com/LXSMNSYC/solid-use/raw/main/images/banner.png)

> A collection of SolidJS utilities

[![NPM](https://img.shields.io/npm/v/solid-use.svg)](https://www.npmjs.com/package/solid-use) [![JavaScript Style Guide](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)

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

### `omitProps` and `pickProps`

Much similar to the built-in `splitProps`, `omitProps` removes selected keys while `pickProps` picks the selected keys from the source props

```js
<button {...excludeProps(props, ['ref', 'onClick'])} />
```

### Classic Suspense

```js
import {
  createClassicResource,
  createClassicSuspense,
  useClassicResource,
  waitForAll,
} from 'solid-use';

const sleep = (timeout) => new Promise((resolve) => {
  setTimeout(resolve, timeout, true);
})

const greeting = createClassicResource(async () => {
  await sleep(2000);
  return 'Hello';
});

const receipient = createClassicResource(async () => {
  await sleep(2000);
  return 'SolidJS';
});

const result = waitForAll([
  greeting,
  receipient,
]);

function Message() {
  return createClassicSuspense(() => {
    const [greetingValue, receipientValue] = useClassicResource(result);

    // const greetingValue = useClassicResource(greeting);
    // const receipientValue = useClassicResource(receipient);

    return <h1>{greetingValue}, {receipientValue}!</h1>
  });
}

function App() {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Message />
    </Suspense>
  );
}
```

#### `createClassicSuspense`

`createClassicSuspense` emulates the behavior of React's `<Suspense>` such that instead of reading from `createResource`, `createClassicSuspense` will suspend when a Promise is thrown. Unlike Solid's `createResource`, `createClassicSuspense` guarantees that the resource has already resolved by the time it reaches the resolving UI.

`createClassicSuspense` wraps `createResource` so that it still works with Solid's Suspense.

#### `createClassicResource` and `useClassicResource`

A simple wrapper to Promises. `useClassicResource` will read from a given classic resource and will suspend if the resource is yet to resolve.

#### `waitForAll` and `waitForAny`

A utility for combining classic resources akin to `Promise.all` and `Promise.race`.

#### `useResourceResult`

Similar to `useClassicResource`, useful for custom resource signal implementations.

### Fetch

```js
import { fetch } from 'solid-use';

function SuspensefulDogImage() {
  const result = fetch('https://dog.ceo/api/breed/shiba/images/random', undefined, true).json();

  return <img src={result().message} alt={result().message} />;
}

function SuspenselessDogImage() {
  const result = fetch('https://dog.ceo/api/breed/shiba/images/random', undefined, false).json();

  return (
    <Switch>
      <Match when={result.status === 'pending'}>
        <h1>Loading...</h1>
      </Match>
      <Match when={result.status === 'failure'}>
        <h1>Something went wrong</h1>
      </Match>
      <Match when={result.status === 'success'}>
        <img src={result.value.message} alt={result.value.message} />
      </Match>
    </Switch>
  );
}


function ClassicSuspenseDogImage() {
  const result = fetch('https://dog.ceo/api/breed/shiba/images/random', undefined, 'classic').json();

  return createClassicSuspense(() => {
    const data = useResourceResult(result());

    return <img src={data.message} alt={data.message} />;
  });
}

```

Provides a similar API to the Fetch API, `solid-use`' `fetch` uses resource and signals to provide a reactive way of fetching.

The parameters of `fetch` can be wrapped into a function for reactive sources and options.

```js
function SuspensefulDogImage() {
  const result = fetch(() => `https://dog.ceo/api/breed/${breed()}/images/random`, () => ({ mode: mode() }), true).json();

  return <img src={result().message} alt={result().message} />;
}
```

### Others

- useMediaQuery
- useOnlineStatus
- usePageVisibility
- usePrefersDark
- usePrefersLight
- usePrefersReducedMotion

## License

MIT © [lxsmnsyc](https://github.com/lxsmnsyc)
