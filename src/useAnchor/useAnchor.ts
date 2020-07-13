import { Ref } from 'react';
import { ReactOrNativeEventListener } from '../useSettersAsEventHandler';
import { useAnchorInputs } from './useAnchorInputs';
import { useFormAnchor } from './useFormAnchor';
import { useHandlers } from '../useHandlers';

type Props = Readonly<{
  handleChange?: ReactOrNativeEventListener;
  handleBlur?: ReactOrNativeEventListener;
  handleSubmit?: ReactOrNativeEventListener;
  handleReset?: ReactOrNativeEventListener;
}>;

interface UseAnchor {
  readonly anchor: Ref<HTMLFormElement>;
}

export function useAnchor({
  handleChange,
  handleBlur,
  handleSubmit,
  handleReset,
}: Props): UseAnchor {
  const handleInputs = useAnchorInputs({ handleBlur, handleChange });
  const handleFormSubmit = useFormAnchor({ handler: handleSubmit, type: 'submit' });
  const handleFormReset = useFormAnchor({ handler: handleReset, type: 'reset' });
  const anchor = useHandlers(handleInputs, handleFormSubmit, handleFormReset);
  return { anchor };
}
