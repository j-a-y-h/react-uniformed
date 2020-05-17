import { useCallback } from 'react';
import { useGenericValues, Values } from './useGenericValues';

export type Touches = Values<boolean>;
export interface TouchHandler {
  (name: string, touched: boolean): void;
}
export interface TouchFieldHandler {
  (name: string): void;
}
export interface UseTouchHook {
  /**
   * An object map that contains the touch state of an input.
   * The key is used to indentify the input -- generally this is the input name.
   * The value is a boolean that determines if the node is touched or not.
   */
  readonly touches: Touches;
  /**
   * Set to true if any field is touched.
   */
  readonly isDirty: boolean;
  /**
   * Sets the touch state for the specified input to the specified touched value.
   */
  readonly setTouch: TouchHandler;
  /**
   * Sets the specified input's touch state to true.
   */
  readonly touchField: TouchFieldHandler;
  /**
   * Sets all touch state to false.
   */
  readonly resetTouches: () => void;
  /**
   * Replaces the touch state object with the specified touches object map.
   */
  readonly setTouches: (touches: Touches) => void;
}

/**
 * Tracks touches within a form.
 * @example Basic example
 * ```javascript
 * const {touches, setTouch, resetTouches, touchField, setTouches, isDirty} = useTouch();
 *
 * // set touch to true for an input
 * touchField('name');
 * // set the touch state to false for an input
 * setTouch('name', false);
 * // set the touch state for multiple inputs (used by useForm is about to be submitted)
 * setTouches({
 *   name: true,
 *   email: true,
 * });
 *
 * // check the touch state for inputs
 * if (touches.name || touches.email)
 *   console.log("You touched the email and name field");
 *
 * // check if any of the fields have been touched (works well when you are validating
 * // all inputs and want to only enable submitting after the user touches the form
 * // and resolves all errors)
 * if (isDirty && !hasError)
 *   console.log("submitting the for is now enabled");
 *
 * // Use the resetTouches function when you want to reset the touch state.
 * resetTouches();
 * // resetTouches is used by useForm with other reset functions
 * const reset = useHandlers(resetValues, resetErrors, resetTouches);
 * ```
 */
export function useTouch(): UseTouchHook {
  const {
    values: touches,
    setValue: setTouch,
    resetValues: resetTouches,
    setValues: setTouches,
    hasValue: isDirty,
  } = useGenericValues<boolean>();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  const touchField = useCallback((name: string): void => setTouch(name, true), []);
  return {
    touches, setTouch, resetTouches, touchField, setTouches, isDirty,
  };
}
