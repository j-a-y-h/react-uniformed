import { Ref, useCallback, useRef } from 'react';
import { Fields } from '../useFields';
import { ReactOrNativeEventListener } from '../useSettersAsEventHandler';
import { mountEventHandler } from '../utils';
import { useAnchorInputs } from './useAnchorInputs';

type Props = Readonly<{
  values?: Fields;
  handleChange?: ReactOrNativeEventListener;
  handleBlur?: ReactOrNativeEventListener;
  handleSubmit?: ReactOrNativeEventListener;
}>;

interface UseAnchor {
  anchor: Ref<HTMLFormElement>;
}

function mountForm(form: HTMLFormElement, handleSubmit?: ReactOrNativeEventListener): void {
  if (handleSubmit) {
    mountEventHandler({ input: form, event: 'submit', eventHandler: handleSubmit });
  }
}

export function useAnchor({ handleChange, handleBlur, handleSubmit }: Props): UseAnchor {
  type FormEventState = {
    form: HTMLFormElement | null;
    handleSubmit?: ReactOrNativeEventListener;
  };
  const lastForm = useRef<FormEventState>();
  const manageInputs = useAnchorInputs({ handleBlur, handleChange });
  const anchor = useCallback(
    (form: HTMLFormElement | null): void => {
      manageInputs({ form });
      if (form) {
        mountForm(form, handleSubmit);
      } else if (lastForm.current?.handleSubmit) {
        lastForm.current?.form?.removeEventListener('submit', lastForm.current.handleSubmit);
      }
      lastForm.current = { form, handleSubmit };
    },
    [handleSubmit, manageInputs],
  );
  return { anchor };
}
