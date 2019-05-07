// @flow
import { useRef, useEffect } from 'react';

export default function usePrevious<T>(value: T): ?T {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
