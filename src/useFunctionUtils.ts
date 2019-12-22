import { useState, useCallback } from 'react';

export function useInvokeCount<T, K>(fnc: (...args: T[]) => K): [(...args: T[]) => K, number] {
  const [count, setCount] = useState(0);
  const wrappedFunction = useCallback((...args: T[]) => {
    setCount((currentCount) => currentCount + 1);
    return fnc(...args);
  }, [fnc]);
  return [wrappedFunction, count];
}

export function useInvoking<T, K>(
  fnc: (...args: T[]) => K | Promise<K>,
): [(...args: T[]) => K | Promise<K>, boolean] {
  const [isInvoking, setIsInvoking] = useState(false);
  const wrappedFunction = useCallback((...args: T[]) => {
    setIsInvoking(true);
    let ret = fnc(...args);
    if (ret && (ret as Promise<K>).then) {
      ret = Promise.resolve(ret)
        .catch((error) => {
          setIsInvoking(false);
          throw error;
        })
        .then((result) => {
          setIsInvoking(false);
          return result;
        });
    } else {
      setIsInvoking(false);
    }
    return ret;
  }, [fnc]);
  return [wrappedFunction, isInvoking];
}
