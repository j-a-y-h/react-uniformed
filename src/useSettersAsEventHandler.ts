import { useCallback, SyntheticEvent } from 'react';
import { eventLikeHandlers, reactOrNativeEvent, keyValueEvent, useHandlers } from './useHandlers';
import { assert, LoggingTypes } from './utils';

interface ReactOrNativeEventListener {
  (event: Event | SyntheticEvent): void;
}

/**
 * Gets the value for the specified input.
 *
 * @param input - the specified input
 * @returns the value as a string
 */
function getInputValue({ checked, type, value }: HTMLInputElement): string {
  // TODO: support select and multiple select
  /*
   * let value = "";
   * if (target instanceof HTMLSelectElement || target.selectedOptions) {
   *     const values = Array.from(target.selectedOptions).map((option) => option.value);
   *     value = target.multiple ? values : value[0];
   * } else {
   *     ({value} = target);
   * }
   */
  let ret: string = value;
  if (type === 'checkbox') {
    ret = checked
      ? // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Value
        // If the value attribute was omitted, the default value for the checkbox is 'on'.
        value || 'on'
      : '';
  }
  return ret;
}

/**
 * Converts a list of setters to a single event handler.  Setters are functions
 * that takes a specified name as the first parameter and a specified value as
 * the second param. Note that this hook is built on top of {@link useHandlers}.
 * @param handlers - A list of setters that will be used in an event handler
 * @returns An event handler that can be used in events like onChange or onBlur.  In order
 * for this hook to call each setter with a name and value param, the inputs that this
 * is used on must have a name attribute that maps to the specified.
 * @example <caption>Create an onChange event handler</caption>
 * ```javascript
 * // set values and touches on change
 * const handleChange = useSettersAsEventHandler(setValue, touchField);
 *
 * // set values and touches on change as well as validate
 * const handleChange = useSettersAsEventHandler(setValue, touchField, validateByName);
 *
 * <input
 *   name="username"
 *   value={values.username}
 *   onChange={handleChange}
 * />
 * ```
 * @example <caption>Creating an onBlur event handler</caption>
 * ```javascript
 * // set values and touches on change
 * const handleChange = useSettersAsEventHandler(setValue, touchField);
 *
 * // validation may be expensive so validate on blur.
 * const handleBlur = useSettersAsEventHandler(validateByName);
 *
 * <input
 *   name="username"
 *   value={values.username}
 *   onChange={handleChange}
 *   onBlur={handleBlur}
 * />
 * ```
 */
export function useSettersAsEventHandler(
  ...handlers: eventLikeHandlers[]
): ReactOrNativeEventListener {
  const handler = useHandlers<string | EventTarget | null, keyValueEvent<string>>(...handlers);
  return useCallback(
    (evt: reactOrNativeEvent): void => {
      assert.error(
        Boolean(evt?.target),
        LoggingTypes.invalidArgument,
        `${useSettersAsEventHandler.name} expects to be used in an event listener.`,
      );
      const { target } = evt;
      handler((target as HTMLInputElement).name, getInputValue(target as HTMLInputElement), target);
    },
    [handler],
  );
}
