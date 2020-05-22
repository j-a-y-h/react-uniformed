import { assert, LoggingTypes } from '../utils';
import { Validators, validValidatorReturnTypes } from './types';
import { Fields } from '../useFields';
import { Errors, validErrorValues } from '../useErrors';
import { MutableValues } from '../useGenericValues';

function defaultValidator(): validValidatorReturnTypes {
  return '';
}

export function assertValidator(functionName: string, name: string, validator: Function): void {
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
