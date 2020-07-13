import { useCallback, useRef } from 'react';
import { ReactOrNativeEventListener } from '../useSettersAsEventHandler';
import { mountEventHandler } from '../utils';
import { UseSubAnchor } from './types';

type Props = Readonly<{
  handler?: ReactOrNativeEventListener;
  type: 'submit' | 'reset';
}>;

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

export function useFormAnchor({ handler, type }: Props): UseSubAnchor {
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
