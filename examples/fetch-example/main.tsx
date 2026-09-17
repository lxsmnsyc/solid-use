import { Show, Suspense } from 'solid-js';
import { render } from 'solid-js/web';
import fetch from 'solid-use/fetch';

interface DogImage {
  message: string;
  status: string;
}

function SuspensefulDogImage() {
  const result = fetch('https://dog.ceo/api/breed/shiba/images/random', {}, true).json<DogImage>();

  return (
    <Show when={result()}>{(image) => <img src={image().message} alt="A random shiba" />}</Show>
  );
}

function App() {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <SuspensefulDogImage />
    </Suspense>
  );
}

render(() => <App />, document.getElementById('app')!);
