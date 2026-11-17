---
'solid-use': major
---

Support Solid 2.0. Solid 1.x is no longer supported. Use `solid-use@0.10` with Solid 1.x; that line lives on the `solid-1` branch.

- `solid-js` `^2.0.0` is the only peer dependency. The package no longer imports `@solidjs/web`.
- The package ships ESM only. The CommonJS build is gone.

## Isomorphic primitives

`useOnlineStatus`, `usePageVisibility`, `useMediaQuery`, `createClientSignal` and
`useServerValue` used to ship two implementations selected at build time by
`isServer`. Solid 2 assigns hydration keys to signals and walks the owner tree
the same way on the server and the client, so one implementation now covers
both. Effects do nothing during SSR but still consume their hydration id, and
`useServerValue` keys its payload entry off that same id. `useMediaQuery` no
longer touches `window.matchMedia` before its effect runs.

`useServerValue` no longer throws under an owner that has no hydration id, such
as a bare `createRoot`. It calls the callback instead.

## Behavior on Solid 2

- Solid 2 rejects writes to a signal from inside an owned scope. The signals
  this package hands to callers (`atom`, and the state behind `useOnlineStatus`,
  `usePageVisibility`, `useMediaQuery`, `createClientSignal` and the
  suspenseless `fetch` result) are created with `ownedWrite: true`, so writing
  them from your own effects and listeners works.
- The suspenseful `fetch` response methods (`json`, `text`, `blob`,
  `arrayBuffer`, `formData`) return async memos, which suspend under Solid 2's
  `<Loading>`.
- `client-only` types its props with `Element` from `solid-js`, since `JSX`
  moved to `@solidjs/web`.

## Fixes

- `atom` can hold a function as its value. The value is boxed internally, so
  Solid no longer reads it as a derived computation or an updater callback.
- `props` exports `ReactiveObject`, the constraint used by `Spread<T>` and
  `KeyType<T>`, so those types can be named from outside the package.
