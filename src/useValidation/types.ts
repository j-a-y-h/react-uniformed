import {
  validErrorValues, Errors, ErrorHandler, SetErrorsHandler,
} from '../useErrors';
import { Values, PartialValues } from '../useGenericValues';
import { FieldValue } from '../useFields';

export type validValidatorReturnTypes = validErrorValues | Promise<validErrorValues>;
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

export interface UseValidatorHook<T> {
  readonly errors: Errors;
  readonly hasErrors: boolean;
  readonly setError: ErrorHandler;
  readonly validateByName: ValidateHandler<T>;
  readonly validate: ValidateAllHandler<T>;
  readonly resetErrors: () => void;
}

export interface UseValidatorHookPartial<T, K> {
  readonly errors: PartialValues<K, validErrorValues>;
  readonly hasErrors: boolean;
  readonly setError: ErrorHandler<keyof K>;
  readonly validateByName: ValidateHandler<T, keyof K>;
  readonly validate: ValidateAllHandler<T, PartialValues<K, T>>;
  readonly resetErrors: () => void;
}

export interface UseValidateByName {
  setError: ErrorHandler;
  validator: Validators | SingleValidator<FieldValue>;
}

export interface UseValidate {
  setErrors: SetErrorsHandler;
  validator: Validators | SingleValidator<FieldValue>;
}
