import { useCallback } from 'react';
import { ValidateAllHandler } from './useValidation';
import { FieldValue, Fields } from './useFields';
import { eventLikeHandlers } from './useHandlers';

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
