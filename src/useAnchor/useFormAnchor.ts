import { useCallback, useRef } from 'react';
import { ReactOrNativeEventListener } from '../useSettersAsEventHandler';
import { mountEventHandler } from '../utils';

type Props = Readonly<{
  handleSubmit?: ReactOrNativeEventListener;
}>;

type CallbackProps = Readonly<{
  form: HTMLFormElement | null;
}>;

interface UseFormAnchorInputs {
  (props: CallbackProps): void;
}

function mountForm(form: HTMLFormElement, handleSubmit?: ReactOrNativeEventListener): void {
  if (handleSubmit) {
    mountEventHandler({ input: form, event: 'submit', eventHandler: handleSubmit });
  }
}

export function useFormAnchor({ handleSubmit }: Props): UseFormAnchorInputs {
  type FormEventState = {
    form: HTMLFormElement | null;
    handleSubmit?: ReactOrNativeEventListener;
  };
  const lastForm = useRef<FormEventState>();
  return useCallback(
    ({ form }) => {
      if (form) {
        mountForm(form, handleSubmit);
      } else if (lastForm.current?.handleSubmit) {
        lastForm.current?.form?.removeEventListener('submit', lastForm.current.handleSubmit);
      }
      lastForm.current = { form, handleSubmit };
    },
    [handleSubmit],
  );
}
