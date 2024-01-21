// @refresh reload
import { createSignal } from 'solid-js';
import useServerValue from 'solid-use/server-value';
import './app.css';

export default function App() {
  const start = useServerValue(() => Date.now());
  const [count, setCount] = createSignal(start);

  return (
    <main>
      <h1>Hello world!</h1>
      <h2>Server rendered with {start}</h2>
      <button
        type="button"
        class="increment"
        onClick={() => setCount(count() + 1)}
      >
        Clicks: {count()}
      </button>
      <p>
        Visit{' '}
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{' '}
        to learn how to build SolidStart apps.
      </p>
    </main>
  );
}
