import { useErrors } from '../useErrors';
import { FieldValue } from '../useFields';
import { SingleValidator, UseValidatorHook, Validators, UseValidatorHookPartial } from './types';
import { useValidateByName, useValidate } from './validators';

export function useValidation(validator: SingleValidator<FieldValue>): UseValidatorHook<FieldValue>;

export function useValidation<T extends Validators>(
  validator: T,
): UseValidatorHookPartial<FieldValue, T>;

export function useValidation<T extends Validators>(
  validator: T | SingleValidator<FieldValue>,
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
  const { setError, errors, hasErrors, resetErrors, setErrors } = useErrors();
  // create a validate by input name function
  const validateByName = useValidateByName({ setError, validator });
  // create validate all function
  const validate = useValidate({ setErrors, validator });

  return {
    validate,
    validateByName,
    errors,
    hasErrors,
    resetErrors,
    setError,
  };
}
