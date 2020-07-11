import { Values } from '../useGenericValues';
import { Validator } from '../useValidation/types';
import { Fields } from '../useFields';

export type supportedTypes = 'email' | 'text' | 'url' | 'number' | 'date';
// possible values:
// "text" | "number" | "date" | "email" | "checkbox" |
// "tel" | "time" | "url" | "week" | "month" | "year" | "range";
export const supportedTypesSet = new Set<supportedTypes>([
  'text',
  'email',
  'url',
  'number',
  'date',
]);

export interface Constraints {
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
export type supportedConstraints = keyof Constraints;
export type constraintValues = boolean | number | RegExp | string | Date;
export type RequiredConstraint<T extends supportedConstraints> = {
  [P in T]-?: constraintValues;
};

export type ConstraintValidators = Values<Constraints | Validator>;

export interface SyncedConstraint {
  (values: Fields): ConstraintValidators;
}

export const defaultMessage = {
  required: 'There must be a value (if set).',
  maxLength: 'The number of characters is too long.',
  minLength: 'The number of characters is too short.',
  max: 'The value is too large.',
  min: 'The value is too small.',
  pattern: 'The value must match the pattern.',
  type: 'The value must match the type.',
};

export const supportedProperties: supportedConstraints[] = [
  'required',
  'type',
  'pattern',
  'maxLength',
  'minLength',
  'max',
  'min',
];
