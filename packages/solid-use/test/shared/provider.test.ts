import { createRoot } from 'solid-js';
import { describe, expect, it } from 'vitest';
import {
  capturedProvider,
  createProvider,
  inject,
  provide,
  providerScope,
  withProvider,
} from '../../src/provider';

describe('createProvider', () => {
  it('creates distinct providers', () => {
    const a = createProvider('a');
    const b = createProvider('b');
    expect(a.id).not.toBe(b.id);
  });
});

describe('inject', () => {
  it('returns the default value outside of any scope', () => {
    const Message = createProvider('Hello World');
    expect(inject(Message)).toBe('Hello World');
  });

  it('returns the default value when nothing was provided', () => {
    const Message = createProvider('Hello World');
    providerScope(() => {
      expect(inject(Message)).toBe('Hello World');
    });
  });
});

describe('provide', () => {
  it('injects the provided value inside the scope', () => {
    const Message = createProvider('Hello World');
    providerScope(() => {
      provide(Message, 'Hello Solid');
      expect(inject(Message)).toBe('Hello Solid');
    });
  });

  it('does not leak outside of the scope', () => {
    const Message = createProvider('Hello World');
    providerScope(() => {
      provide(Message, 'Hello Solid');
    });
    expect(inject(Message)).toBe('Hello World');
  });

  it('is a no-op outside of a scope', () => {
    const Message = createProvider('Hello World');
    expect(() => {
      provide(Message, 'Hello Solid');
    }).not.toThrow();
    expect(inject(Message)).toBe('Hello World');
  });

  it('is removed when the owning scope is disposed', () => {
    const Message = createProvider('Hello World');
    let read!: () => string;

    createRoot((dispose) => {
      providerScope(() => {
        provide(Message, 'Hello Solid');
        read = capturedProvider(() => inject(Message));
        expect(read()).toBe('Hello Solid');
      });
      dispose();
    });

    expect(read()).toBe('Hello World');
  });
});

describe('providerScope', () => {
  it('returns the value of its callback', () => {
    expect(providerScope(() => 42)).toBe(42);
  });

  it('resolves values from parent scopes', () => {
    const Outer = createProvider('outer-default');
    const Inner = createProvider('inner-default');

    providerScope(() => {
      provide(Outer, 'outer');
      providerScope(() => {
        provide(Inner, 'inner');
        expect(inject(Outer)).toBe('outer');
        expect(inject(Inner)).toBe('inner');
      });
    });
  });

  it('lets a nested scope shadow a parent value', () => {
    const Message = createProvider('default');

    providerScope(() => {
      provide(Message, 'outer');
      providerScope(() => {
        provide(Message, 'inner');
        expect(inject(Message)).toBe('inner');
      });
      expect(inject(Message)).toBe('outer');
    });
  });

  it('restores the previous scope when the callback throws', () => {
    const Message = createProvider('default');

    providerScope(() => {
      provide(Message, 'outer');
      expect(() =>
        providerScope(() => {
          throw new Error('boom');
        }),
      ).toThrow('boom');
      expect(inject(Message)).toBe('outer');
    });
  });
});

describe('capturedProvider', () => {
  it('injects from the scope that was active at capture time', () => {
    const Message = createProvider('default');
    let read!: () => string;

    providerScope(() => {
      provide(Message, 'captured');
      read = capturedProvider(() => inject(Message));
    });

    expect(read()).toBe('captured');
  });

  it('forwards arguments and the return value', () => {
    const add = capturedProvider((a: number, b: number) => a + b);
    expect(add(1, 2)).toBe(3);
  });

  it('restores the surrounding scope after the call', () => {
    const Message = createProvider('default');
    let read!: () => string;

    providerScope(() => {
      provide(Message, 'captured');
      read = capturedProvider(() => inject(Message));
    });

    providerScope(() => {
      provide(Message, 'current');
      expect(read()).toBe('captured');
      expect(inject(Message)).toBe('current');
    });
  });

  it('restores the surrounding scope when the callback throws', () => {
    const Message = createProvider('default');
    const boom = capturedProvider(() => {
      throw new Error('boom');
    });

    providerScope(() => {
      provide(Message, 'current');
      expect(() => boom()).toThrow('boom');
      expect(inject(Message)).toBe('current');
    });
  });
});

describe('withProvider', () => {
  it('wraps the component in its own provider scope', () => {
    const Message = createProvider('default');

    const Child = () => inject(Message) as unknown as never;
    const Parent = withProvider(() => {
      provide(Message, 'from parent');
      return Child();
    });

    expect(Parent({})).toBe('from parent' as never);
    expect(inject(Message)).toBe('default');
  });

  it('passes props through', () => {
    const Comp = withProvider((props: { value: number }) => (props.value * 2) as unknown as never);
    expect(Comp({ value: 21 })).toBe(42 as never);
  });
});
