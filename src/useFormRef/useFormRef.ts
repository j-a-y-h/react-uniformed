import { Ref } from 'react';
import { ReactOrNativeEventListener } from '../useSettersAsEventHandler';
import { useAnchorInputs } from './useFormInputsRef';
import { useFormAnchor } from './useFormAnchor';
import { useHandlers } from '../useHandlers';
import { useSettersAsRefEventHandler } from '../useSettersAsRefEventHandler';

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
export function useAnchor({
  handleChange,
  handleBlur,
  handleSubmit,
  handleReset,
}: Props): UseAnchor {
  const handleInputs = useAnchorInputs({ handleBlur, handleChange });
  // TODO: make a useRefEventHandler hook for this, formsRef, inputsRet and useSettersAsRefEventHandler
  const handleFormSubmit = useFormAnchor({ handler: handleSubmit, type: 'submit' });
  const handleFormReset = useFormAnchor({ handler: handleReset, type: 'reset' });
  const anchor = useHandlers(handleInputs, handleFormSubmit, handleFormReset);
  return { anchor };
}
