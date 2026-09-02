# `solid-use/fetch`

```js
import fetch from 'solid-use/fetch';

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
```

Provides a similar API to the Fetch API, `solid-use`' `fetch` uses resource and signals to provide a reactive way of fetching.

The parameters of `fetch` can be wrapped into a function for reactive sources and options.

```js
function SuspensefulDogImage() {
  const result = fetch(() => `https://dog.ceo/api/breed/${breed()}/images/random`, () => ({ mode: mode() }), true).json();

  return <img src={result().message} alt={result().message} />;
}
```

## Suspenseful vs. suspenseless

The third argument picks the shape of the result.

- `true` returns a `SuspensefulFetchResponse`. Its body readers return an
  accessor backed by an async memo, so reading it inside a `Suspense` boundary
  suspends until the request settles.
- `false` (the default) returns a `SuspenselessFetchResponse`. Its body readers
  return a `FetchResult`, a reactive object you branch on yourself.

```ts
type FetchResult<T> =
  | { status: 'pending'; value?: Promise<T> }
  | { status: 'success'; value: T }
  | { status: 'failure'; value: any };
```

Both classes expose the same body readers as the Fetch API response:
`arrayBuffer`, `blob`, `formData`, `json` and `text`. Each reader performs its
own request; call one reader per response.

Nothing is requested until a body reader is called.

## Reactivity

`input` and `init` may each be a value or an accessor. Accessors are read inside
the request's reactive scope, so changing one triggers a new request.

```js
const result = fetch(
  () => `https://dog.ceo/api/breed/${breed()}/images/random`,
  () => ({ mode: mode() }),
  false,
).json();
```

## Server-side rendering

`SuspenselessFetchResponse` drives its state from an effect, and effects do not
run during SSR, so it stays `pending` on the server. Use the suspenseful form -
or a server-side loader - if the data has to be part of the rendered HTML.
