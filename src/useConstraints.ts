import { useMemo } from 'react';
import { Values, MutableValues, ConstantValues } from './useGenericValues';
import {
  Validator, Validators, SingleValidator, validateValidators,
} from './useValidation';
import { assert, LoggingTypes } from './utils';
import { Errors } from './useErrors';
import { FieldValue, Fields } from './useFields';

type supportedTypes = 'email' | 'text' | 'url' | 'number' | 'date';
// possible values:
// "text" | "number" | "date" | "email" | "checkbox" |
// "tel" | "time" | "url" | "week" | "month" | "year" | "range";
export const supportedTypesSet = new Set<supportedTypes>(['text', 'email', 'url', 'number', 'date']);

interface Constraints {
  /**
   * A minLength used for non number values
   */
  readonly minLength?: number | [number, string];
  /**
   * A maxLength used for non number values
   */
  readonly maxLength?: number | [number, string];
  /**
   * A min boundary used for type numbers
   */
  readonly min?: number | string | [number | string, string];
  /**
   * A max boundary used for type numbers
   */
  readonly max?: number | string | [number | string, string];
  /**
   * Determines if the field is required
   *
   * @defaultValue false
   */
  readonly required?: boolean | string | [boolean, string];
  /**
   * A RegExp pattern used for validation
   */
  readonly pattern?: RegExp | [RegExp, string];
  /**
   * The type of input.
   * currently supported values are **text**, **email**, **url**.
   * email and url types are validated using the appropriate regex
   *
   * @defaultValue text
   */
  readonly type?: supportedTypes | [string, string];
}
type supportedConstraints = keyof Constraints;
type constraintValues = boolean | number | RegExp | string | Date;
type RequiredConstraint<T extends supportedConstraints> = {
  [P in T]-?: constraintValues;
};

export type ConstraintValidators = Values<Constraints | Validator>;

export interface SyncedConstraint {
  (values: Fields): ConstraintValidators;
}

const defaultMessage = {
  required: 'There must be a value (if set).',
  maxLength: 'The number of characters is too long.',
  minLength: 'The number of characters is too short.',
  max: 'The value is too large.',
  min: 'The value is too small.',
  pattern: 'The value must match the pattern.',
  type: 'The value must match the type.',
};
// TODO: break file into directory

export const supportedProperties: supportedConstraints[] = [
  'required',
  'type',
  'pattern',
  'maxLength',
  'minLength',
  'max',
  'min',
];

function hasValue(value?: FieldValue): value is string {
  return value === 0 || Boolean(value);
}

function getRuleValueAndMessage(
  rules: Constraints, name: supportedConstraints,
): [constraintValues, string] {
  const rule = rules[name];
  let message = '';
  let value: constraintValues;
  if (Array.isArray(rule)) {
    ([value, message] = rule);
  } else {
    value = rule || '';
  }
  if (name === 'required') {
    message = !message && typeof value === 'string' ? value : message;
    value = Boolean(value);
  }
  return [value, message];
}

function getRuleValue(rules: Constraints, name: supportedConstraints): constraintValues {
  const [value] = getRuleValueAndMessage(rules, name);
  return value;
}

const propertyValidators = {
  required(_: Constraints, required: constraintValues, value?: FieldValue): boolean {
    return !required || hasValue(value);
  },
  maxLength(_: Constraints, maxLength: constraintValues, value?: FieldValue): boolean {
    return !hasValue(value) || (typeof value === 'string' && value.length <= Number(maxLength));
  },
  minLength(_: Constraints, minLength: constraintValues, value?: FieldValue): boolean {
    return !hasValue(value) || (typeof value === 'string' && value.length >= Number(minLength));
  },
  max(rules: Constraints, max: constraintValues, value?: FieldValue): boolean {
    if (!hasValue(value)) {
      return true;
    }
    const type = getRuleValue(rules, 'type');
    return (type === 'date')
      ? new Date(value) <= new Date(max as string | number)
      : Number(value) <= Number(max);
  },
  min(rules: Constraints, min: constraintValues, value?: FieldValue): boolean {
    if (!hasValue(value)) {
      return true;
    }
    const type = getRuleValue(rules, 'type');
    return (type === 'date')
      ? new Date(value) >= new Date(min as string | number)
      : Number(value) >= Number(min);
  },
  type(_: Constraints, type: constraintValues, value: FieldValue = ''): boolean {
    if (!hasValue(value)) {
      return true;
    }
    let regex: RegExp;
    switch (type) {
    case 'url':
      regex = /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)$/;
      return regex.test(value);
    case 'email':
      regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      return regex.test(value);
    case 'number':
      return /^-?(\d+|\d+\.\d+|\.\d+)([eE][-+]?\d+)?$/.test(value);
    case 'date':
      // TODO: update to date yyyy-MM-dd
      // TODO: support datetime-local and datetime with warning
      return !Number.isNaN((new Date(value)).getTime());
    case 'text':
    default: return true;
    }
  },
  pattern(_: Constraints, pattern: constraintValues, value: FieldValue = ''): boolean {
    return !hasValue(value) || (!(pattern instanceof RegExp) || pattern.test(value));
  },
};

