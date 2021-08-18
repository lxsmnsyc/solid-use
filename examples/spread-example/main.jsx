import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import { destructure } from 'solid-use';

function Count(props) {
  const { value, increment, decrement } = destructure(props);

  return (
    <>
      <h1>Count: {value()}</h1>
      <button type="button" onClick={decrement()}>Decrement</button>
      <button type="button" onClick={increment()}>Increment</button>
    </>
  );
}

function CountWrapper(props) {
  return <Count {...props} />
}

function App() {
  const [count, setCount] = createSignal(0);

  function increment() {
    setCount(count() + 1);
  }

  function decrement() {
    setCount(count() - 1);
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