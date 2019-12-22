import { useState, useCallback } from 'react';

export function useInvokeCount<T, K>(fnc: (...args: T[]) => K): [(...args: T[]) => K, number] {
  const [count, setSubmitCount] = useState(0);
  const wrappedFunction = useCallback((...args: T[]) => {
    setSubmitCount((currentCount) => currentCount + 1);
    return fnc(...args);
  }, [fnc]);
  return [wrappedFunction, count];
}
