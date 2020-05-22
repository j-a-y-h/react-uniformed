import {
  useCallback, SyntheticEvent, useReducer, Reducer, useEffect, useState, useMemo,
} from 'react';
import { ActionTypes, SubmitFeedback, Action } from './types';
import { useFunctionStats } from '../useFunctionStats';

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

export function useHandleSubmit({
  onSubmit, values, reset, setError, setSubmitEvent,
}) {
  // track the feedback value
  const [submitFeedback, dispatch] = useReducer<Reducer<SubmitFeedback, Action>>(reducer, {});

  // create a submit handler
  const submitCallback = useCallback(async (event?: SyntheticEvent): Promise<void> => {
    setSubmitEvent(undefined);
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
  }, [onSubmit, values, reset, setError, setSubmitEvent]);

  // track submission count
  const {
    fnc: handleSubmit,
    invokeCount: submitCount,
    isRunning: isSubmitting,
  } = useFunctionStats<SyntheticEvent | undefined, void>(submitCallback);
  return {
    handleSubmit, submitCount, isSubmitting, submitFeedback,
  };
}

export function useSubmit({ validator, handleSubmit, submitEvent,    disabled,
  validator, setSubmitEvent,  }) {
  // track when we need to starting submitting
  // note that validator doesn't return a value stating if the validation fails, instead the
  // state of the form is updated with the new errors. Because of these mechanics, we need
  // to track the state of errors using disabled prop and this isReadyToSubmit value
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

  // memoize the validator function
  const validationFnc = useMemo(() => validator || ((): void => undefined), [validator]);

  const {
    fnc: validate,
    isRunning: isValidating,
  } = useFunctionStats(validationFnc);

  // track when to kick off submission
  useEffect(() => {
    if (isReadyToSubmit && !isValidating) {
      setIsReadyToSubmit(false);
      if (!disabled) {
        handleSubmit(submitEvent.current);
      }
    }
  }, [
    disabled,
    handleSubmit,
    isReadyToSubmit,
    isValidating,
  ]);

  // The submit callback that is used in the form
  return useCallback((event?: SyntheticEvent) => {
    if (event) {
      event.preventDefault?.();
      event.persist?.();
      setSubmitEvent(event);
    }
    setIsReadyToSubmit(true);
    if (validator) {
      validate();
    }
  }, [validator, validate, setIsReadyToSubmit, setSubmitEvent]);
}
