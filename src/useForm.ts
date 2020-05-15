import { useCallback, useMemo } from 'react';
import { Errors, ErrorHandler, validErrorValues } from './useErrors';
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
  errors: Errors | PartialValues<Validators, validErrorValues>;
  hasErrors: boolean;
  isSubmitting: boolean;
  values: Fields;
  setError: ErrorHandler;
  setTouch: TouchHandler;
  touchField: TouchFieldHandler;
  setValue: SetValueCallback<FieldValue>;
  submitCount: number;
  submit: SubmitHandler;
  submissionError?: string;
  touches: Touches;
  validateByName: ValidateHandler<FieldValue>;
  validate: ValidateAllHandler<FieldValue>;
  reset: () => void;
}>

type onSubmitModifiers = Readonly<{
  setError: ErrorHandler<string>;
}>;

type UseFormParameters = Readonly<{
  normalizer?: NormalizerHandler;
  constraints?: ConstraintValidators | SyncedConstraint;
  initialValues?: Fields;
  validators?: Validators | SingleValidator<FieldValue>;
  onSubmit: (values: Fields, api: onSubmitModifiers) => void | never | Promise<void | never>;
}>;

const SUBMISSION_ERROR_KEY = '__useFormSubmissionError__';

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
 *
 * @example
 * // Validation errors from the server
 *
 * const { submit, setValue, validate, submissionError, values } = useForm({
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
 *
 * @example
 * // Errors trying to post form
 *
 * // submissionError is set when the onSubmit handler throws an error
 * const { submit, setValue, validate, submissionError, values } = useForm({
 *   onSubmit(values, {setError}) {
 *      const data = fetch('http://api.example.com', { body: values })
 *        .then(res => res.json())
 *        // throwing an error or rejecting a promise will set submissionError
 *        .catch(() => Promise.reject('Unexpected error'));
 *
 *      // If there are any errors after submission then this function must throw an error,
 *      // return Promise.reject(), or call setError in order to avoid the form resetting.
 *      // submissionError will be set to the value that was thrown.
 *      // In this example submissionError === 'submission failed'
 *      throw 'submission failed';
 *   }
 * });
 *
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
  const validatorsInput = useMemo(() => (typeof validators === 'function' || hasValue(validators)
    ? validators
    : constraintsHook
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);
    // I want to decouple validator from use form
  const {
    validate, validateByName, errors: rawErrors, resetErrors, setError, hasErrors,
  } = useValidation(validatorsInput);
  // extract the submission error and the reset of the errors
  const { [SUBMISSION_ERROR_KEY]: submissionError, ...errors } = rawErrors;
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

  // create reset handlers
  const reset = useHandlers(resetValues, resetErrors, resetTouches);
  // create a submit handler
  const handleSubmit: SubmissionHandler = useCallback(async (): Promise<void> => {
    // note: give the handler every value so that we don't have to worry about
    // it later
    try {
      let shouldReset = true;
      const wrappedSetError = (name: string, error: string): void => {
        shouldReset = false;
        setError(name, error);
      };
      await onSubmit(values, { setError: wrappedSetError });
      if (shouldReset) {
        reset();
      }
    } catch (e) {
      setError(SUBMISSION_ERROR_KEY, String(e));
    }
  }, [onSubmit, values, reset, setError]);
  // use submission hook
  const { isSubmitting, submit, submitCount } = useSubmission({
    onSubmit: handleSubmit,
    validator: submissionValidator,
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
    submissionError,
    touches,
    touchField,
    validate,
    validateByName,
    values,
  };
}
