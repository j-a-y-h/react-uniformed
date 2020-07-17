import { useCallback, RefCallback, useEffect, useRef } from 'react';
import { ReactOrNativeEventListener } from '../useSettersAsEventHandler';
import { useRefEventHandlers } from '../useRefEventHandlers';
import { useHandlers } from '../useHandlers';

type Props = Readonly<{
  handleChange?: ReactOrNativeEventListener;
  handleBlur?: ReactOrNativeEventListener;
}>;

type SupportedFormElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// list of unsupported types for input elements
const UNSUPPORTED_INPUT_TYPES = new Set(['submit', 'image', 'reset', 'hidden']);

export function useFormInputsRef({
  handleBlur,
  handleChange,
}: Props): RefCallback<HTMLFormElement> {
  const changeRef = useRefEventHandlers({ handlers: handleChange, event: 'change' });
  const blurRef = useRefEventHandlers({ handlers: handleBlur, event: 'blur' });
  const ref = useHandlers(changeRef, blurRef);
  const formRef = useRef<HTMLFormElement | null>();
  // handles update from initialization and useEffect
  const update = useCallback(
    (form?: HTMLFormElement | null): void => {
      // mounts
      if (form) {
        // filter for input, select, and textarea elements only
        const supportedElements = Array.from(form.elements).filter<SupportedFormElements>(
          (element): element is SupportedFormElements => {
            return (
              // inputs must be of certain type too
              (element instanceof HTMLInputElement && !UNSUPPORTED_INPUT_TYPES.has(element.type)) ||
              element instanceof HTMLSelectElement ||
              element instanceof HTMLTextAreaElement
            );
          },
        );
        // add event handlers
        supportedElements.forEach(ref);
      } else {
        // unmount
        ref(null);
      }
    },
    [ref],
  );
  // handle render updates
  useEffect(() => {
    update(formRef.current);
    return update;
  }, [update]);
  return useCallback(
    (form): void => {
      formRef.current = form;
      update(form);
    },
    [formRef, update],
  );
}
