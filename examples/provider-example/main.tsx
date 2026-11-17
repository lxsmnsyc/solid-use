import { render } from '@solidjs/web';
import { createSignal } from 'solid-js';
import { createProvider, inject, provide, withProvider } from 'solid-use/provider';

interface Counter {
  value: () => number;
  increment: () => void;
  decrement: () => void;
}

// The default value is what `inject` returns when no ancestor scope provided
// one, so it doubles as the "not wired up" behaviour.
const CounterProvider = createProvider<Counter>({
  value: () => 0,
  increment: () => {},
  decrement: () => {},
});

function Increment() {
  const { increment } = inject(CounterProvider);
  return (
    <button type="button" onClick={increment}>
      Increment
    </button>
  );
}

function Decrement() {
  const { decrement } = inject(CounterProvider);
  return (
    <button type="button" onClick={decrement}>
      Decrement
    </button>
  );
}

function Count() {
  const { value } = inject(CounterProvider);
  return <h1>Count: {value()}</h1>;
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

render(() => <App />, document.getElementById('app')!);
