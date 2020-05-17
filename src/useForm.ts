import { useCallback, useMemo, SyntheticEvent } from 'react';
import { Errors, ErrorHandler, validErrorValues } from './useErrors';
import { useHandlers } from './useHandlers';
import {
  useFields, FieldValue, Fields, NormalizerHandler,
} from './useFields';
import {
  useTouch, Touches, TouchHandler, TouchFieldHandler,
} from './useTouch';
import {
  useSubmission, SubmitHandler, SubmitFeedback, SubmissionHandler,
} from './useSubmission';
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
import { resetForm } from './utils';

export type UseFormsHook = Readonly<{
  errors: Errors | PartialValues<Errors, validErrorValues>;
  hasErrors: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  reset: (event?: SyntheticEvent) => void;
  setError: ErrorHandler;
  setTouch: TouchHandler;
  setValue: SetValueCallback<FieldValue>;
  submit: SubmitHandler;
  submitCount: number;
  submitFeedback: SubmitFeedback;
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
  onSubmit: SubmissionHandler;
  validators?: Validators | SingleValidator<FieldValue>;
}>;

/**
 * A hook for managing form states.
 *
 * @param props - the props api
 * @param onSubmit -
 *  a callback function for form submissions
 * @param initialValues - the initial form values
 * @param normalizer -
 *  a handler that translates form values before setting values
 * @param validators -
 *  the validators used to validate values
 * @param constraints - the constraints api
 * @returns the APIs used to manage the state of a function.
 * See {@link useConstraints}
 * See {@link useValidation}
 * See {@link useSubmission}
 * See {@link useFields}
 * See {@link useSettersAsEventHandler}
 * See {@link useSettersAsRefEventHandler}
 * See {@link useValidateAsSetter}
 * @example
 *```
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
 *```
 * @example
 * ```
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
 *```
 * @example
 * ```
 * // Setting feedback on submit
 *
 * const { submitFeedback } = useForm({
 *   onSubmit(values, {setFeedback}) {
 *      const data = await fetch('http://api.example.com', { body: values })
 *        .then(res => res.json());
 *
 *      if (data) {
 *        // the submitFeedback.message value will be set for this case.
 *        setFeedback("Thank you for submitting!");
 *      } else {
 *        // if an error occurs then the submitFeedback.error value will be set
 *        throw "Something went wrong processing this form"
 *        // or when you return Promise.reject
 *        // return Promise.reject("Something went wrong processing this form");
 *      }
 *   }
 * });
 *
 * // if an error occurred
 * submitFeedback.error === "Something went wrong processing this form"
 * // or if the submission was successful
 * submitFeedback.message === "Thank you for submitting!";
 *```
 * @example
 * ```
 * // Validation errors from the server
 *
 * const { hasErrors } = useForm({
 *   onSubmit(values, {setError}) {
 *      const data = fetch('http://api.example.com', { body: values })
 *        .then(res => res.json())
 *        // throwing an error or rejecting a promise will set submissionError
 *        .catch(() => Promise.reject('Unexpected error'));
 *
 *      if (data.errors) {
 *        data.errors.forEach(({error, fieldName}) => {
 *          // update the form with errors from the server.
 *          // note that the form will not be reset if setError is called
 *          setError(fieldName, error);
 *        });
 *      }
 *   }
 * });
 *```
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
    touches, resetTouches, setTouch, touchField, setTouches, isDirty,
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
  ) ? submissionValidator : undefined), [submissionValidator]);

  // create reset handlers
  const reset = useHandlers(resetValues, resetErrors, resetTouches, resetForm);

  // use submission hook
  const {
    isSubmitting,
    submit,
    submitCount,
    submitFeedback,
  } = useSubmission({
    onSubmit,
    validator,
    disabled: hasErrors,
    setError,
    values,
    reset,
  });
  return {
    errors,
    hasErrors,
    isDirty,
    isSubmitting,
    reset,
    setError,
    setTouch,
    setValue,
    submit,
    submitCount,
    submitFeedback,
    touches,
    touchField,
    validate,
    validateByName,
    values,
  };
}
