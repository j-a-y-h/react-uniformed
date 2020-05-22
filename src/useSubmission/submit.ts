import {
  useCallback, SyntheticEvent, useReducer, Reducer,
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
  onSubmit, values, reset, setError, resetSubmitEvent,
}) {
  // track the feedback value
  const [submitFeedback, dispatch] = useReducer<Reducer<SubmitFeedback, Action>>(reducer, {});

  // create a submit handler
  const submitCallback = useCallback(async (event?: SyntheticEvent): Promise<void> => {
    resetSubmitEvent();
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
  }, [onSubmit, values, reset, setError, resetSubmitEvent]);

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
