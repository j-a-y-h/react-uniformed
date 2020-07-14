import { Ref, RefCallback } from 'react';
import { eventLikeHandlers, useHandlers } from './useHandlers';
import { assert, LoggingTypes } from './utils';
import { Fields } from './useFields';
import { useSettersAsEventHandler } from './useSettersAsEventHandler';
import { useRefEventHandlers } from './useRefEventHandlers';
import { useMountedRefValues } from './useMountedRefValues';

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

// TODO: Add examples for this use case

export function useSettersAsRefEventHandler<
  T extends HTMLElement = HTMLInputElement,
  V extends Fields = Fields
>(props: UseEventHandlersWithRefProps<V>): Ref<T>;

/**
 * @example
 * ```
 * import {useSettersAsRefEventHandler} from "react-uniformed";
 *
 * // useSettersAsRefEventHandler defaults to an on change event
 * const changeRef = useSettersAsRefEventHandler(setValue);
 *
 * // name attribute is still required as the changeRef calls setValue(name, value) on change
 * <input name="name" ref={changeRef} />
 * ```
 */
export function useSettersAsRefEventHandler<T extends HTMLElement = HTMLInputElement>(
  ...setters: eventLikeHandlers[]
): Ref<T>;

// TODO: break out tsdoc to each overloaded method

/**
 * A hook that adds support for uncontrolled inputs using
 * React refs. The React ref is used to synchronize the state of the input in the DOM
 * and the state of the form in the Virtual DOM.
 * This hook is generally only needed for larger forms or larger React Virtual DOM.
 *
 * @param args -
 *  a list of functions used to set a value or an object with `event`,
 *  `handlers`, and `mountedValues` as properties.
 * - `handlers`: a list of functinos used to set a value.
 * - `event?`: the event to register this handler to. (defaults to `'change'`).
 * - `mountedValues?`: used to set values on mount of the ref.
 * @returns returns a React ref function.
 */
export function useSettersAsRefEventHandler<
  T extends HTMLElement = HTMLInputElement,
  V extends Fields = Fields
>(
  ...args: useEventHandlersWithRefProps<[UseEventHandlersWithRefProps<V>] | eventLikeHandlers[], V>
): Ref<T> {
  let event: keyof HTMLElementEventMap = 'change';
  // provided an event handler list
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
    event = options.event ?? event;
  }
  const eventHandler = useSettersAsEventHandler(...handlers);
  const mountedRefValues = useMountedRefValues<HTMLInputElement>(mountedValues) as RefCallback<T>;
  const refEventHandlers = useRefEventHandlers<T>({
    handlers: [eventHandler],
    event,
  });
  const ref = useHandlers(mountedRefValues, refEventHandlers);
  return ref;
}
