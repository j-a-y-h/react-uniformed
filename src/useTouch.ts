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
