import {
  useCallback, SyntheticEvent, useState, useEffect, useMemo, useRef,
} from 'react';
import { useInvokeCount, useInvoking } from './useFunctionUtils';

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
 * Handles the form submission. Calls the specified validator and only
 * calls the onSubmit function if the validator returns error free.
 *
 * @param param the props the pass in
 * @param param.validator the specified validator. If your validation logic is async,
 * then you should return a promise in your function otherwise this won't work as expected.
 * @param param.onSubmit the specified onSubmit handler. If your onSubmit handler is async,
 * then you should return a promise in your function otherwise this won't work as expected.
 * @return {{isSubmitting: boolean, submitCount: number, submit: Function}} returns a
 * handler for onSubmit events, a count of how many times submit was called, and the
 * state of the submission progress.
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
  const [submitWithInvokeCount, submitCount] = useInvokeCount<Event | undefined, void>(onSubmit);
  const [submitWithInvokingTracker, isSubmitting] = useInvoking(submitWithInvokeCount);
  const validationFnc = useMemo(() => validator || ((): void => undefined), [validator]);
  const [validate, isValidating] = useInvoking(validationFnc);
  // A queue of events. Using a queue as there isn't a lock preventing
  // submit from being invoked multiple times
  const submitEvents = useRef<(Event | undefined)[]>([]);

  // track when to kick off submission
  useEffect(() => {
    if (isReadyToSubmit && !isValidating) {
      setIsReadyToSubmit(false);
      if (!disabled) {
        submitWithInvokingTracker(submitEvents.current.shift());
      }
    }
  }, [
    disabled,
    isValidating,
    isReadyToSubmit,
    setIsReadyToSubmit,
    submitWithInvokingTracker,
  ]);
  const submit = useCallback((event?: SyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    // always push something because
    submitEvents.current.push(event?.nativeEvent);
    validate();
    setIsReadyToSubmit(true);
  }, [setIsReadyToSubmit, validate]);
  return { isSubmitting, submitCount, submit };
}
