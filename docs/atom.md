# `solid-use/atom`

A simplified version of `createSignal`. Instead of returning a tuple, it returns
a single function that serves as the accessor and the dispatcher.

```ts
import atom from 'solid-use/atom';

const message = atom('Hello');

createEffect(() => {
  console.log(message());
});

message('Bonjour');
```

Calling the atom with no argument reads it and tracks it. Calling it with one
argument writes it.

## Equality

By default an atom compares values with `Object.is` and skips notifying
dependents when they are equal. Pass a comparator as the second argument to
change that.

```ts
const user = atom({ id: 1 }, (a, b) => a.id === b.id);

user({ id: 1 }); // no update: same identity
user({ id: 2 }); // updates
```

## Function values

An atom can hold a function as its value. The value is boxed internally, so
neither `createSignal`'s "a function means a derived computation" rule nor its
setter's "a function means an updater callback" rule applies.

```ts
const handler = atom(() => console.log('a'));

handler(() => console.log('b')); // stores the new function
handler()();                     // logs 'b'
```

## Caveats

Writes are scheduled the same way `createSignal` writes are, so a value written
inside a reactive scope is not observable from that same scope until the update
settles.

An atom is created with Solid's `ownedWrite` option, so - unlike a bare
`createSignal` - it can be written from inside a component or an effect without
tripping the owned-scope write guard. That is deliberate: an atom is a handle
meant to be written from wherever the caller happens to be. It does not make
such writes a good idea; a write that feeds back into the computation that
performed it still loops.
