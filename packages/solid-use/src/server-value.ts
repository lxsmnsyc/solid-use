import { sharedConfig } from 'solid-js';
import { isServer } from 'solid-js/web';

type HydrationContext = NonNullable<(typeof sharedConfig)['context']>;

interface ServerHydrationContext extends HydrationContext {
  serialize(key: string, value: any, defer: boolean): void;
}

const useServerValue = isServer
  ? <T>(cb: () => T): T => {
      const ctx = sharedConfig.context;
      const value = cb();
      if (ctx) {
        (ctx as ServerHydrationContext).serialize(
          `${ctx.id}${ctx.count++}`,
          value,
          false,
        );
      }
      return value;
    }
  : <T>(cb: () => T): T => {
      const ctx = sharedConfig.context;
      if (ctx && sharedConfig.load && sharedConfig.has) {
        const id = `${ctx.id}${ctx.count++}`;
        if (sharedConfig.has(id)) {
          return sharedConfig.load(id);
        }
      }
      return cb();
    };

export default useServerValue;
