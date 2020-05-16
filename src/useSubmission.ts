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
  readonly reset?: (event?: SyntheticEvent) => void;
  readonly setError?: (name: string, error: string) => void;
  readonly values?: Fields;
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
 * @param param.reset An optional method used to reset the state of the form after submission.
 * @param param.setError An optional function that is passed to the specified onSubmit handler.
 *  When setError is called while submitting, the form will not call the specified reset function.
 * @param param.values the specified values to use when submitting the form
 * @return {UseSubmissionHook} returns a handler for onSubmit events,
 *  a count of how many times submit was called, and the state of the submission progress.
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
 *
 * @example
 * // Setting feedback on submit
 *
 * const { submitFeedback } = useSubmission({
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
 *
 * @example
 * // Validation errors from the server
 *
 * const { submitFeedback } = useSubmission({
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
 */
export function useSubmission({
  onSubmit,
  validator,
  disabled = false,
  reset,
  setError,
  values = {},
}: UseSubmissionProps): UseSubmissionHook {
  // track the feedback value
  const [submitFeedback, dispatch] = useReducer<Reducer<SubmitFeedback, Action>>(reducer, {});
  // track when we need to starting submitting
  // note that validator doesn't return a value stating if the validation fails, instead the
  // state of the form is updated with the new errors. Because of these mechanics, we need
  // to track the state of errors using disabled prop and this isReadyToSubmit value
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  // track the submitEvent in a ref
  const submitEvent = useRef<SyntheticEvent | undefined>();
  // memoize the validator function
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
    // create a setError callback function
    const wrappedSetError = (name: string, error: string): void => {
      shouldReset = false;
      if (setError) {
        setError(name, error);
      }
      dispatch({ type: ActionTypes.reset });
    };
    try {
      // create a setFeedback handler
      const setFeedback = (feedback: string): void => {
        dispatch({
          payload: feedback,
          type: ActionTypes.feedback,
        });
      };
      // wait for the submit handler to return
      await onSubmit(values, { setError: wrappedSetError, setFeedback, event });
      if (shouldReset && reset) {
        // reset the form
        reset(event);
      }
    } catch (e) {
      // error occured, set the submitFeedback.error value
      dispatch({
        payload: String(e || 'Error occurred'),
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

  // The submit callback that is used in the form
  const submit = useCallback((event?: SyntheticEvent) => {
    if (event) {
      event.preventDefault?.();
      event.persist?.();
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
