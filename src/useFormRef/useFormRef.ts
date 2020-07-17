import { Ref } from 'react';
import { ReactOrNativeEventListener } from '../useSettersAsEventHandler';
import { useFormInputsRef } from './useFormInputsRef';
import { useHandlers } from '../useHandlers';
import { useRefEventHandlers } from '../useRefEventHandlers';

// TODO: support mounting values
type Props = Readonly<{
  handleChange?: ReactOrNativeEventListener;
  handleBlur?: ReactOrNativeEventListener;
  submit?: ReactOrNativeEventListener;
  reset?: ReactOrNativeEventListener;
}>;

interface UseFormRef {
  readonly ref: Ref<HTMLFormElement>;
}
// TODO: evaluate useSettersAsEventRef since this basically covers that
// TODO: update readme and make this the quick start and the other way not
export function useFormRef({ handleChange, handleBlur, submit, reset }: Props): UseFormRef {
  const setupInputsRef = useFormInputsRef({ handleBlur, handleChange });
  const submitRef = useRefEventHandlers({ handlers: submit, event: 'submit' });
  const resetRef = useRefEventHandlers({ handlers: reset, event: 'reset' });
  const ref = useHandlers(setupInputsRef, submitRef, resetRef);
  return { ref };
}
