# Contributing to solid-headless

Please read the [Code of Conduct](/CODE_OF_CONDUCT.md) first.

## Developing

The development branch is `main` and this is the branch that all pull requests should be made against.

To develop locally:

1. Fork this repository to your own Github account and then clone it to your local device.
2. Create a new branch:

```bash
git checkout -b MY_BRANCH_NAME
```

3. Install yarn:

```bash
npm install -g yarn
```

4. Install dependencies with:

```bash
yarn
```

5. Link dependencies with

```bash
yarn bootstrap
```

### Developing packages

To develop a package, open your terminal on `packages/PACKAGE_NAME`.

- Use `yarn build` to build the source of the package.
- Use `yarn clean` to clean the build directory.
- Use `yarn type-check` to perform type-checking.
- Use `yarn lint` to perform linting.

You can also use the same commands on the project root.

### Developing examples

Examples are made through [Vite](https://vitejs.dev/guide/). Examples should be marked as private packages (through `"private": true` in package.json) to keep them from being published. When using local packages as dependencies, make sure to use the exact version in the `"dependencies`" of the examples.

### Repository Management

The development of this project heavily relies on the use of [Classic Yarn (1.x)](https://classic.yarnpkg.com/lang/en/) for managing packages and [Lerna](https://lerna.js.org/) for managing the workspace.

### Styling

This project follows the [AirBnb JavaScript Style Guide](https://github.com/airbnb/javascript) and is enforced through the use [ESLint](https://eslint.org/) and [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint). It is recommended to have the [ESLint plugin for VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) during development.
