import { render } from '@solidjs/web';
import { Loading } from 'solid-js';
import fetch from 'solid-use/fetch';

function SuspensefulDogImage() {
  const result = fetch(
    'https://dog.ceo/api/breed/shiba/images/random',
    {},
    true,
  ).json();

  return <img src={result().message} alt={result().message} />;
}

function App() {
  return (
    <Loading fallback={<h1>Loading...</h1>}>
      <SuspensefulDogImage />
    </Loading>
  );
}

render(() => <App />, document.getElementById('app'));
