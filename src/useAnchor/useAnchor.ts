import { Ref, useCallback, useRef } from 'react';
import { Fields } from '../useFields';
import { ReactOrNativeEventListener } from '../useSettersAsEventHandler';
import { mountEventHandler } from '../utils';

type Props = Readonly<{
  values?: Fields;
  handleChange?: ReactOrNativeEventListener;
  handleBlur?: ReactOrNativeEventListener;
  handleSubmit?: ReactOrNativeEventListener;
}>;

type ValidFormElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

interface UseAnchor {
  anchor: Ref<HTMLFormElement>;
}

function mountInputs(
  { elements }: HTMLFormElement,
  handleChange?: ReactOrNativeEventListener,
  handleBlur?: ReactOrNativeEventListener,
): void {
  // filter for input, select, and textarea elements only
  const validElements = Array.from(elements).filter((element) => {
    return (
      element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement
    );
  });
  // add event handlers
  validElements.forEach((input) => {
    const handlers: [string, ReactOrNativeEventListener | undefined][] = [
      ['change', handleChange],
      ['blur', handleBlur],
    ];
    // add each event handler
    handlers.forEach(([event, eventHandler]) => {
      if (eventHandler) {
        mountEventHandler({
          input: (input as unknown) as ValidFormElements,
          event,
          eventHandler,
        });
      }
    });
  });
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
  const anchor = useCallback(
    (form: HTMLFormElement | null): void => {
      if (form) {
        mountInputs(form, handleChange, handleBlur);
        mountForm(form, handleSubmit);
      } else if (lastForm.current?.handleSubmit) {
        lastForm.current?.form?.removeEventListener('submit', lastForm.current.handleSubmit);
      }
      lastForm.current = { form, handleSubmit };
    },
    [handleChange, handleBlur, handleSubmit],
  );
  return { anchor };
}
