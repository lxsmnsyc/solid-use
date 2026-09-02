import useOnlineStatus from '../../src/online-status';
import useServerValue from '../../src/server-value';

/**
 * One scenario shared by `test/server/server-value.test.ts` and
 * `test/client/server-value.test.ts`.
 *
 * `useOnlineStatus` is rendered first on purpose: its `onSettled` call consumes
 * a hydration id on both the server and the client, so the two `useServerValue`
 * calls only line up if the id counters stay in step. That is exactly the
 * guarantee that replaced the old `isServer` branches, so the round trip is
 * asserted rather than assumed.
 */
export function renderScenario(
  first: () => number,
  second: () => string,
): { first: number; second: string } {
  useOnlineStatus();
  return {
    first: useServerValue(first),
    second: useServerValue(second),
  };
}

/** Hydration ids the scenario assigns, in order. */
export const SCENARIO_IDS = ['1', '2'] as const;

/** The payload the server writes for the scenario above. */
export const SCENARIO_PAYLOAD: Record<string, unknown> = {
  [SCENARIO_IDS[0]]: 42,
  [SCENARIO_IDS[1]]: 'hello',
};

/**
 * Reads the values Solid serialized into an SSR payload
 * (`_$HY.r["<id>"]=<json>;`).
 */
export function parsePayload(html: string): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  const pattern = /_\$HY\.r\["([^"]+)"\]=(.+?);/g;
  let match = pattern.exec(html);
  while (match) {
    payload[match[1]] = JSON.parse(match[2]);
    match = pattern.exec(html);
  }
  return payload;
}
