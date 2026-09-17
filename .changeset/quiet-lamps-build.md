---
'solid-use': minor
---

The package is now built with tsdown. Every entry still ships as ESM and CJS with type declarations.

- Files in `dist` moved. Imports through `solid-use/<entry>` are unaffected, but deep imports into `dist` need updating.
- The separate `development` builds are gone. They were identical to the production builds.
- `string` accepts interpolations of mixed types in one template.
- Fields returned by `destructure` and `spread` are now typed as callable accessors.
- `destructure` no longer throws on arrays. Array destructuring and iteration now work.
