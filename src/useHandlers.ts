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
type keyValueEvent<T> = [string, T, EventTarget | null];
export type eventLikeHandlers = Handler<string | EventTarget | null, keyValueEvent<string>, void>

interface ReactOrNativeEventListener {
  (event: Event | SyntheticEvent): void;
}

export function useHandlers<T, K extends T[]>(
  ...handlers: Handler<T, K, void>[]
): Handler<T, K, void> {
  return useCallback((...args: K): void => {
    handlers.forEach((func, index): void => {
      assert.error(
        typeof func === 'function',
        LoggingTypes.typeError,
        `(expected: function, received: ${typeof func}) ${useHandlers.name} expects a function at index (${index}).`,
      );
      func(...args);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, handlers);
}

export function useSettersAsEventHandler(
  ...handlers: eventLikeHandlers[]
): ReactOrNativeEventListener {
  const handler = useHandlers<string | EventTarget | null, keyValueEvent<string>>(...handlers);
  return useCallback((evt: reactOrNativeEvent): void => {
    assert.error(
      Boolean(evt?.target),
      LoggingTypes.invalidArgument,
      `${useSettersAsEventHandler.name} expects to be used in an event listener.`,
    );
    const { target } = evt;
    handler(
      (target as HTMLInputElement).name,
      // TODO: support select and multiple select
      /**
       * let value = "";
       * if (target instanceof HTMLSelectElement || target.selectedOptions) {
       *     const values = Array.from(target.selectedOptions).map((option) => option.value);
       *     value = target.multiple ? values : value[0];
       * } else {
       *     ({value} = target);
       * }
       */
      (target as HTMLInputElement).value,
      target,
    );
  }, [handler]);
}

/**
 * Creates a function that accepts a name and value as parameters.
 * When the returned function is invoked, it will call the specified
 * validate function with the specified values merged in with the name
 * and value passed to the invoked function.
 *
 * @param {ValidateAllHandler<FieldValue>} validate
 *  a validation function that accepts an object of values
 * @param {Fields} values a values object
 * @return {eventLikeHandlers} a function that can be invoked with a name and value.
 * @see {@link useSettersAsEventHandler}
 * @see {@link useSettersAsRefEventHandler}
 * @example
 * // used with useForms
 * const {validate, values, setValue} = useForms(...);
 * const validateAll = useValidateAsSetter(validate, values);
 * // now you can use validate with onChange events and keep the validation
 * // up to date.
 * const onChange = useSettersAsEventHandler(setValue, validateAll);
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
