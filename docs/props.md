# `solid-use/props`

## `spread` and `destructure`

Allows splitting a reactive object (ideally, the props) into a field of accessors. `spread` is eager while `destructure` is lazy.

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

## `omitProps` and `pickProps`

Much similar to the built-in `splitProps`, `omitProps` removes selected keys while `pickProps` picks the selected keys from the source props

```js
import { omitProps } from 'solid-use/props';

<button {...omitProps(props, ['ref', 'onClick'])} />
```
