import { SyntheticEvent, useCallback } from 'react';
import { assert, LoggingTypes } from './utils';

interface Handler<T, K extends T[], Z> {
  (...args: K): Z;
}
export type reactOrNativeEvent = SyntheticEvent | Event;
export type keyValueEvent<T> = [string, T, EventTarget | null];
export type eventLikeHandlers = Handler<string | EventTarget | null, keyValueEvent<string>, void>;

/**
 * Consolidates the specified list of functions into one function. This is useful
 * for calling a list of functions with similar parameters. A great use case is creating
 * a reset form function from a list of reset functions (see example below). In fact, the
 * `reset` function from {@link useForm} is created using this function.
 * @param handlers - the list of specified functions
 * @returns A single function.  When this function is invoked, it will call each specified
 * function in the order it was passed to this hook with the same arguments from the invocation.
 * @example
 * ```javascript
 * // create a reset form function by merging reset functions from other form hooks.
 * const reset = useHandlers(resetValues, resetErrors, resetTouches);
 * ```
 */
export function useHandlers<T, K extends T[]>(
  ...handlers: Handler<T, K, void>[]
): Handler<T, K, void> {
  return useCallback((...args: K): void => {
    handlers.forEach((func): void => {
      assert.error(
        typeof func === 'function',
        LoggingTypes.typeError,
        `(expected: function, received: ${typeof func})`,
      );
      func(...args);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, handlers);
}
