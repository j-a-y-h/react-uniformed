import { useMemo } from 'react';
import { ConstantValues } from '../useGenericValues';
import { validateValidators } from '../useValidation/validators';
import { Validator, Validators, SingleValidator } from '../useValidation/types';
import { Errors } from '../useErrors';
import { FieldValue, Fields } from '../useFields';
import { ConstraintValidators, SyncedConstraint } from './types';
import { mapConstraintsToValidators } from './validators';

// TODO: clean up docs if necessary

/* eslint-disable import/prefer-default-export */

/**
 * @example <caption>Basic</caption>
 * ```javascript
 *  const validator = useConstraints({
 *      firstName: { required: true, minLength: 5, maxLength: 6 },
 *      lastName: { required: true, maxLength: 100 },
 *      age: { type: "number", min: 18, max: 99 },
 *      location: { required: true, pattern: /(europe|africa)/},
 *      email: { required: true, type: "email" },
 *      website: { required: true, type: "url" }
 *  });
 *  // note that empty string means the value is valid.
 *  validator.firstName("Johny") === "";
 * ```
 * @example <caption>Displaying custom messages on error.</caption>
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
 * @example <caption>Usage with {@link useForm}</caption>
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
 * @example <caption>Binding constraints to values.</caption>
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
 * @example <caption>Usage with {@link useForm}</caption>
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
