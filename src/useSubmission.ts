import {
  useCallback, SyntheticEvent, useState, useEffect, useMemo, useRef,
} from 'react';
import { useFunctionStats } from './useFunctionStats';

export interface SubmissionHandler {
  (event?: Event): void | Promise<void>;
}
export interface SubmitHandler {
  (event?: SyntheticEvent): void;
}
export interface UseSubmissionProps {
  readonly onSubmit: SubmissionHandler;
  readonly validator?: () => Promise<void> | void;
  /**
   * Determines if submission should be disabled. Generally,
   * you want to disable if there are errors.
   */
  readonly disabled?: boolean;
}

export interface UseSubmissionHook {
  readonly isSubmitting: boolean;
  readonly submitCount: number;
  readonly submit: SubmitHandler;
}

/**
 * Handles the form submission. Runs validation before calling the `onSubmit` function
 * if a validator was passed in.  If no validator was passed in, then the `onSubmit` function
 * will be invoked.  The validator function must set the state on disabled to true, if there
 * were errors. Disabled will prevent this hook from calling the `onSubmit` function.
 *
 * Below is a flow diagram for this hook
 *```
 *                submit(Event)
 *                     |
 *   (no) - (validator is a function?) - (yes)
 *    |                                    |
 *  onSubmit(Event)                   validator()
 *                                         |
 *                       (no) - (disabled set to `false`?) - (yes)
 *                                                             |
 *                                                        onSubmit(Event)
 *```
 *
 * @param param the props the pass in
 * @param param.validator the specified validator. If your validation logic is async,
 * then you should return a promise in your function otherwise this won't work as expected.
 * @param param.onSubmit the specified onSubmit handler. If your onSubmit handler is async,
 * then you should return a promise in your function otherwise this won't work as expected.
 * @return {{isSubmitting: boolean, submitCount: number, submit: Function}} returns a
 * handler for onSubmit events, a count of how many times submit was called, and the
 * state of the submission progress.
 * @see {@link useFunctionStats}
 * @example
 *
 *   // this example is if you are not using the useForm hook. Note: the useForm hook
 *   // handles all of this.
 *
 *   const {values} = useFields();
 *   // bind a onSubmit handler with the current form values
 *   const onSubmit = useCallback(() => {
 *     console.log(values);
 *   }, [values]);
 *   // bind the validator with the values
 *   const validator = useCallback(() => {
 *     return {}; // this is saying there are no errors
 *   }, [values]);
 *   // create the submission handler
 *   const { isSubmitting, submit, submitCount } = useSubmission({
 *     onSubmit, validator
 *   });
 */
export function useSubmission({
  onSubmit,
  validator,
  disabled = false,
}: UseSubmissionProps): UseSubmissionHook {
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  // track submission count
  const {
    fnc: wrappedOnSubmit,
    invokeCount: submitCount,
    isRunning: isSubmitting,
  } = useFunctionStats<Event | undefined, void>(onSubmit);
  const validationFnc = useMemo(() => validator || ((): void => undefined), [validator]);
  const {
    fnc: validate,
    isRunning: isValidating,
  } = useFunctionStats(validationFnc);
  const submitEvent = useRef<Event | undefined>();

  // track when to kick off submission
  useEffect(() => {
    if (isReadyToSubmit && !isValidating) {
      setIsReadyToSubmit(false);
      if (!disabled) {
        wrappedOnSubmit(submitEvent.current);
      }
    }
  }, [
    disabled,
    wrappedOnSubmit,
    isReadyToSubmit,
    isValidating,
  ]);
  const submit = useCallback((event?: SyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsReadyToSubmit(true);
    if (validator) {
      validate();
    }
  }, [validator, validate, setIsReadyToSubmit]);
  return { isSubmitting, submitCount, submit };
}
