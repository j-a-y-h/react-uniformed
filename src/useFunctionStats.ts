import { useState, useCallback, useRef } from 'react';

interface UseFunctionStatsFnc<T, K> {
  (...args: T[]): K | Promise<K>;
  (): K | Promise<K>;
}

interface UseFunctionStats<T, K> {
  readonly isRunning: boolean;
  readonly invokeCount: number;
  readonly fnc: UseFunctionStatsFnc<T, K>;
}

/**
 * Keeps track of certain statistics on a function. Eg: if the function
 * is invoking and how many times the function was called.
 *
 * @param fnc the specified function
 * @return {UseFunctionStats<T, K>} Returns a object.
 * - `isRunning`: determines if a function was running
 * - `fnc`: the specified function
 * - `invokeCount`: the number to times the function was called
 */
export function useFunctionStats<T, K>(
  fnc: UseFunctionStatsFnc<T, K>,
): UseFunctionStats<T, K> {
  const [isRunning, setIsInvoking] = useState(false);
  const invokeCount = useRef(0);
  const wrappedFunction = useCallback((...args: T[]) => {
    // note: using a ref because setIsInvoking will kick off a new render.
    //  If this wasn't true then this would need to be a setState.
    invokeCount.current += 1;
    setIsInvoking(true);
    let ret = fnc(...args);
    // @ts-expect-error
    if (ret?.then) {
      ret = Promise.resolve(ret)
        .catch((error) => {
          setIsInvoking(false);
          return Promise.reject(error);
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
  return {
    fnc: wrappedFunction,
    isRunning,
    invokeCount: invokeCount.current,
  };
}
