# `solid-use/props`

Helpers for splitting a reactive object, usually a component's props, without losing reactivity.

## `destructure` and `spread`

Both turn each field into an accessor.

- `destructure` is lazy. It creates an accessor the first time a field is read.
- `spread` is eager. It creates an accessor for every field right away.

```tsx
import { destructure, spread } from 'solid-use/props';

function Greeting(props) {
  // Only `greeting` and `target` get accessors.
  const { greeting, target } = destructure(props);

  return <h1>{greeting()}, {target()}!</h1>;
}

function Wrapper(props) {
  // Every field gets an accessor.
  return <Greeting {...spread(props)} />;
}

<Wrapper greeting="Hello" target="Solid" />;
```

Prefer `destructure` when some getters are expensive or should not be read.

An accessor created by `destructure` is reused on later reads of the same field.

Arrays work too, by index or with array destructuring.

```ts
const items = destructure([1, 2]);

items[0](); // 1
const [first, second] = items;
```

`length` and symbol keys of an array are read from the source as is. They do not become accessors.

## `omitProps` and `pickProps`

These work like Solid's `splitProps`, but return one object.

- `omitProps` keeps every key except the listed ones.
- `pickProps` keeps only the listed keys.

```tsx
import { omitProps } from 'solid-use/props';

<button {...omitProps(props, ['ref', 'onClick'])} />;
```

Kept keys are getters on the source object. Reading a key inside a reactive scope still tracks it.

## Types

- `Spread<T>` is `T` with every field replaced by an accessor.
- `KeyType<T>` is `number` for arrays and `keyof T` otherwise.
