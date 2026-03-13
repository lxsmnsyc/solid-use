import { render } from '@solidjs/web';
import { createSignal } from 'solid-js';
import { destructure } from 'solid-use/props';

function Count(props) {
  const { value, increment, decrement } = destructure(props);

  return (
    <>
      <h1>Count: {value()}</h1>
      <button type="button" onClick={decrement()}>
        Decrement
      </button>
      <button type="button" onClick={increment()}>
        Increment
      </button>
    </>
  );
}

function CountWrapper(props) {
  return <Count {...props} />;
}

function App() {
  const [count, setCount] = createSignal(0);

  function increment() {
    setCount(c => c + 1);
  }

  function decrement() {
    setCount(c => c - 1);
  }

  return (
    <>
      <CountWrapper
        value={count()}
        increment={increment}
        decrement={decrement}
      />
    </>
  );
}

render(() => <App />, document.getElementById('app'));
