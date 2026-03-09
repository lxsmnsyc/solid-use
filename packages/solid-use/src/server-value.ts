import { isServer } from '@solidjs/web';
import { sharedConfig } from 'solid-js';
import type { HydrationContext } from 'solid-js/types/server/shared.js';

interface ServerSharedConfig {
  context?: HydrationContext;
}

const useServerValue = isServer
  ? <T>(cb: () => T): T => {
      const id = sharedConfig.getNextContextId();
      const ctx = (sharedConfig as ServerSharedConfig).context;
      const value = cb();
      if (ctx && id != null) {
        ctx.serialize(id, value, false);
      }
      return value;
    }
  : <T>(cb: () => T): T => {
      if (sharedConfig.load && sharedConfig.has) {
        const id = sharedConfig.getNextContextId();
        if (id != null && sharedConfig.has(id)) {
          return sharedConfig.load(id);
        }
      }
      return cb();
    };

export default useServerValue;
