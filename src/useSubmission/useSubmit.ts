import { useState, useMemo, useEffect, useCallback, SyntheticEvent } from 'react';
import { useFunctionStats } from '../useFunctionStats';
import { UseSubmit, UseSubmitProps } from './types';

export function useSubmit({
  submitEvent,
  disabled,
  validator,
  handleSubmit,
  setSubmitEvent,
}: UseSubmitProps): UseSubmit {
  // track when we need to starting submitting
  // note that validator doesn't return a value stating if the validation fails, instead the
  // state of the form is updated with the new errors. Because of these mechanics, we need
  // to track the state of errors using disabled prop and this isReadyToSubmit value
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

  // memoize the validator function
  const validationFnc = useMemo(() => validator ?? ((): void => undefined), [validator]);

  const { fnc: validate, isRunning: isValidating } = useFunctionStats(validationFnc);

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
  return useCallback(
    async (event?: SyntheticEvent) => {
      if (event) {
        event.preventDefault?.();
        event.persist?.();
        setSubmitEvent(event);
      }
      setIsReadyToSubmit(true);
      if (validator) {
        await validate();
      }
    },
    [validator, validate, setIsReadyToSubmit, setSubmitEvent],
  );
}
