import {
  Constraints,
  supportedTypes,
  supportedTypesSet,
  supportedProperties,
  defaultMessage,
  ConstraintValidators,
} from './types';
import { assert, LoggingTypes } from '../utils';
import { FieldValue } from '../useFields';
import { propertyValidators } from './propertyValidators';
import { Validators, Validator } from '../useValidation/types';
import { MutableValues } from '../useGenericValues';
import { hasRule, getRuleValue, getRuleMessage } from './utils';

function validateRule(name: string, rules: Constraints): void {
  assert.error(
    !!rules && typeof rules === 'object',
    LoggingTypes.typeError,
    `(expected: Constraints, received: ${typeof rules}) The Constraints object with name (${name}) is invalid.`,
  );
  // throws warnings for invalid rules
  if (hasRule(rules, 'type')) {
    const type = getRuleValue(rules, 'type') as supportedTypes;
    assert.warning(
      supportedTypesSet.has(type),
      LoggingTypes.constraintError,
      `(input: ${name}) unsupported type (${type}). An unsupported type just means we don't have custom validation logic for this.`,
    );
  }
  if (hasRule(rules, 'maxLength') && hasRule(rules, 'minLength')) {
    const minLength = getRuleValue(rules, 'minLength');
    const maxLength = getRuleValue(rules, 'maxLength');
    assert.warning(
      maxLength >= minLength,
      LoggingTypes.constraintError,
      `(input: ${name}) maxLength (${maxLength}) is less than minLength (${minLength}).`,
    );
  }
  if (hasRule(rules, 'min') && hasRule(rules, 'max')) {
    const min = getRuleValue(rules, 'min');
    const max = getRuleValue(rules, 'max');
    assert.warning(
      max >= min,
      LoggingTypes.constraintError,
      `(input: ${name}) max (${max}) is less than min (${min}).`,
    );
  }
  if (hasRule(rules, 'pattern')) {
    const pattern = getRuleValue(rules, 'pattern');
    assert.warning(
      pattern instanceof RegExp,
      LoggingTypes.constraintError,
      `(input: ${name}) pattern must be a RegExp object.`,
    );
  }
}
function validateUsingContraints(rules: Constraints, value?: FieldValue): string {
  // check required
  const erroredProperty = supportedProperties.find((property): boolean => {
    let hasError = false;
    if (hasRule(rules, property)) {
      const propValue = getRuleValue(rules, property);
      hasError = !propertyValidators[property](rules, propValue, value);
    }
    return hasError;
  });
  let message = '';
  if (erroredProperty) {
    message = getRuleMessage(rules, erroredProperty) || defaultMessage[erroredProperty];
  }
  return message;
}

export function mapConstraintsToValidators(rules: ConstraintValidators): Validators {
  assert.error(
    rules && typeof rules === 'object',
    LoggingTypes.invalidArgument,
    `(expected: Object<string, Constraint> received: ${typeof rules}) ${
      mapConstraintsToValidators.name
    } requires a constraint object.`,
  );
  return Object.keys(rules).reduce(
    (validationMap: MutableValues<Validator>, name: string): MutableValues<Validator> => {
      const currentValidator = rules[name];
      if (typeof currentValidator !== 'function') {
        validateRule(name, currentValidator);
      }
      // eslint-disable-next-line no-param-reassign
      validationMap[name] =
        typeof currentValidator !== 'function'
          ? (value?: FieldValue): string => validateUsingContraints(currentValidator, value)
          : currentValidator;
      return validationMap;
    },
    {},
  );
}
