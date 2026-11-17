# Contributing to solid-use

Please read the [Code of Conduct](/CODE_OF_CONDUCT.md) first.

## Setup

Pull requests go against `main`, which is the Solid 2 line. The Solid 1 code is on the `solid-1` branch.

1. Fork the repository and clone it.
2. Create a branch.

   ```bash
   git checkout -b MY_BRANCH_NAME
   ```

3. Enable pnpm through Corepack. The version comes from `packageManager` in `package.json`.

   ```bash
   corepack enable
   ```

4. Install dependencies.

   ```bash
   pnpm install
   ```

## Commands

Run these from the repository root.

- `pnpm build` builds the package and the examples.
- `pnpm test` runs the test suites.
- `pnpm type-check` type-checks everything with TypeScript 7.
- `pnpm lint` runs [oxlint](https://oxc.rs/docs/guide/usage/linter). `pnpm lint:fix` applies fixes.
- `pnpm fmt` formats with [oxfmt](https://oxc.rs/docs/guide/usage/formatter). `pnpm fmt:check` only checks.

## The package

The library lives in `packages/solid-use`. Each file in `src` is published as its own entry, such as `solid-use/atom`.

- `pnpm build` runs [tsdown](https://tsdown.dev/) and writes ESM and type declarations to `dist`.
- `pnpm watch` rebuilds on change.
- `pnpm test` runs the suite once. `pnpm test:watch` keeps it running.

Tests run twice, once against Solid's browser build under `jsdom` and once against its server build under Node. Put environment-specific tests in `test/client` or `test/server`, and tests that must behave the same in both in `test/shared`.

To add an entry, add the file to `entry` in `tsdown.config.ts`. The build updates `exports` in `package.json`.

## Examples

Examples live in `examples`. They are private packages and depend on the library through `workspace:*`.

## Releases

Releases use [changesets](https://github.com/changesets/changesets).

1. Add a changeset for any change that affects the published package.

   ```bash
   pnpm cs:add
   ```

2. Merge the pull request into `main`.
3. The release workflow opens a "Version Packages" pull request.
4. Merging that pull request publishes to npm and creates the GitHub release.

## Style

Formatting is decided by `pnpm fmt`. Lint rules come from [`@lxsmnsyc/oxlint-config`](https://www.npmjs.com/package/@lxsmnsyc/oxlint-config). Each exception in `oxlint.config.ts` has a comment explaining it.
