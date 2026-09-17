# `server-value` example

Shows [`solid-use/server-value`](../../docs/server-value.md) and [`solid-use/client-only`](../../docs/client-only.md) in a server-rendered SolidStart app.

- The first timestamp is computed on the server and reused during hydration. It does not change when the page hydrates.
- The second timestamp is rendered only in the browser. The server renders the fallback instead.

## Running

```bash
pnpm dev          # development server
pnpm build        # production build in .output
pnpm start        # run the production build
pnpm type-check
```
