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
}>;

interface UseAnchor {
  readonly anchor: Ref<HTMLFormElement>;
}

export function useAnchor({ handleChange, handleBlur, handleSubmit }: Props): UseAnchor {
  const manageInputs = useAnchorInputs({ handleBlur, handleChange });
  const manageForm = useFormAnchor({ handleSubmit });
  const anchor = useCallback(
    (form: HTMLFormElement | null): void => {
      manageInputs({ form });
      manageForm({ form });
    },
    [manageForm, manageInputs],
  );
  return { anchor };
}