function getRuleMessage(rules: Constraints, name: supportedConstraints): string {
  const [, message] = getRuleValueAndMessage(rules, name);
  return message;
}
function hasRule<T extends supportedConstraints>(
  rules: Constraints, name: T,
): rules is RequiredConstraint<T> {
  return ({}).hasOwnProperty.call(rules, name);
}

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

function mapConstraintsToValidators(rules: ConstraintValidators): Validators {
  assert.error(
    rules && typeof rules === 'object',
    LoggingTypes.invalidArgument,
    `(expected: Object<string, Constraint> received: ${typeof rules}) ${mapConstraintsToValidators.name} requires a constraint object.`,
  );
  return Object.keys(rules).reduce((
    validationMap: MutableValues<Validator>,
    name: string,
  ): MutableValues<Validator> => {
    const currentValidator = rules[name];
    if (typeof currentValidator !== 'function') {
      validateRule(name, currentValidator);
    }
    // eslint-disable-next-line no-param-reassign
    validationMap[name] = (typeof currentValidator !== 'function')
      ? (value?: FieldValue): string => (
        validateUsingContraints(currentValidator, value)
      )
      : currentValidator;
    return validationMap;
  }, {});
}

// TODO: clean up docs if necessary

/* eslint-disable import/prefer-default-export */

/**
 * @example Basic
 * ```javascript
 *  const validator = useConstraints({
 *      firstName: { required: true, minLength: 5, maxLength: 6 },
 *      lastName: { required: true, maxLength: 100 },
 *      age: { type: "number", min: 18, max: 99 },
 *      location: { required: true, pattern: /(europe|africa)/},
 *      email: { required: true, type: "email" },
 *      website: { required: true, type: "url" }
 *  });
 *  //
 *  validator.firstName("Johny") === "";
 * ```
 * @example Displaying custom messages on error.
 * ```javascript
 *  const validator = useConstraints({
 *      // use min, max on date type
 *      startDate: { type: "date", min: Date.now() },
 *      // custom message
 *      name: {
 *          required: "name is required",
 *          maxLength: [55, "name must be under 55 characters"]
 *      },
 *  })
 * ```
 * @example Usage with {@link useForm}
 * ```javascript
 *  useForm({
 *    constraints: {
 *      location: { required: true, pattern: /(europe|africa)/},
 *      email: { required: true, type: "email" },
 *    },
 *  })
 * ```
 * @param rules - an object map that consist of {@link Constraints} or {@link Validator} as values.
 * @returns maps the rules to an object map where the value is a function. Each function
 * accepts only one argument that is the value to validate when invoked.
 */
export function useConstraints<T extends ConstraintValidators>(
  rules: T
): ConstantValues<T, Validator>;

/**
 * A declarative way of creating validation logic that is dependent on other values.
 *
 * @example Binding constraints to values. This example is extremely powerful if you
 * want to create validation logic that is dependent on other values.
 * ```javascript
 *  const validator = useConstraints((values) => ({
 *      startDate: { type: "date", min: Date.now() },
 *      // ensure that the end date is always greater than the start date
 *      endDate: {
 *          type: "date",
 *          min: [values.startDate, "end date must be greater than start date"]
 *      },
 *  }))
 *  // note: if you are using the constraints with the useForm hook
 *  // then you can bind the validator with the values so that the handler
 *  // can be used with events
 *  const handleBlur = useValidationWithValues(validator, values);
 * ```
 * @example Usage with {@link useForm}
 *
 * ```javascript
 *  useForm({
 *    constraints(values) {
 *      startDate: { type: "date", min: Date.now() },
 *      // ensure that the end date is always greater than the start date
 *      endDate: {
 *          type: "date",
 *          min: [values.startDate, "end date must be greater than start date"]
 *      },
 *    }
 *  });
 * ```
 *
 * @param syncedConstraint - A validator function that accepts a value map as the only argument.
 * The return value of the specified function must be of type {@link ConstraintValidators}.
 * @returns A validation function similar to the `validate` function from {@link useValidation}.
 */
export function useConstraints(syncedConstraint: SyncedConstraint): SingleValidator<FieldValue>;

export function useConstraints<T extends ConstraintValidators>(
  rules: SyncedConstraint | T
): ConstantValues<T, Validator> | SingleValidator<FieldValue>;

/**
 * A declarative way of validating inputs based upon HTML 5 constraints.
 *
 * @returns If you are using this outside of {@link useForm},
 * then it is recommended that you use this with {@link useValidation}.
 */
export function useConstraints(
  rules: ConstraintValidators | SyncedConstraint,
): Validators | SingleValidator<FieldValue> {
  return useMemo((): Validators | SingleValidator<FieldValue> => {
    if (typeof rules === 'function') {
      return (values: Fields): Promise<Errors> => {
        const constraints = rules(values);
        const validators = mapConstraintsToValidators(constraints);
        const names = Object.keys(constraints);
        return validateValidators(names, validators, values);
      };
    }
    return mapConstraintsToValidators(rules);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);
}
