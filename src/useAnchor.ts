import { Ref, useCallback } from 'react';
import { Fields } from './useFields';
import { ReactOrNativeEventListener } from './useSettersAsEventHandler';
import { mountEventHandler } from './utils';

type Props = Readonly<{
  values?: Fields;
  handleChange?: ReactOrNativeEventListener;
  handleBlur?: ReactOrNativeEventListener;
}>;

interface UseAnchor {
  anchor: Ref<HTMLFormElement>;
}

export function useAnchor({ handleChange }: Props): UseAnchor {
  const anchor = useCallback(
    (form: HTMLFormElement | null): void => {
      if (form) {
        const { elements } = form;
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
          if (handleChange) {
            mountEventHandler({
              // TODO: support of types here too
              input: (input as unknown) as HTMLInputElement,
              event: 'change',
              eventHandler: handleChange,
            });
          }
        });
      }
    },
    [handleChange],
  );
  return { anchor };
}
