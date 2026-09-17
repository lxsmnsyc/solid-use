# `solid-use/atom`

`atom` is a signal in a single function. Call it with no argument to read. Call it with one argument to write.

```ts
import atom from 'solid-use/atom';

const message = atom('Hello');

createEffect(() => {
  console.log(message());
});

message('Bonjour');
```

A write returns the new value.

## Equality

Dependents are not notified when the new value equals the old one. The default comparison is `Object.is`. Pass a comparator as the second argument to change it.

```ts
const user = atom({ id: 1 }, (a, b) => a.id === b.id);

user({ id: 1 }); // no update, same id
user({ id: 2 }); // updates
```

## Function values

An atom can hold a function. Writing a function stores it. It is not treated as an updater.

```ts
const handler = atom(() => console.log('a'));

handler(() => console.log('b'));
handler()(); // logs 'b'
```
