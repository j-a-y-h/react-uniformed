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
  SetValueCallback, MutableValues, PartialValues, isMapWithValues,
} from './useGenericValues';
import { ConstraintValidators, SyncedConstraint, useConstraints } from './useConstraints';

export type UseFormsHook = Readonly<{
  errors: Errors | PartialValues<Validators, Error>;
  hasErrors: boolean;
  isSubmitting: boolean;
  reset: () => void;
  setError: ErrorHandler;
  setTouch: TouchHandler;
  setValue: SetValueCallback<FieldValue>;
  submit: SubmitHandler;
  submitCount: number;
  touches: Touches;
  touchField: TouchFieldHandler;
  validate: ValidateAllHandler<FieldValue>;
  validateByName: ValidateHandler<FieldValue>;
  values: Fields;
}>
type UseFormParameters = Readonly<{
  constraints?: ConstraintValidators | SyncedConstraint;
  initialValues?: Fields;
  normalizer?: NormalizerHandler;
  onSubmit: (values: Fields, event?: Event) => void | Promise<void>;
  validators?: Validators | SingleValidator<FieldValue>;
}>;

/**
 * A hook for managing form states.
 *
 * @param {UseFormParameters} props the props api
 * @param {function(Fields): void | Promise<void>} props.onSubmit
 *  a callback function for form submissions
 * @param {Fields} props.initialValues the initial form values
 * @param {NormalizerHandler} props.normalizer
 *  a handler that translates form values before setting values
 * @param {Validators | SingleValidator<FieldValue>} props.validators
 *  the validators used to validate values
 * @param {ConstraintValidators | SyncedConstraint} props.constraints the constraints api
 * @return {UseFormsHook} the APIs used to manage the state of a function.
 * @see {@link useConstraints}
 * @see {@link useValidation}
 * @see {@link useSubmission}
 * @see {@link useFields}
 * @see {@link useSettersAsEventHandler}
 * @see {@link useSettersAsRefEventHandler}
 * @see {@link useValidateAsSetter}
 * @example
 *
 * const { submit, setValue, values } = useForm({
 *   onSubmit: data => alert(JSON.stringify(data))
 * });
 * const handleChange = useSettersAsEventHandler(setValue);
 *
 * // jsx
 * <form onSubmit={submit}>
 *    <input
 *       name="name"
 *       value={values.name}
 *       onChange={handleChange}
 *    />
 * </form>
 *
 * @example
 * // using validate in change events
 *
 * const { submit, setValue, validate, values } = useForm({
 *   onSubmit: data => alert(JSON.stringify(data))
 * });
 * // Although this will work, you should avoid validating all inputs on change b/c
 * // it may cost you in performance.
 * const validateAllOnChange = useValidateAsSetter(validate, values);
 * // this will set the value of inputs on change and validate all form inputs
 * const handleChange = useSettersAsEventHandler(setValue, validateAllOnChange);
 *
 * // jsx
 * <form onSubmit={submit}>
 *   <input
 *     name="name"
 *     value={values.name}
 *     onChange={handleChange}
 *   />
 * </form>
 */
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
  const validatorsInput = useMemo(() => (typeof validators === 'function' || isMapWithValues(validators)
    ? validators
    : constraintsHook
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);
    // I want to decouple validator from use form
  const {
    validate, validateByName, errors, resetErrors, setError, hasErrors,
  } = useValidation(validatorsInput);
  // create a submission validator handler
  const submissionValidator = useCallback((): void => {
    const newTouches = Object.keys(values).reduce((
      _touches: MutableValues<boolean>, name,
    ): Touches => {
      // eslint-disable-next-line no-param-reassign
      _touches[name] = true;
      return _touches;
    }, {});
    validate(values);
    setTouches(newTouches);
  }, [validate, values, setTouches]);
  // note: useSubmission will skip validation if no function was passed.
  //  In order to take advantage of this, we must pass undefined if useForm
  //  was invoked with a validation function
  const validator = useMemo((): undefined | (() => void) => ((
    typeof validators === 'function'
    || typeof constraints === 'function'
    || isMapWithValues(validators)
    || isMapWithValues(constraints)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ) ? submissionValidator : undefined), []);

  // create reset handlers
  const reset = useHandlers(resetValues, resetErrors, resetTouches);
  // create a submit handler
  const handleSubmit: SubmissionHandler = useCallback(async (event?: Event): Promise<void> => {
    // note: give the handler every value so that we don't have to worry about
    // it later
    await onSubmit(values, event);
    reset();
  }, [onSubmit, values, reset]);
  // use submission hook
  const { isSubmitting, submit, submitCount } = useSubmission({
    onSubmit: handleSubmit,
    validator,
    disabled: hasErrors,
  });
  return {
    errors,
    hasErrors,
    isSubmitting,
    reset,
    setError,
    setTouch,
    setValue,
    submit,
    submitCount,
    touches,
    touchField,
    validate,
    validateByName,
    values,
  };
}
