import { Ref } from 'react';
import { ReactOrNativeEventListener } from '../useSettersAsEventHandler';
import { useFormInputsRef } from './useFormInputsRef';
import { useHandlers } from '../useHandlers';
import { useRefEventHandlers } from '../useRefEventHandlers';

type Props = Readonly<{
  handleChange?: ReactOrNativeEventListener;
  handleBlur?: ReactOrNativeEventListener;
  handleSubmit?: ReactOrNativeEventListener;
  handleReset?: ReactOrNativeEventListener;
}>;

interface UseAnchor {
  readonly ref: Ref<HTMLFormElement>;
}

// TODO: use closets to find form
export function useFormRef({
  handleChange,
  handleBlur,
  handleSubmit,
  handleReset,
}: Props): UseAnchor {
  const handleInputs = useFormInputsRef({ handleBlur, handleChange });
  const handleFormSubmit = useRefEventHandlers({ handlers: [handleSubmit], event: 'submit' });
  const handleFormReset = useRefEventHandlers({ handlers: [handleReset], event: 'reset' });
  const ref = useHandlers(handleInputs, handleFormSubmit, handleFormReset);
  return { ref };
}
