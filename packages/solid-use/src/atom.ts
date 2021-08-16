import { createSignal } from 'solid-js';
import { is } from './utils';

export interface Atom<T> {
  (): T;
  (value: T): T;
}

export default function atom<T>(value: T, equals = is): Atom<T> {
  const [state, setState] = createSignal(value, {
    equals,
  });
  return (...args: [] | [T]): T => {
    if (args.length === 1) {
      setState(() => args[0]);
    }
    return state();
  };
}
