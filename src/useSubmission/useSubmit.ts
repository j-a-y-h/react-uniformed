import {
  useState, useMemo, useEffect, useCallback, SyntheticEvent,
} from 'react';
import { useFunctionStats } from '../useFunctionStats';

export function useSubmit({
  validator, handleSubmit, submitEvent, disabled,
  validator, setSubmitEvent,
}) {
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
  }, [disabled, handleSubmit, isReadyToSubmit, isValidating, submitEvent]);

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
