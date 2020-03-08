import {
  useCallback, Ref,
} from 'react';
import { useSettersAsEventHandler, eventLikeHandlers } from './useHandlers';
import { assert, LoggingTypes } from './utils';
import { Fields } from './useFields';

interface UseEventHandlersWithRefProps<V> {
    readonly event?: keyof HTMLElementEventMap;
    readonly handlers: eventLikeHandlers[];
    /**
     * Used to set values on mount of the ref.
     */
    readonly mountedValues?: V;
  }
type useEventHandlersWithRefProps<T, V> = T extends [UseEventHandlersWithRefProps<V>]
    ? [UseEventHandlersWithRefProps<V>]
      : eventLikeHandlers[];

export function useSettersAsRefEventHandler<
  T extends HTMLElement = HTMLElement, V extends Fields = Fields
>(
  ...args: useEventHandlersWithRefProps<[UseEventHandlersWithRefProps<V>] | eventLikeHandlers[], V>
): Ref<T> {
  let event: keyof HTMLElementEventMap = 'change';
  // provided a event handler list
  let handlers: eventLikeHandlers[] = args as eventLikeHandlers[];
  let mountedValues: V | undefined;
  if (typeof args[0] !== 'function' && args.length > 0) {
    // provided an object
    const [options] = args;
    assert.error(
      options && typeof options === 'object',
      LoggingTypes.typeError,
      `(expected: {event?: string, handlers: function[], mountedValues?: {}}, received: typeof ${typeof options}, ${options})`,
    );
    ({ handlers, mountedValues } = options);
    event = options.event || event;
  }
  const eventHandler = useSettersAsEventHandler(...handlers);
  const ref = useCallback((input: T | null): void => {
    // note: React will call input with null when the component is unmounting
    if (input) {
      const { name } = input as unknown as HTMLInputElement;
      input.addEventListener(event, eventHandler);
      if (mountedValues && name && mountedValues[name]) {
        // need to set the mounted values
        // eslint-disable-next-line no-param-reassign
        (input as unknown as HTMLInputElement).value = String(mountedValues[name]);
      }
    }
  }, [event, eventHandler, mountedValues]);
  return ref;
}
