# solid-use

## 1.0.0-next.3

### Major Changes

- 29f6f2a: Target Solid `2.0.0-rc.5` and drop the `isServer` branches.

  ## Isomorphic primitives

  `useOnlineStatus`, `usePageVisibility`, `useMediaQuery`, `createClientSignal` and
  `useServerValue` each shipped two implementations selected at build time by
  `isServer`. Solid 2 assigns hydration keys to signals and walks the owner tree
  identically on the server and the client, so a single implementation now covers
  both: effects are no-ops during SSR while still consuming their hydration id, and
  `useServerValue` keys its payload entry off that same id. `useMediaQuery` no
  longer touches `window.matchMedia` before its effect runs.

  The package no longer imports `@solidjs/web`, which has been removed from its
  peer dependencies.

  `useServerValue` also no longer throws when called under an owner that has no
  hydration id, such as a bare `createRoot`; it falls back to invoking the
  callback.

  ## Solid 2.0.0-rc.5

  The peer dependency is now `solid-js@^2.0.0-rc.5`, up from `2.0.0-beta.3`:

  - Writing a signal from inside an owned scope is an error rather than a warning
    in rc.5. Every signal this package hands to callers - `atom`, and the state
    behind `useOnlineStatus`, `usePageVisibility`, `useMediaQuery`,
    `createClientSignal` and the suspenseless `fetch` result - is written from a
    DOM listener, an effect, or the caller's own code, so each is created with
    `ownedWrite: true`.
  - `JSX` moved from `solid-js` to `@solidjs/web`. `client-only` types its props
    with `Element` from `solid-js` instead, which keeps `solid-use` depending on
    `solid-js` alone.

  ## Fixes

  - `atom` could not hold a function as its value: Solid reads a bare function
    passed to `createSignal` as a derived computation, and one passed to the setter
    as an updater callback. The value is now boxed internally, so functions
    round-trip like any other value.
  - `destructure` threw `RangeError: Invalid array length` on an array source,
    because it cached its accessors on the proxy target and so tried to assign one
    to `length`. The accessors now live in a separate map, and `length` plus the
    symbol-keyed members pass through to the source, which makes array
    destructuring and iteration work.
  - `Spread<T>` declared its fields as `Readonly<() => T>`, which strips the call
    signature and made the documented `props.field()` usage fail to type-check.
  - `string` inferred a single type parameter across all interpolations, so a
    template mixing (for example) a string and a number was rejected. Its
    interpolations are now typed as `unknown`.
  - `props` exports the `ReactiveObject` constraint it was already using in the
    public signatures of `Spread<T>` and `KeyType<T>`, so those types can be named
    from outside the package.

## 1.0.0-next.2

### Patch Changes

- 57c52c9: fix version dependency

## 1.0.0-next.1

### Patch Changes

- Fix onCleanup

## 1.0.0-next.0

### Major Changes

- Support for Solid 2.0
