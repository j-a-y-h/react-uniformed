import { useState, useCallback, SyntheticEvent } from 'react';
import { hasValue } from './useGenericValues';
import { Errors } from './useErrors';
import { assert, LoggingTypes } from './utils';

export interface SubmissionHandler {
  (): void | Promise<void>;
}
export interface SubmitHandler {
  (event?: SyntheticEvent): void;
}
export interface UseSubmissionProps {
  readonly onSubmit: SubmissionHandler;
  readonly validator: () => Promise<Errors> | Errors;
}

export interface UseSubmissionHook {
  readonly isSubmitting: boolean;
  readonly submitCount: number;
  readonly submit: SubmitHandler;
}

// async handlers should return promises
export function useSubmission({ validator, onSubmit }: UseSubmissionProps): UseSubmissionHook {
  assert.error(
    typeof validator === 'function' && typeof onSubmit === 'function',
    LoggingTypes.typeError,
    `(expected: function, function, received: ${typeof validator}, ${typeof onSubmit}) ${useSubmission.name} expects the properties named validator and onSubmit to be functions.`,
  );
  const [isSubmitting, setSubmitting] = useState(false);
  // TODO: extract submit count to a util function
  //   that users can wrap their submit functions or submit function
  const [submitCount, setSubmitCount] = useState(0);
  const submit = useCallback(async (event?: SyntheticEvent): Promise<void> => {
    if (event) {
      event.preventDefault();
    }
    // TODO: extract isSubmitting to a util hook that users can wrap whenever
    //   they need it
    setSubmitting(true);
    const errors = await validator();
    if (!hasValue(errors)) {
      await onSubmit();
      setSubmitCount((currentCount): number => currentCount + 1);
    }
    setSubmitting(false);
  }, [validator, onSubmit]);
  return { isSubmitting, submitCount, submit };
}
