/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useCallback, useRef, RefCallback } from 'react';
import { ReactOrNativeEventListener } from './useSettersAsEventHandler';
import { useHandlers } from './useHandlers';

type Props = Readonly<{
  event: string;
  handlers?: ReactOrNativeEventListener[] | ReactOrNativeEventListener;
}>;

type LastRef<T> = Readonly<{
  inputs: Set<T>;
  eventHandler: ReactOrNativeEventListener;
  event: string;
}>;

export function useRefEventHandlers<T extends HTMLElement = HTMLElement>({
  event,
  handlers,
}: Props): RefCallback<T> {
  let handlersList: ReactOrNativeEventListener[] = [];
  if (handlers instanceof Array) {
    handlersList = handlers;
  } else if (handlers) {
    handlersList = [handlers];
  }
  const hasHandlers = handlersList.length;
  const eventHandler = useHandlers(...handlersList);
  // track the lastRef so we can remove event handlers
  const lastRef = useRef<LastRef<T>>({
    event,
    eventHandler,
    inputs: new Set(),
  });
  const ref = useCallback(
    (input: T | null): void => {
      if (!hasHandlers) {
        return;
      }
      const { current } = lastRef;
      // note: React will call input with null when the component is unmounting
      if (input) {
        current.inputs.add(input);
        // adds event listener on mount
        current.inputs.forEach((currentInput) => {
          // @ts-expect-error
          currentInput.addEventListener(event, eventHandler);
        });
        lastRef.current = { ...current, event, eventHandler };
      } else {
        // removes the event listener
        current.inputs.forEach((currentInput) => {
          // @ts-expect-error
          currentInput.removeEventListener(current.event, current.eventHandler);
        });
        lastRef.current = { event, eventHandler, inputs: new Set() };
      }
    },
    [event, eventHandler, hasHandlers],
  );
  return ref;
}
