# `solid-use/fetch`

A reactive wrapper around the Fetch API. The third argument picks between a Suspense-based result and a plain status object.

```jsx
import fetch from 'solid-use/fetch';

function SuspensefulDogImage() {
  const result = fetch('https://dog.ceo/api/breed/shiba/images/random', undefined, true).json();

  return <img src={result()?.message} alt="A random shiba" />;
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
        <img src={result.value.message} alt="A random shiba" />
      </Match>
    </Switch>
  );
}
```

## Suspenseful and suspenseless

- `true` returns a `SuspensefulFetchResponse`. Each body reader returns a Solid resource, so reading it inside `Suspense` waits for the request.
- `false` or no argument returns a `SuspenselessFetchResponse`. Each body reader returns a `FetchResult` that you check yourself.

```ts
type FetchResult<T> =
  | { status: 'pending'; value?: Promise<T> }
  | { status: 'success'; value: T }
  | { status: 'failure'; value: any };
```

Both expose the Fetch API body readers: `arrayBuffer`, `blob`, `formData`, `json`, and `text`.

- No request is sent until a body reader is called.
- Each body reader sends its own request.

## Reactive arguments

The input and the options can be accessors. A new request is sent when one of them changes.

```jsx
const result = fetch(
  () => `https://dog.ceo/api/breed/${breed()}/images/random`,
  () => ({ mode: mode() }),
  true,
).json();
```

## SSR

- The suspenseful form uses resources, so it works with Solid's SSR.
- The suspenseless form updates from an effect. Effects do not run during SSR, so it stays `pending` on the server.
