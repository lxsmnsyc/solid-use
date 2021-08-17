import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import { createProvider, provide, inject, withProvider } from 'solid-use';

const CounterProvider = createProvider(undefined);

function Increment() {
  const { increment } = inject(CounterProvider);
  return <button type="button" onClick={increment}>Increment</button>
}

function Decrement() {
  const { decrement } = inject(CounterProvider);
  return <button type="button" onClick={decrement}>Decrement</button>
}

function Count() {
  const { value } = inject(CounterProvider);
  return <h1>Count: {value()}</h1>
}

const App = withProvider(() => {
  const [count, setCount] = createSignal(0);

  provide(CounterProvider, {
    value: count,
    increment: () => {
      setCount(count() + 1);
    },
    decrement: () => {
      setCount(count() - 1);
    },
  });

  return (
    <>
      <Count />
      <Increment />
      <Decrement />
    </>
  );
});

render(() => <App />, document.getElementById('app'));