import { createSignal } from 'solid-js';

export interface Atom<T> {
  (): T;
  (value: T): T;
}

/** Boxes the value so that a function can be stored as a value. */
interface Box<T> {
  v: T;
}

/**
 * A simplified `createSignal`: one function that reads when called with no
 * argument and writes when called with one.
 *
 * The value is held in a box rather than in the signal directly. `createSignal`
 * treats a bare function as a derived computation, and its setter treats one as
 * an updater callback, so an unboxed atom could never hold a function as its
 * value.
 */
export default function atom<T>(value: T, equals = Object.is): Atom<T> {
  const [state, setState] = createSignal<Box<T>>(
    { v: value },
    {
      equals: (prev, next) => equals(prev.v, next.v),
      // An atom is a general-purpose handle: it is meant to be written from
      // wherever the caller happens to be, including inside a component or an
      // effect, which Solid otherwise rejects as a write in an owned scope.
      ownedWrite: true,
    },
  );
  return (...args: [] | [T]): T => {
    if (args.length === 1) {
      setState({ v: args[0] });
    }
    return state().v;
  };
}
