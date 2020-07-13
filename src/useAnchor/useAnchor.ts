import { Ref, useCallback } from 'react';
import { Fields } from '../useFields';
import { ReactOrNativeEventListener } from '../useSettersAsEventHandler';
import { useAnchorInputs } from './useAnchorInputs';
import { useFormAnchor } from './useFormAnchor';

type Props = Readonly<{
  values?: Fields;
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
  const manageInputs = useAnchorInputs({ handleBlur, handleChange });
  const handleFormSubmit = useFormAnchor({ handler: handleSubmit, type: 'submit' });
  const handleFormReset = useFormAnchor({ handler: handleReset, type: 'reset' });
  const anchor = useCallback(
    (form: HTMLFormElement | null): void => {
      manageInputs({ form });
      handleFormSubmit({ form });
      handleFormReset({ form });
    },
    [handleFormSubmit, manageInputs, handleFormReset],
  );
  return { anchor };
}
