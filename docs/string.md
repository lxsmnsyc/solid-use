# `solid-use/string`

`string` is a tagged template that returns an accessor for the computed string. The string updates when an interpolated accessor changes.

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

## Interpolations

- An interpolation can be an accessor or a plain value.
- Accessors and plain values can be mixed in one template.
- Every interpolation is converted with `String(...)`, so any type is accepted.
- Any function is called as an accessor. To show a function as text, wrap it: `` string`${() => String(fn)}` ``.

```ts
const [count] = createSignal(2);

const label = string`You have ${count} new ${'messages'}`;
```

The result is backed by a memo, so the string is only rebuilt when an accessor it reads changes.
