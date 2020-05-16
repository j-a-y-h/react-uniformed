import {
  useCallback, SyntheticEvent, useState, useEffect, useMemo, useReducer, Reducer,
} from 'react';
import { useInvokeCount, useInvoking } from './useFunctionUtils';
import { ErrorHandler } from './useErrors';
import { Fields } from './useFields';

type onSubmitModifiers = Readonly<{
  setError: ErrorHandler<string>;
  setFeedback: (feedback: string) => void;
}>;

export interface SubmissionHandler {
  (values: Fields, api: onSubmitModifiers): void | never | Promise<void | never>;
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
  reset?: () => void;
  setError?: (name: string, error: string) => void;
  values?: Fields;
}

export interface UseSubmissionHook {
  readonly isSubmitting: boolean;
  readonly submitCount: number;
  readonly submit: SubmitHandler;
  readonly submitFeedback: SubmitFeedback;
}

enum ActionTypes { error, feedback, reset }
interface Action {
  readonly type: ActionTypes;
  readonly payload?: string;
}
export type SubmitFeedback = Readonly<{
  error?: string;
  message?: string;
}>;


function reducer(_: SubmitFeedback, action: Action): SubmitFeedback {
  switch (action.type) {
  case ActionTypes.error:
    return {
      error: action.payload,
    };
  case ActionTypes.feedback:
    return {
      message: action.payload,
    };
  case ActionTypes.reset:
  default:
    return {};
  }
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
  reset,
  setError,
  values = {},
}: UseSubmissionProps): UseSubmissionHook {
  const [submitFeedback, dispatch] = useReducer<Reducer<SubmitFeedback, Action>>(reducer, {});
  // create a submit handler
  const handleSubmit = useCallback(async (): Promise<void> => {
    // note: give the handler every value so that we don't have to worry about
    // it later
    let shouldReset = true;
    const wrappedSetError = (name: string, error: string): void => {
      shouldReset = false;
      if (setError) {
        setError(name, error);
      }
      dispatch({ type: ActionTypes.reset });
    };
    try {
      const setFeedback = (feedback: string): void => {
        dispatch({
          payload: feedback,
          type: ActionTypes.feedback,
        });
      };
      await onSubmit(values, { setError: wrappedSetError, setFeedback });
      if (shouldReset && reset) {
        reset();
      }
    } catch (e) {
      dispatch({
        payload: String(e),
        type: ActionTypes.error,
      });
    }
  }, [onSubmit, values, reset, setError]);
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  // track submission count
  const [submitWithInvokeCount, submitCount] = useInvokeCount(handleSubmit);
  const [submitWithInvokingTracker, isSubmitting] = useInvoking(submitWithInvokeCount);
  const validationFnc = useMemo(() => validator || ((): void => undefined), [validator]);
  const [validate, isValidating] = useInvoking(validationFnc);

  // track when to kick off submission
  useEffect(() => {
    if (isReadyToSubmit && !isValidating) {
      setIsReadyToSubmit(false);
      if (!disabled) {
        submitWithInvokingTracker();
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
    validate();
    setIsReadyToSubmit(true);
  }, [setIsReadyToSubmit, validate]);
  return {
    isSubmitting, submitCount, submit, submitFeedback,
  };
}
