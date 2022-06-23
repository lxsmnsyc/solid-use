import { Suspense } from 'solid-js';
import { render } from 'solid-js/web';
import {
  fetch,
} from 'solid-use';

function SuspensefulDogImage() {
  const result = fetch('https://dog.ceo/api/breed/shiba/images/random', {}, true).json();

  return (
    <Show when={result()}>
      <img src={result().message} alt={result().message} />
    </Show>
  );
}

function App() {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <SuspensefulDogImage />
    </Suspense>
  );
}

render(() => <App />, document.getElementById('app'));