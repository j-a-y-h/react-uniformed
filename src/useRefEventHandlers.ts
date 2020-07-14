import { useCallback, useRef, RefCallback } from 'react';
import { ReactOrNativeEventListener } from './useSettersAsEventHandler';
import { useHandlers } from './useHandlers';

type Props = Readonly<{
  event: string;
  handlers?: ReactOrNativeEventListener[] | ReactOrNativeEventListener;
}>;

type LastRef<T> = Readonly<{
  input: T | null;
  eventHandler?: ReactOrNativeEventListener;
  event: string;
}>;

export function useRefEventHandlers<T extends HTMLElement = HTMLElement>({
  event,
  handlers,
}: Props): RefCallback<T> {
  // track the lastRef so we can remove event handlers
  const lastRef = useRef<LastRef<T>>();
  let handlersList: ReactOrNativeEventListener[] = [];
  if (handlers instanceof Array) {
    handlersList = handlers;
  } else if (handlers) {
    handlersList = [handlers];
  }
  const hasHandlers = handlersList.length;
  const eventHandler = useHandlers(...handlersList);
  const ref = useCallback(
    (input: T | null): void => {
      // note: React will call input with null when the component is unmounting
      if (input) {
        // adds event listener on mount
        input.addEventListener(event, eventHandler);
      } else if (lastRef.current?.eventHandler) {
        // removes the event listener
        const { current } = lastRef;
        current?.input?.removeEventListener(current.event, lastRef.current.eventHandler);
      }
      lastRef.current = { event, eventHandler, input };
    },
    [event, eventHandler],
  );
  return ref;
}
