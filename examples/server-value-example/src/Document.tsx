import { HydrationScript } from '@solidjs/web';
import type { Element } from 'solid-js';

/**
 * The document shell the plugin wraps the app in. Picked up by convention from
 * `src/Document.tsx`; without it the plugin renders a built-in shell.
 *
 * `HydrationScript` installs the `_$HY` payload holder that `useServerValue`
 * writes into, so it has to be part of the document.
 */
export default function Document(props: { children?: Element }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>solid-use / server-value</title>
        <HydrationScript />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
