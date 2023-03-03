# `solid-use/online-status`

## `useOnlineStatus`

```js
import { useOnlineStatus } from 'solid-use/online-status';

const isOnline = useOnlineStatus();

createEffect(() => {
  console.log('Is online?', isOnline());
});
```
