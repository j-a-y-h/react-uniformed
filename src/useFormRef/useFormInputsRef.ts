import { useCallback, RefCallback } from 'react';
import { ReactOrNativeEventListener } from '../useSettersAsEventHandler';
import { useRefEventHandlers } from '../useRefEventHandlers';
import { useHandlers } from '../useHandlers';

type Props = Readonly<{
  handleChange?: ReactOrNativeEventListener;
  handleBlur?: ReactOrNativeEventListener;
}>;

type ValidFormElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

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
        // TODO: add unit tests and test for usage of .closest
        const { elements } = form.closest('form') ?? form;
        // filter for input, select, and textarea elements only
        const validElements = Array.from(elements).filter((element) => {
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
