import {
  SyntheticEvent, useCallback,
} from 'react';
import { assert, LoggingTypes } from './utils';
import { FieldValue, Fields } from './useFields';
import { ValidateAllHandler } from './useValidation';

interface Handler<T, K extends T[], Z> {
  (...args: K): Z;
}
export type reactOrNativeEvent = SyntheticEvent | Event;
export type keyValueEvent<T> = [string, T, EventTarget | null];
export type eventLikeHandlers = Handler<string | EventTarget | null, keyValueEvent<string>, void>

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

// TODO: break out each hook into separate files and update tsconfig.json typedoc

/**
 * Creates a function that accepts a name and value as parameters.
 * When the returned function is invoked, it will call the specified
 * validate function with the specified values merged in with the name
 * and value passed to the invoked function.
 *
 * The main purpose of this hook is to use validate with `useSettersAsEventHandler` without
 * validation being one update behind.
 *
 * @param validate - a validation function that accepts an object of values.
 * @param values - a values object.
 * @returns a function that can be invoked with a name and value.<br>
 * See {@link useSettersAsEventHandler}<br>
 * See {@link useSettersAsRefEventHandler}
 * @example
 * ```javascript
 * // used with useForms
 * const {validate, values, setValue} = useForms(...);
 * const validateAll = useValidateAsSetter(validate, values);
 * // now you can use validate with onChange events and keep the validation
 * // in sync.
 * const onChange = useSettersAsEventHandler(setValue, validateAll);
 * ```
 */
export function useValidateAsSetter(
  validate: ValidateAllHandler<FieldValue>,
  values: Fields,
): eventLikeHandlers {
  return useCallback((name, value) => {
    validate(!name ? values : {
      ...values,
      [name]: value,
    });
  }, [values, validate]);
}
