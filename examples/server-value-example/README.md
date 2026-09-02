# `server-value` example

Demonstrates [`solid-use/server-value`](../../docs/server-value.md) across a real
SSR/hydration boundary.

`Date.now()` answers differently on the server and in the browser. Rendered
directly it would produce a hydration mismatch; wrapped in `useServerValue` it is
computed once during SSR, serialized into the page under a hydration id, and read
straight back out on the client. Reload the page and compare the two timestamps:
the server one is stable through hydration, the client one is not.

The page also uses [`ClientOnly`](../../docs/client-only.md), which renders its
fallback during SSR and swaps in its children once the client has taken over.

## Setup

Server rendering comes from `@solidjs/vite-plugin` in start mode, with Nitro
supplying the server runtime:

```ts
plugins: [solid({ start: true, ssr: true }), nitro()];
```

Start mode gives the plugin ownership of the entries, the dev middleware and the
build, so the example is just two files: `src/App.tsx` (the root component, found
by convention) and `src/Document.tsx` (the document shell). There is no
`index.html`, no mount file and no server wiring of its own.

Start mode on its own emits an SSR _handler_ - a module exporting
`{ fetch(request) }` - which `vite preview` can serve but which nothing runs
standalone. `nitro()` picks that handler up and builds it into a real server
under `.output`, so `pnpm build` produces something deployable.

## Running

```bash
pnpm dev            # SSR dev server
pnpm build          # client + server bundles, then the Nitro server in .output
pnpm start          # run the built server: node .output/server/index.mjs
pnpm preview        # serve the same build through Vite
pnpm type-check
```

Note that the dev middleware only answers requests that accept HTML, so a plain
`curl http://localhost:5173/` returns `Cannot GET /`. Use
`curl -H 'Accept: text/html' ...` or a browser.
