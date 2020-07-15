import { useCallback, useMemo, SyntheticEvent, useState } from 'react';
import { Errors, ErrorHandler, validErrorValues } from './useErrors';
import { useHandlers } from './useHandlers';
import { useFields, FieldValue, Fields, NormalizerHandler } from './useFields';
import { useTouch, Touches, TouchHandler, TouchFieldHandler } from './useTouch';
import { useSubmission } from './useSubmission';
import { SubmitHandler, SubmitFeedback, SubmissionHandler } from './useSubmission/types';
import { useValidation } from './useValidation';
import {
  Validators,
  ValidateHandler,
  ValidateAllHandler,
  SingleValidator,
} from './useValidation/types';
import {
  SetValueCallback,
  MutableValues,
  PartialValues,
  isMapWithValues,
} from './useGenericValues';
import { ConstraintValidators, SyncedConstraint } from './useConstraints/types';
import { useConstraints } from './useConstraints';
import { resetForm, safePromise } from './utils';

// TODO: document the UseFormsHook

export interface UseFormsHook {
  readonly errors: Errors | PartialValues<Errors, validErrorValues>;
  readonly hasErrors: boolean;
  readonly isDirty: boolean;
  readonly isSubmitting: boolean;
  readonly reset: (event?: SyntheticEvent) => void;
  readonly setError: ErrorHandler;
  readonly setTouch: TouchHandler;
  readonly setValue: SetValueCallback<FieldValue>;
  readonly submit: SubmitHandler;
  readonly submitCount: number;
  readonly submitFeedback: SubmitFeedback;
  readonly touches: Touches;
  readonly touchField: TouchFieldHandler;
  readonly validate: ValidateAllHandler<FieldValue>;
  readonly validateByName: ValidateHandler<FieldValue>;
  readonly values: Fields;
}

type UseFormParameters = Readonly<{
  constraints?: ConstraintValidators | SyncedConstraint;
  initialValues?: Fields;
  normalizer?: NormalizerHandler;
  onSubmit: SubmissionHandler;
  validators?: Validators | SingleValidator<FieldValue>;
}>;

/**
 * A hook that allows you to declaratively manage a form.<br>
 *
 * See {@link useTouch}<br/>
 * See {@link useFields}<br/>
 * See {@link useValidation}<br/>
 * See {@link useSubmission}<br/>
 * See {@link useConstraints} <br/>
 * See {@link useValidateAsSetter}<br/>
 * See {@link useSettersAsEventHandler}<br/>
 * See {@link useSettersAsRefEventHandler}
 *
 * @param onSubmit - passed directly to {@link useSubmission}.
 * @param initialValues - passed as the first argument to {@link useFields}.
 * @param normalizer - passed as the second argument to {@link useFields}.
 * See {@link useNormalizers} for more details.
 * @param validators - passed directly to {@link useValidation}.
 * @param constraints - Passed directly to {@link useConstraints}. Note that you can
 * only use one validator at a time. For instance, if you pass in a value to `validators`,
 * then the `constraints` prop will be ignored in favor of `validators`.
 * @returns the APIs used to manage the state of a function.
 * @example <caption>Basic example</caption>
 *```javascript
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
 * @example <caption>Using `validate` in change events</caption>
 * ```javascript
 * const { submit, setValue, validate, values } = useForm({
 *   onSubmit: data => alert(JSON.stringify(data))
 * });
 * // Warning: validating all inputs on change could lead to performance issues,
 * // especially if you have a big form or complex validation logic.
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
 * @example <caption>Setting feedback on submit, see {@link useSubmission}</caption>
 * @example <caption>Validation errors from the server, see {@link useSubmission}</caption>
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
  const { touches, resetTouches, setTouch, touchField, setTouches, isDirty } = useTouch();
  // picks between constraints or validators
  const validatorsInput = useMemo(
    () =>
      typeof validators === 'function' || isMapWithValues(validators)
        ? validators
        : constraintsHook,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  // I want to decouple validator from use form
  const { validate, validateByName, errors, resetErrors, setError, hasErrors } = useValidation(
    validatorsInput,
  );
  const [isFormDirty, setIsFormDirty] = useState(false);
  // create a submission validator handler
  const submissionValidator = useCallback(async (): Promise<void> => {
    const newTouches = Object.keys(values).reduce(
      (_touches: MutableValues<boolean>, name): Touches => {
        // eslint-disable-next-line no-param-reassign
        _touches[name] = true;
        return _touches;
      },
      {},
    );
    await validate(values);
    setIsFormDirty(true);
    setTouches(newTouches);
  }, [validate, values, setTouches]);
  // note: useSubmission will skip validation if no function was passed.
  //  In order to take advantage of this, we must pass undefined if useForm
  //  was invoked with a validation function
  const validator = useMemo(
    (): undefined | (() => void) =>
      typeof validators === 'function' ||
      typeof constraints === 'function' ||
      isMapWithValues(validators) ||
      isMapWithValues(constraints)
        ? submissionValidator
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [submissionValidator],
  );

  // create reset handlers
  const reset = useHandlers(resetValues, resetErrors, resetTouches, resetForm);

  // use submission hook
  const { isSubmitting, submit, submitCount, submitFeedback } = useSubmission({
    onSubmit,
    validator,
    disabled: hasErrors || (!isFormDirty && Boolean(validator)),
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
