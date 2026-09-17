import { createSignal } from 'solid-js';
import { ClientOnly } from 'solid-use/client-only';
import useServerValue from 'solid-use/server-value';
import './app.css';

export default function App() {
  // `Date.now()` differs between the server and the browser.
  // `useServerValue` runs it during SSR and reuses the result during hydration.
  const start = useServerValue(() => Date.now());
  const [count, setCount] = createSignal(0);

  return (
    <main>
      <h1>server-value</h1>
      <h2>Server rendered at {start}</h2>
      <ClientOnly fallback={<h2>Waiting for the client...</h2>}>
        <h2>Client rendered at {Date.now()}</h2>
      </ClientOnly>
      <button
        type="button"
        class="increment"
        onClick={() => {
          setCount(count() + 1);
        }}
      >
        Clicks: {count()}
      </button>
    </main>
  );
}
