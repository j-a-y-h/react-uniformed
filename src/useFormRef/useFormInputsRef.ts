import { useCallback, useRef } from 'react';
import { ReactOrNativeEventListener } from '../useSettersAsEventHandler';
import { mountEventHandler } from '../utils';
import { UseSubAnchor } from './types';
import { useRefEventHandlers } from '../useRefEventHandlers';
import { useHandlers } from '../useHandlers';

type Props = Readonly<{
  handleChange?: ReactOrNativeEventListener;
  handleBlur?: ReactOrNativeEventListener;
}>;

type ValidFormElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

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
export function useFormInputsRef({ handleBlur, handleChange }: Props): UseSubAnchor {
  const onChange = useRefEventHandlers({ handlers: [handleChange], event: 'change' });
  const onBlur = useRefEventHandlers({ handlers: [handleBlur], event: 'blur' });
  // const mountedRefValues = useMountedRefValues<HTMLInputElement>(mountedValues) as RefCallback<T>;
  const ref = useHandlers(onChange, onBlur);
  return useCallback(
    (form) => {
      //  mounts
      if (form) {
        // filter for input, select, and textarea elements only
        const validElements = Array.from(form.elements).filter((element) => {
          return (
            element instanceof HTMLInputElement ||
            element instanceof HTMLSelectElement ||
            element instanceof HTMLTextAreaElement
          );
        }) as ValidFormElements[];
        // add event handlers
        validElements.forEach((element) => ref(element));
      } else {
        // unmount
        ref(null);
      }
    },
    [ref],
  );
}
