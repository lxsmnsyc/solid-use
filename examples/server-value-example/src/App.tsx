import { createSignal } from 'solid-js';
import { ClientOnly } from 'solid-use/client-only';
import useServerValue from 'solid-use/server-value';
import './app.css';

export default function App() {
  // `Date.now()` answers differently on the server and in the browser, which is
  // exactly the kind of value that causes a hydration mismatch. `useServerValue`
  // runs it once during SSR and replays the result during hydration, so the
  // number below is identical in the HTML and after the page comes alive.
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
      <p>
        Reload the page: the first number is baked into the HTML and survives hydration untouched,
        while the second one is produced by the browser.
      </p>
    </main>
  );
}
