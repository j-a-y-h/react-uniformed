import { useCallback, useRef } from 'react';
import { ReactOrNativeEventListener } from '../useSettersAsEventHandler';
import { mountEventHandler } from '../utils';
import { UseSubAnchor } from './types';

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
export function useAnchorInputs({ handleBlur, handleChange }: Props): UseSubAnchor {
  return useCallback(
    ({ form }) => {
      if (form) {
        mountInputs(form, handleChange, handleBlur);
      } else {
        // TODO: unmount
      }
    },
    [handleChange, handleBlur],
  );
}
