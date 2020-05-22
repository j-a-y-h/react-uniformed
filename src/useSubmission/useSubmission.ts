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
  validator?(): Promise<void> | void;
  /**
   * Determines if submission should be disabled. Generally,
   * you want to disable if there are errors.
   */
  readonly disabled?: boolean;
  reset?(event?: SyntheticEvent): void;
  setError?(name: string, error: string): void;
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
/* eslint-disable max-len */
/**
 * Handles the form submission. Runs validation before calling the `onSubmit` function
 * if a `validator` is passed in.  If no validator was passed in, then the `onSubmit` function
 * will be invoked if disabled is set to false.  The validator function must set
 * the `disabled` prop to true, if there are errors in the form.
 * Disabled will prevent this hook from calling the `onSubmit` function.
 *
 * Below is a flow diagram for this hook after `submit` is called:
 *```
 *                submit(Event)
 *                     |
 *   no - (validator is a function?) - yes
 *   |                                  |
 *   |                              validator()
 *   |__________________________________|
 *                    |
 *     no - (disabled is falsey?) - yes
 *                                   |
 *                              onSubmit(Event)
 *```
 *
 * @param param - the props the pass in
 * @param validator - the specified validator. If your validation logic is async,
 * then you should return a promise in your function otherwise this won't work as expected.
 * @param onSubmit - the specified onSubmit handler. If your onSubmit handler is async,
 * then you should return a promise in your function otherwise this won't work as expected.
 * @param reset - An optional method used to reset the state of the form after submission.
 * @param setError - An optional function that is passed to the specified onSubmit handler.
 *  When setError is called while submitting, the form will not call the specified reset function.
 * @param values - the specified values to use when submitting the form
 * @returns returns a handler for onSubmit events,
 *  a count of how many times submit was called, and the state of the submission progress.
 * See {@link useFunctionStats}
 * @example <caption>This example is if you are not using the useForm hook.<br>_Note: the {@link useForm} hook handles all of this._</caption>
 *```javascript
 *  // create the submission handler
 *  const { isSubmitting, submit, submitCount } = useSubmission({
 *    disabled: hasErrors,
 *    onSubmit(values) { alert(values) },
 *  });
 *
 *  return (
 *    <form onSubmit={submit}>
 *      You have attempted to submit this form {submitCount} times.
 *      {isSubmitting && "Please wait as we submit your form"}
 *      <button disabled={isSubmitting}>Submit</button>
 *    </form>
 *  )
 *```
 * @example <caption>Setting feedback on submit</caption>
 * ```javascript
 * const { submitFeedback } = useSubmission({
 *   onSubmit(values, {setFeedback}) {
 *      const data = await fetch('http://api.example.com', { body: values, method: 'POST' })
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
 * @example <caption>Validation errors from the server</caption>
 * ```javascript
 * const { submitFeedback } = useSubmission({
 *   onSubmit(values, {setError}) {
 *      const data = await fetch('http://api.example.com', { body: values, method: 'POST' })
 *        .then(res => res.json());
 *
 *      if (data.errors) {
 *        data.errors.forEach(({error, fieldName}) => {
 *          // update the form with errors from the server.
 *          // note that this hook will not call reset if setError is called.
 *          setError(fieldName, error);
 *        });
 *      }
 *   }
 * });
 * ```
 *//* eslint-enable max-len */
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
