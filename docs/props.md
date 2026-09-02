# `solid-use/props`

Helpers for splitting and reshaping reactive objects - most often a component's
props - without losing reactivity. Every helper returns getters or accessors
that read through to the source, so the source is never eagerly unwrapped.

## `spread` and `destructure`

Allows splitting a reactive object (ideally, the props) into a field of
accessors. `spread` is eager while `destructure` is lazy.

```tsx
import { spread, destructure } from 'solid-use/props';

function MyComponent(props) {
  // destructure only creates accessors
  // based on the defined destructured fields
  const { greeting, target } = destructure(props);

  return <h1>{greeting()}, {target()}!</h1>
}

function AnotherComponent(props) {
  // spread creates accessors for every field in the object
  return <MyComponent {...spread(props)} />
}

<AnotherComponent greeting="Hello" target="Solid" />
```

`destructure` creates one memo per field, the first time that field is read, and
reuses it afterwards. `spread` walks `Object.keys` up front, so it reads every
field immediately - prefer `destructure` when the source has getters that are
expensive or that you do not want to touch.

Arrays are supported, both by index and by destructuring:

```ts
const source = destructure([1, 2]);

source[0]();                        // 1
const [first, second] = source;     // both are accessors
```

`length` and the symbol-keyed members of an array source are passed through
unchanged rather than wrapped in accessors, which is what keeps iteration and
destructuring working. On a non-array source `length` is an ordinary field and
does become an accessor.

## `omitProps` and `pickProps`

Much similar to the built-in `splitProps`, `omitProps` removes selected keys
while `pickProps` picks the selected keys from the source props.

```js
import { omitProps } from 'solid-use/props';

<button {...omitProps(props, ['ref', 'onClick'])} />
```

Both return a new object whose remaining keys are defined as enumerable getters
onto the source, so reading a key inside a reactive scope still tracks it, and
keys that are never read are never evaluated.

## Types

| Type                | Meaning                                                                       |
| ------------------- | ----------------------------------------------------------------------------- |
| `ReactiveObject`    | What `destructure` and `spread` accept: any object or array with reactive fields. |
| `Spread<T>`         | The result of `destructure` and `spread`: `T` with every field replaced by an accessor. |
| `KeyType<T>`        | A key into a `ReactiveObject`: `number` for arrays, `keyof T` otherwise.        |
