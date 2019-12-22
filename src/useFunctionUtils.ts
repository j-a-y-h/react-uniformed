import { useState, useCallback } from 'react';

/**
 * Counts the number of times the specified function is invoked.
 * @param fnc the specified function
 * @return {[function, number]} an array where the first index is a function and
 * the second argument is the number of times the function was called.
 */
export function useInvokeCount<T, K>(fnc: (...args: T[]) => K): [(...args: T[]) => K, number] {
  const [count, setCount] = useState(0);
  const wrappedFunction = useCallback((...args: T[]) => {
    setCount((currentCount) => currentCount + 1);
    return fnc(...args);
  }, [fnc]);
  return [wrappedFunction, count];
}

/**
 * Determines if the specified function is being called. This function
 * is only useful for async functions.
 * @param fnc the specified function
 * @return {[function, boolean]} an array where the first index is a function and
 * the second argument is the state of the invocation for the function.
 */
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
