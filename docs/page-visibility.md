# `solid-use/page-visibility`

## `usePageVisibility`

```js
import { usePageVisibility } from 'solid-use/page-visibility';

const isVisible = usePageVisibility();

createEffect(() => {
  console.log('Is page visible?', isVisible());
});
```
