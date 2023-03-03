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
