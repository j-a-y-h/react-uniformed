import { Ref } from 'react';
import { ReactOrNativeEventListener } from '../useSettersAsEventHandler';
import { useFormInputsRef } from './useFormInputsRef';
import { useHandlers } from '../useHandlers';
import { useRefEventHandlers } from '../useRefEventHandlers';

// TODO: support mounting values
type Props = Readonly<{
  handleChange?: ReactOrNativeEventListener;
  handleBlur?: ReactOrNativeEventListener;
  handleSubmit?: ReactOrNativeEventListener;
  handleReset?: ReactOrNativeEventListener;
}>;

interface UseAnchor {
  readonly ref: Ref<HTMLFormElement>;
}
// TODO: evaluate useSettersAsEventRef since this basically covers that
// TODO: update readme and make this the quick start and the other way not
// TODO: name chagne to just submit, reset
export function useFormRef({
  handleChange,
  handleBlur,
  handleSubmit,
  handleReset,
}: Props): UseAnchor {
  const setupInputsRef = useFormInputsRef({ handleBlur, handleChange });
  const submitRef = useRefEventHandlers({ handlers: handleSubmit, event: 'submit' });
  const resetRef = useRefEventHandlers({ handlers: handleReset, event: 'reset' });
  const ref = useHandlers(setupInputsRef, submitRef, resetRef);
  return { ref };
}
