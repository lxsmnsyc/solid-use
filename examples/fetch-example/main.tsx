import { render } from '@solidjs/web';
import { Loading } from 'solid-js';
import fetch from 'solid-use/fetch';

interface DogImage {
  message: string;
  status: string;
}

function SuspensefulDogImage() {
  const result = fetch('https://dog.ceo/api/breed/shiba/images/random', {}, true).json<DogImage>();

  return <img src={result().message} alt="A random shiba" />;
}

function App() {
  return (
    <Loading fallback={<h1>Loading...</h1>}>
      <SuspensefulDogImage />
    </Loading>
  );
}

render(() => <App />, document.getElementById('app')!);
