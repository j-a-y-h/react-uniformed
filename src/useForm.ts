import { useCallback, useMemo } from 'react';
import { Errors, ErrorHandler } from './useErrors';
import { useHandlers } from './useHandlers';
import {
  useFields, FieldValue, Fields, NormalizerHandler,
} from './useFields';
import {
  useTouch, Touches, TouchHandler, TouchFieldHandler,
} from './useTouch';
import { useSubmission, SubmissionHandler, SubmitHandler } from './useSubmission';
import {
  useValidation,
  Validators,
  ValidateHandler,
  ValidateAllHandler,
  SingleValidator,
} from './useValidation';
import {
  SetValueCallback, MutableValues, PartialValues, hasValue,
} from './useGenericValues';
import { ConstraintValidators, SyncedConstraint, useConstraints } from './useConstraints';

export type UseFormsHook = Readonly<{
  errors: Errors | PartialValues<Validators, Error>;
  hasErrors: boolean;
  isSubmitting: boolean;
  values: Fields;
  setError: ErrorHandler;
  setTouch: TouchHandler;
  touchField: TouchFieldHandler;
  setValue: SetValueCallback<FieldValue>;
  submitCount: number;
  submit: SubmitHandler;
  touches: Touches;
  validateByName: ValidateHandler<FieldValue>;
  validate: ValidateAllHandler<FieldValue>;
  reset: () => void;
}>
type UseFormParameters = Readonly<{
  normalizer?: NormalizerHandler;
  constraints?: ConstraintValidators | SyncedConstraint;
  initialValues?: Fields;
  validators?: Validators | SingleValidator<FieldValue>;
  onSubmit: (values: Fields) => void | Promise<void>;
}>;

// useHandlers(validateAll, onSubmit)
export function useForm({
  onSubmit,
  initialValues,
  normalizer,
  validators = {},
  constraints = {},
}: UseFormParameters): UseFormsHook {
  const { values, setValue, resetValues } = useFields(initialValues, normalizer);
  const constraintsHook = useConstraints(constraints);
  const {
    touches, resetTouches, setTouch, touchField, setTouches,
  } = useTouch();
    // picks between constraints or validators
  const validatorsInput = useMemo(() => (typeof validators === 'function' || hasValue(validators)
    ? validators
    : constraintsHook
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);
    // I want to decouple validator from use form
  const {
    validate, validateByName, errors, resetErrors, setError, hasErrors,
  } = useValidation(validatorsInput);
  // create a submission validator handler
  const submissionValidator = useCallback(async (): Promise<Errors> => {
    const validationErrors = await validate(values);
    const newTouches = Object.keys(validationErrors).reduce((
      _touches: MutableValues<boolean>, name,
    ): Touches => {
      // eslint-disable-next-line no-param-reassign
      _touches[name] = true;
      return _touches;
    }, {});
    setTouches(newTouches);
    return validationErrors;
  }, [validate, values, setTouches]);
  // create reset handlers
  const reset = useHandlers(resetValues, resetErrors, resetTouches);
  // create a submit handler
  const handleSubmit: SubmissionHandler = useCallback(async (): Promise<void> => {
    // note: give the handler every value so that we don't have to worry about
    // it later
    await onSubmit(values);
    reset();
  }, [onSubmit, values, reset]);
  // use submission hook
  const { isSubmitting, submit, submitCount } = useSubmission({
    onSubmit: handleSubmit,
    validator: submissionValidator,
  });
  return {
    values,
    touches,
    errors,
    hasErrors,
    touchField,
    setTouch,
    setError,
    setValue,
    reset,
    validateByName,
    // TODO: fix compatability with useSettersAsEventHandlers
    // (validate is always one render behind)
    validate,
    isSubmitting,
    submit,
    submitCount,
  };
}
