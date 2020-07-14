import { useCallback } from 'react';
import { ReactOrNativeEventListener } from '../useSettersAsEventHandler';
import { UseSubAnchor } from './types';
import { useRefEventHandlers } from '../useRefEventHandlers';
import { useHandlers } from '../useHandlers';

type Props = Readonly<{
  handleChange?: ReactOrNativeEventListener;
  handleBlur?: ReactOrNativeEventListener;
}>;

type ValidFormElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export function useFormInputsRef({ handleBlur, handleChange }: Props): UseSubAnchor {
  const onChange = useRefEventHandlers({ handlers: [handleChange], event: 'change' });
  const onBlur = useRefEventHandlers({ handlers: [handleBlur], event: 'blur' });
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
        validElements.forEach(ref);
      } else {
        // unmount
        ref(null);
      }
    },
    [ref],
  );
}
