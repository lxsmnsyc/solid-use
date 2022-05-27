/* @refresh reload */
import { Suspense } from 'solid-js';
import { render } from 'solid-js/web';
import {
  createClassicResource,
  createClassicSuspense,
  useClassicResource,
  waitForAll,
} from 'solid-use';

const sleep = (timeout) => new Promise((resolve) => {
  setTimeout(resolve, timeout, true);
})

const greeting = createClassicResource(async () => {
  await sleep(2000);
  return 'Hello';
});

const receipient = createClassicResource(async () => {
  await sleep(2000);
  return 'SolidJS';
});

const result = waitForAll([
  greeting,
  receipient,
]);

function Message() {
  return createClassicSuspense(() => {
    const [greetingValue, receipientValue] = useClassicResource(result);

    // const greetingValue = useClassicResource(greeting);
    // const receipientValue = useClassicResource(receipient);

    return <h1>{greetingValue}, {receipientValue}!</h1>
  });
}

function App() {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Message />
    </Suspense>
  );
}

render(() => <App />, document.getElementById('app'));