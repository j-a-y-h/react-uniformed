import { useCallback, RefCallback } from 'react';
import { ReactOrNativeEventListener } from '../useSettersAsEventHandler';
import { useRefEventHandlers } from '../useRefEventHandlers';
import { useHandlers } from '../useHandlers';

type Props = Readonly<{
  handleChange?: ReactOrNativeEventListener;
  handleBlur?: ReactOrNativeEventListener;
}>;

type ValidFormElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// list of unsupported types for input elements
const INVALID_INPUT_TYPES = new Set(['submit', 'image', 'reset', 'hidden']);

export function useFormInputsRef({
  handleBlur,
  handleChange,
}: Props): RefCallback<HTMLFormElement> {
  const changeRef = useRefEventHandlers({ handlers: handleChange, event: 'change' });
  const blurRef = useRefEventHandlers({ handlers: handleBlur, event: 'blur' });
  const ref = useHandlers(changeRef, blurRef);
  return useCallback(
    (form) => {
      //  mounts
      if (form) {
        // looks for closest
        // TODO: add unit tests
        // filter for input, select, and textarea elements only
        const validElements = Array.from(form.elements).filter((element) => {
          return (
            // inputs must be of certain type too
            (element instanceof HTMLInputElement && !INVALID_INPUT_TYPES.has(element.type)) ||
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
