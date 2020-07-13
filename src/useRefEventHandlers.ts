import { Ref, useCallback } from 'react';
import { ReactOrNativeEventListener } from './useSettersAsEventHandler';
import { useHandlers } from './useHandlers';

type Props = Readonly<{
  event: keyof GlobalEventHandlersEventMap;
  handlers: ReactOrNativeEventListener[];
}>;

export function useRefEventHandlers<T extends EventTarget>({ event, handlers }: Props): Ref<T> {
  const eventHandler = useHandlers(...handlers);
  const ref = useCallback(
    (input: T | null): void => {
      // note: React will call input with null when the component is unmounting
      if (input) {
        // TODO: solve potential memory leak, in the else block removeEventListener,
        // and when this function
        // is called with new eventHandler
        input.addEventListener(event, eventHandler);
      }
    },
    [event, eventHandler],
  );
  return ref;
}
