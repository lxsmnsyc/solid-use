import { createSignal } from 'solid-js';

export interface Atom<T> {
  (): T;
  (value: T): T;
}

export default function atom<T>(value: T): Atom<T> {
  const [state, setState] = createSignal(value);
  return (...args: [] | [T]): T => {
    if (args.length === 1) {
      setState(() => args[0]);
    }
    return state();
  };
}
