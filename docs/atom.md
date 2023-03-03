
# `solid-use/atom`

A simplified version of `createSignal`. Instead of returning a tuple, it returns a single function that serves as the accessor and the dispatcher.

```ts
import atom from 'solid-use/atom';

const message = atom('Hello');

createEffect(() => {
  console.log(message());
});

message('Bonjour');
```
