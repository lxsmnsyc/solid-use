# `solid-use/string`

`string` is a tagged template for reactive string templates. It returns an
accessor function that returns the latest computed string.

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

Interpolations may be accessors or plain values, and the two can be mixed in one
template. Every interpolation is stringified with `String(...)`, so any type is
accepted.

```ts
const count = createSignal(2);

string`${'You have'} ${count[0]} ${'messages'}`;
```

The result is backed by a memo, so the template is only recomputed when one of
the accessors it reads actually changes.

Only functions are treated as accessors. To interpolate a function *as a value*,
wrap it: `` string`${() => String(fn)}` ``.
