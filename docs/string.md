
# `solid-use/string`

`string` is a tagged template for reactive string templates. It returns an accessor function that returns the latest computed string.

```ts
import { createSignal } from 'solid-js';
import string from 'solid-use/string';

const [greeting, setGreeting] = createSignal('Hello');
const [target, setTarget] = createSignal('Solid');

const message = string`${greeting}, ${target}!`;

createEffect(() => {
  console.log(message()); // Hello, Solid!
});

setGreeting('Bonjour'); // Bonjour, Solid!
```
