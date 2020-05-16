import { useCallback, useMemo } from 'react';
import {
  validErrorValues, Errors, useErrors, ErrorHandler,
} from './useErrors';
import {
  Values, MutableValues, PartialValues,
} from './useGenericValues';
import { assert, LoggingTypes } from './utils';
import { FieldValue, Fields } from './useFields';

type validValidatorReturnTypes = validErrorValues | Promise<validErrorValues>;
type validSingleValidatorReturnTypes = Errors | Promise<Errors>;
export interface SingleValidator<T> {
  (values: Values<T>): validSingleValidatorReturnTypes;
}
export interface Validator {
  (value?: FieldValue): validValidatorReturnTypes;
}
export type Validators = Values<Validator>;
export interface ValidateHandler<T, K = string> {
  (name: K, value: T): void;
}
export interface ValidateAllHandler<T, K = Values<T>> {
  (valuesMap: K): Promise<void>;
}
interface UseValidatorHook<T> {
  readonly errors: Errors;
  readonly hasErrors: boolean;
  readonly setError: ErrorHandler;
  readonly validateByName: ValidateHandler<T>;
  readonly validate: ValidateAllHandler<T>;
  readonly resetErrors: () => void;
}
interface UseValidatorHookPartial<T, K> {
  readonly errors: PartialValues<K, validErrorValues>;
  readonly hasErrors: boolean;
  readonly setError: ErrorHandler<keyof K>;
  readonly validateByName: ValidateHandler<T, keyof K>;
  readonly validate: ValidateAllHandler<T, PartialValues<K, T>>;
  readonly resetErrors: () => void;
}

function defaultValidator(): validValidatorReturnTypes {
  return '';
}

function assertValidator(functionName: string, name: string, validator: Function): void {
  assert.error(
    typeof validator === 'function',
    LoggingTypes.typeError,
    // note: received is any bc we don't know what the validator is
    // as the input could have defaulted to the defaultValidator
    `(expect: function, received: any) ${functionName} expects the validator with the name (${name}) to be a function.`,
  );
}

export async function validateValidators(
  names: string[], validators: Validators, values: Fields,
): Promise<Errors> {
  // validate all fields by name
  const errorsPromiseMap = names
    .map(async (name): Promise<[string, validErrorValues]> => {
      const handler = validators[name] || defaultValidator;
      assertValidator(validateValidators.name, name, handler);
      const currentErrors = await handler(values[name]);
      return [name, currentErrors];
    });
  const errorsMap = await Promise.all(errorsPromiseMap);
  // create an Errors object from the errorsMap
  return errorsMap.reduce((
    objectMap: MutableValues<validErrorValues>, [name, error],
  ): Errors => {
    // eslint-disable-next-line no-param-reassign
    objectMap[name] = error;
    return objectMap as Errors;
  }, {});
}

export function useValidation(
  validator: SingleValidator<FieldValue>
): UseValidatorHook<FieldValue>;

export function useValidation<T extends Validators>(
  validator: T
): UseValidatorHookPartial<FieldValue, T>;

export function useValidation<T extends Validators>(
  validator: T | SingleValidator<FieldValue>
): UseValidatorHookPartial<FieldValue, T> | UseValidatorHook<FieldValue>;

/**
 * A hook for performing validation.
 *
 * @param validator A validation map or a validation function.
 * @return returns an useValidation object
 *
 * @example
 *
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
