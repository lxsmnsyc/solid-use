# ![solid-use](https://github.com/lxsmnsyc/solid-use/raw/main/images/banner.png)

> A collection of SolidJS utilities

[![NPM](https://img.shields.io/npm/v/solid-use.svg)](https://www.npmjs.com/package/solid-use)

## Install

```bash
npm install solid-js solid-use
```

```bash
yarn add solid-js solid-use
```

```bash
pnpm add solid-js solid-use
```

Requires `solid-js` 1.7 or later. Each utility is imported from its own path, such as `solid-use/atom`.

## Docs

State

- [`solid-use/atom`](https://github.com/lxsmnsyc/solid-use/tree/main/docs/atom.md) is a signal in a single function.
- [`solid-use/string`](https://github.com/lxsmnsyc/solid-use/tree/main/docs/string.md) builds reactive strings from a template.

Components

- [`solid-use/props`](https://github.com/lxsmnsyc/solid-use/tree/main/docs/props.md) splits props into accessors.
- [`solid-use/provider`](https://github.com/lxsmnsyc/solid-use/tree/main/docs/provider.md) passes values down without nested providers.

Data

- [`solid-use/fetch`](https://github.com/lxsmnsyc/solid-use/tree/main/docs/fetch.md) is a reactive Fetch API.

Browser

- [`solid-use/media-query`](https://github.com/lxsmnsyc/solid-use/tree/main/docs/media-query.md) tracks CSS media queries.
- [`solid-use/online-status`](https://github.com/lxsmnsyc/solid-use/tree/main/docs/online-status.md) tracks the network connection.
- [`solid-use/page-visibility`](https://github.com/lxsmnsyc/solid-use/tree/main/docs/page-visibility.md) tracks whether the page is visible.

SSR

- [`solid-use/server-value`](https://github.com/lxsmnsyc/solid-use/tree/main/docs/server-value.md) reuses a server-computed value during hydration.
- [`solid-use/client-only`](https://github.com/lxsmnsyc/solid-use/tree/main/docs/client-only.md) renders code only in the browser.

## Examples

See [`examples`](https://github.com/lxsmnsyc/solid-use/tree/main/examples) for small apps that use these utilities.

## Contributing

See [CONTRIBUTING.md](https://github.com/lxsmnsyc/solid-use/blob/main/CONTRIBUTING.md).

## Sponsors

![Sponsors](https://github.com/lxsmnsyc/sponsors/blob/main/sponsors.svg?raw=true)

## License

MIT © [lxsmnsyc](https://github.com/lxsmnsyc)
