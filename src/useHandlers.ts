import {
  SyntheticEvent, useCallback, Ref,
} from 'react';
import { assert, LoggingTypes } from './utils';
// TODO: switch all code to 2 spaces instead of 4
interface Handler<T, K extends T[], Z> {
    (...args: K): Z;
}
export type reactOrNativeEvent = SyntheticEvent | Event;
type keyValueEvent<T> = [string, T, EventTarget | null];
type eventLikeHandlers = Handler<string | EventTarget | null, keyValueEvent<string>, void>
interface UseEventHandlersWithRefProps {
    readonly event?: keyof HTMLElementEventMap;
    // TODO: change to setters to match the function signature
    readonly handlers: eventLikeHandlers[];
}
type useEventHandlersWithRefProps<T> = T extends UseEventHandlersWithRefProps[]
    ? [UseEventHandlersWithRefProps]
    : eventLikeHandlers[];
interface ReactOrNativeEventListener {
    (event: Event | SyntheticEvent): void;
}

export function useHandlers<T, K extends T[]>(
  ...handlers: Handler<T, K, void>[]
): Handler<T, K, void> {
  return useCallback((...args: K): void => {
    handlers.forEach((func, index): void => {
      assert.error(
        typeof func === 'function',
        LoggingTypes.typeError,
        `(expected: function, received: ${typeof func}) ${useHandlers.name} expects a function at index (${index}).`,
      );
      func(...args);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, handlers);
}

export function useSettersAsEventHandler(
  ...handlers: eventLikeHandlers[]
): ReactOrNativeEventListener {
  const handler = useHandlers<string | EventTarget | null, keyValueEvent<string>>(...handlers);
  return useCallback((evt: reactOrNativeEvent): void => {
    assert.error(
      evt && !!evt.target,
      LoggingTypes.invalidArgument,
      `${useSettersAsEventHandler.name} expects to be used in an event listener.`,
    );
    const { target } = evt;
    handler(
      (target as HTMLInputElement).name,
      // TODO: support select and multiple select
      /**
       * let value = "";
       * if (target instanceof HTMLSelectElement || target.selectedOptions) {
       *     const values = Array.from(target.selectedOptions).map((option) => option.value);
       *     value = target.multiple ? values : value[0];
       * } else {
       *     ({value} = target);
       * }
       */
      (target as HTMLInputElement).value,
      target,
    );
  }, [handler]);
}

export function useSettersAsRefEventHandler(
  ...args: useEventHandlersWithRefProps<UseEventHandlersWithRefProps[] | eventLikeHandlers[]>
): Ref<EventTarget> {
  let event: keyof HTMLElementEventMap = 'change';
  // provided a event handler list
  let handlers: eventLikeHandlers[] = args as eventLikeHandlers[];
  if (typeof args[0] !== 'function') {
    // provided an object
    const [options] = args;
    assert.error(
      options && typeof options === 'object',
      LoggingTypes.typeError,
      `(expected: {event: string, handlers: function[]}, received: ${typeof options}) ${useSettersAsRefEventHandler.name} expects a list of functions or an object with event and handlers as properties.`,
    );
    const { event: firstEvent } = options;
    ({ handlers } = options);
    event = firstEvent || event;
  }
  const eventHandler = useSettersAsEventHandler(...handlers);
  const ref = useCallback((input: EventTarget): void => {
    input.addEventListener(event, eventHandler);
  }, [event, eventHandler]);
  return ref;
}
