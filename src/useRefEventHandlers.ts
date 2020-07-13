import { Ref, useCallback, useRef } from 'react';
import { ReactOrNativeEventListener } from './useSettersAsEventHandler';
import { useHandlers } from './useHandlers';

type Props = Readonly<{
  event: string;
  handlers: ReactOrNativeEventListener[];
}>;

interface LastRef<T> {
  input: T | null;
  eventHandler?: ReactOrNativeEventListener;
  event: string;
}

export function useRefEventHandlers<T extends HTMLElement = HTMLElement>({
  event,
  handlers,
}: Props): Ref<T> {
  const lastRef = useRef<LastRef<T>>();
  const eventHandler = useHandlers(...handlers);
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
