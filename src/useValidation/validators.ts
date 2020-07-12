import { useCallback, useMemo } from 'react';
import { assert, LoggingTypes } from '../utils';
import {
  Validators,
  validValidatorReturnTypes,
  ValidateHandler,
  ValidateAllHandler,
  UseValidateByNameProps,
  UseValidateProps,
  Validator,
} from './types';
import { Fields, FieldValue } from '../useFields';
import { Errors, validErrorValues } from '../useErrors';
import { MutableValues } from '../useGenericValues';
import { useValidation } from '..';

function defaultValidator(): validValidatorReturnTypes {
  return '';
}

function assertValidator(functionName: string, name: string, validator: Validator): void {
  assert.error(
    typeof validator === 'function',
    LoggingTypes.typeError,
    // note: received is any bc we don't know what the validator is
    // as the input could have defaulted to the defaultValidator
    `(expect: function, received: any) ${functionName} expects the validator with the name (${name}) to be a function.`,
  );
}

export async function validateValidators(
  names: string[],
  validators: Validators,
  values: Fields,
): Promise<Errors> {
  // validate all fields by name
  const errorsPromiseMap = names.map(
    async (name): Promise<[string, validErrorValues]> => {
      const handler = validators[name] || defaultValidator;
      assertValidator(validateValidators.name, name, handler);
      const currentErrors = await handler(values[name]);
      return [name, currentErrors];
    },
  );
  const errorsMap = await Promise.all(errorsPromiseMap);
  // create an Errors object from the errorsMap
  return errorsMap.reduce((objectMap: MutableValues<validErrorValues>, [name, error]): Errors => {
    // eslint-disable-next-line no-param-reassign
    objectMap[name] = error;
    return objectMap as Errors;
  }, {});
}

export function useValidateByName({
  setError,
  validator,
}: UseValidateByNameProps): ValidateHandler<FieldValue> {
  return useCallback(
    async (name: string, value: FieldValue): Promise<void> => {
      let error: validErrorValues;
      if (typeof validator === 'function') {
        const localErrors = await validator({ [name]: value });
        error = localErrors[name] || '';
      } else {
        const handler = validator[name] || defaultValidator;
        assertValidator(useValidation.name, name, handler);
        error = (await handler(value)) || '';
      }
      setError(name, error);
    },
    [setError, validator],
  );
}

export function useValidate({
  setErrors,
  validator,
}: UseValidateProps): ValidateAllHandler<FieldValue> {
  const fieldsToUseInValidateAll = useMemo(
    (): string[] => (!validator || typeof validator === 'function' ? [] : Object.keys(validator)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return useCallback(
    async (values: Fields): Promise<void> => {
      const names = Array.from(new Set([...Object.keys(values), ...fieldsToUseInValidateAll]));
      let localErrors: Errors;
      if (typeof validator === 'function') {
        localErrors = await validator(values);
      } else {
        localErrors = await validateValidators(names, validator, values);
      }
      setErrors(localErrors);
    },
    [setErrors, fieldsToUseInValidateAll, validator],
  );
}
