import {
  useCallback, SyntheticEvent, useState, useEffect, useMemo, useReducer, Reducer, useRef,
} from 'react';
import { useFunctionStats } from './useFunctionStats';
import { ErrorHandler } from './useErrors';
import { Fields } from './useFields';

type onSubmitModifiers = Readonly<{
  setError: ErrorHandler<string>;
  setFeedback: (feedback: string) => void;
  event?: SyntheticEvent;
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
  reset,
  setError,
  values = {},
}: UseSubmissionProps): UseSubmissionHook {
  const [submitFeedback, dispatch] = useReducer<Reducer<SubmitFeedback, Action>>(reducer, {});
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  const submitEvent = useRef<SyntheticEvent | undefined>();
  const validationFnc = useMemo(() => validator || ((): void => undefined), [validator]);
  const {
    fnc: validate,
    isRunning: isValidating,
  } = useFunctionStats(validationFnc);
  // create a submit handler
  const handleSubmit = useCallback(async (event?: SyntheticEvent): Promise<void> => {
    submitEvent.current = undefined;
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
      await onSubmit(values, { setError: wrappedSetError, setFeedback, event });
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
  // track submission count
  const {
    fnc: wrappedOnSubmit,
    invokeCount: submitCount,
    isRunning: isSubmitting,
  } = useFunctionStats<SyntheticEvent | undefined, void>(handleSubmit);

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
      event.persist();
      submitEvent.current = event;
    }
    setIsReadyToSubmit(true);
    if (validator) {
      validate();
    }
  }, [validator, validate, setIsReadyToSubmit]);
  return {
    isSubmitting, submitCount, submit, submitFeedback,
  };
}
