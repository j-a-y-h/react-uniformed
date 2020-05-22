import { useCallback, useMemo } from 'react';
import {
  validErrorValues, Errors, useErrors,
} from '../useErrors';
import { FieldValue, Fields } from '../useFields';
import {
  SingleValidator, UseValidatorHook, Validators, UseValidatorHookPartial,
} from './types';
import { validateValidators } from './validators';

export function useValidation(
  validator: SingleValidator<FieldValue>
): UseValidatorHook<FieldValue>;

export function useValidation<T extends Validators>(
  validator: T
): UseValidatorHookPartial<FieldValue, T>;

export function useValidation<T extends Validators>(
  validator: T | SingleValidator<FieldValue>
): UseValidatorHookPartial<FieldValue, T> | UseValidatorHook<FieldValue>;

// TODO: breakout the jsdoc for each overload function
/**
 * A hook for performing validation.
 *
 * See {@link useErrors}.
 * @param validator - A validation map or a validation function.
 * @returns returns an {@link UseValidatorHook} or {@link UseValidatorHookPartial} object.
 *
 * @example
 *
 *```javascript
 * // validate using validation maps
 * const {validateByName, errors} = useValidation({
 *     name: (value) => value ? "" : "name is required!",
 *     email: (value) => value ? "" : "email is required!"
 * });
 *
 * // "email is required!"
 * await validateByName("email", "");
 * // {email: "email is required!"}
 * console.log(errors);
 *
 * // validate with one validation function
 * const {errors, validate} = useValidation((values) => {
 *     const errors = {name: "", email: ""};
 *     if (!values.name) {
 *         errors.name = "name is required!";
 *     }
 *     if (!values.email) {
 *         errors.email = "email is required!";
 *     }
 *     return errors;
 * });
 *
 * // {name: "", email: "email is required!"}
 * await validate({name: "John"});
 * // {name: "", email: "email is required!"}
 * console.log(errors);
 * ```
 */
export function useValidation(
  validator: Validators | SingleValidator<FieldValue>,
): UseValidatorHookPartial<FieldValue, Validators> | UseValidatorHook<FieldValue> {
  const {
    setError, errors, hasErrors, resetErrors, setErrors,
  } = useErrors();
  const fieldsToUseInValidateAll = useMemo((): string[] => (
    (!validator || typeof validator === 'function') ? [] : Object.keys(validator)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);
    // create a validate by input name function
  const validateByName = useCallback(async (
    name: string, value: FieldValue,
  ): Promise<void> => {
    let error: validErrorValues;
    if (typeof validator === 'function') {
      const localErrors = await validator({ [name]: value });
      error = localErrors[name] || '';
    } else {
      const handler = validator[name] || defaultValidator;
      assertValidator(useValidation.name, name, handler);
      error = await handler(value) || '';
    }
    setError(name, error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setError, validator]);

  // create validate all function
  const validate = useCallback(async (values: Fields): Promise<void> => {
    const names = Array.from(new Set([...Object.keys(values), ...fieldsToUseInValidateAll]));
    let localErrors: Errors;
    if (typeof validator === 'function') {
      localErrors = await validator(values);
    } else {
      localErrors = await validateValidators(names, validator, values);
    }
    setErrors(localErrors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setErrors, fieldsToUseInValidateAll, validator]);
  return {
    validate, validateByName, errors, hasErrors, resetErrors, setError,
  };
}
