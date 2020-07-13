import { useCallback, useRef } from 'react';
import { ReactOrNativeEventListener } from '../useSettersAsEventHandler';
import { mountEventHandler } from '../utils';

type Props = Readonly<{
  handler?: ReactOrNativeEventListener;
  type: 'submit' | 'reset';
}>;

type CallbackProps = Readonly<{
  form: HTMLFormElement | null;
}>;

interface UseFormAnchorInputs {
  (props: CallbackProps): void;
}

type FormEventState = Readonly<{
  form: HTMLFormElement | null;
  handler?: ReactOrNativeEventListener;
}>;

function mountForm(
  form: HTMLFormElement,
  event: string,
  handler?: ReactOrNativeEventListener,
): void {
  if (handler) {
    mountEventHandler({ input: form, event, eventHandler: handler });
  }
}

export function useFormAnchor({ handler, type }: Props): UseFormAnchorInputs {
  const lastForm = useRef<FormEventState>();
  return useCallback(
    ({ form }) => {
      if (form) {
        mountForm(form, type, handler);
      } else if (lastForm.current?.handler) {
        lastForm.current?.form?.removeEventListener(type, lastForm.current.handler);
      }
      lastForm.current = { form, handler };
    },
    [handler, type],
  );
}
