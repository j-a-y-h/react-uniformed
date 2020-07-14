import { Ref } from 'react';
import { ReactOrNativeEventListener } from '../useSettersAsEventHandler';
import { useAnchorInputs } from './useFormInputsRef';
import { useHandlers } from '../useHandlers';
import { useRefEventHandlers } from '../useRefEventHandlers';

type Props = Readonly<{
  handleChange?: ReactOrNativeEventListener;
  handleBlur?: ReactOrNativeEventListener;
  handleSubmit?: ReactOrNativeEventListener;
  handleReset?: ReactOrNativeEventListener;
}>;

interface UseAnchor {
  readonly anchor: Ref<HTMLFormElement>;
}
// TODO: change name to useFormRef, ref, useFormInputRefs, useFormRefHandler
// TODO: use closets to find form
export function useFormRef({
  handleChange,
  handleBlur,
  handleSubmit,
  handleReset,
}: Props): UseAnchor {
  const handleInputs = useAnchorInputs({ handleBlur, handleChange });
  // TODO: make a useRefEventHandler hook for this, formsRef, inputsRet and useSettersAsRefEventHandler
  const handleFormSubmit = useRefEventHandlers({ handlers: [handleSubmit], event: 'submit' });
  const handleFormReset = useRefEventHandlers({ handlers: [handleReset], event: 'reset' });
  const anchor = useHandlers(handleInputs, handleFormSubmit, handleFormReset);
  return { anchor };
}
