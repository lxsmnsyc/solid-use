# Contributing to solid-use

Please read the [Code of Conduct](/CODE_OF_CONDUCT.md) first.

## Developing

The development branch is `main` and this is the branch that all pull requests should be made against.

To develop locally:

1. Fork this repository to your own Github account and then clone it to your local device.
2. Create a new branch:

```bash
git checkout -b MY_BRANCH_NAME
```

3. Install [pnpm](https://pnpm.io/):

```bash
npm install -g pnpm
```

4. Install dependencies with:

```bash
pnpm install
```

### Repository commands

Run these from the project root; each one fans out across the workspace.

- `pnpm build` builds every package.
- `pnpm test` runs the test suites.
- `pnpm type-check` type-checks every package and example.
- `pnpm lint` runs [oxlint](https://oxc.rs/docs/guide/usage/linter) with type-aware rules; `pnpm lint:fix` applies its fixes.
- `pnpm fmt` formats with [oxfmt](https://oxc.rs/docs/guide/usage/formatter); `pnpm fmt:check` verifies formatting without writing.

The same commands run in CI, so a green `pnpm build && pnpm fmt:check && pnpm lint && pnpm type-check && pnpm test` locally means a green pipeline.

### Developing packages

To work on a single package, run the commands from its directory (for example `packages/solid-use`):

- `pnpm build` builds the package with [tsdown](https://tsdown.dev/).
- `pnpm watch` rebuilds on change.
- `pnpm test` runs the suite once; `pnpm test:watch` keeps it running.
- `pnpm type-check` type-checks both the source and the tests.

Tests run twice, once against Solid's browser build under `jsdom` and once against its server build under Node. Put environment-specific tests in `test/client` or `test/server`, and tests that must behave identically in both in `test/shared`.

### Developing examples

Examples are made through [Vite](https://vitejs.dev/guide/). Examples should be marked as private packages (through `"private": true` in package.json) to keep them from being published. When using local packages as dependencies, use `workspace:*` so the example always builds against the checkout.

### Repository management

The workspace is managed with [pnpm workspaces](https://pnpm.io/workspaces), and releases go through [changesets](https://github.com/changesets/changesets). Add one with `pnpm cs:add` whenever a change affects a published package.

### Styling

Formatting is not a matter of taste here: run `pnpm fmt` and let oxfmt decide. Lint rules come from [`@lxsmnsyc/oxlint-config`](https://www.npmjs.com/package/@lxsmnsyc/oxlint-config); exceptions live in `oxlint.config.ts` and each one carries a comment explaining why it is there.
