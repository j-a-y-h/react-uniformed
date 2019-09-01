import { useCallback } from "react";
import { useGenericValues, Values } from "./useGenericValues";

export type Touches = Values<boolean>;
export interface TouchHandler {
    (name: string, touched: boolean): void;
}
export interface TouchFieldHandler {
    (name: string): void;
}
export interface UseTouchHook {
    readonly touches: Touches;
    readonly setTouch: TouchHandler;
    readonly touchField: TouchFieldHandler;
    readonly resetTouches: () => void;
    readonly setTouches: (touches: Touches) => void;
}

export function useTouch(): UseTouchHook {
    const {
        values: touches,
        setValue: setTouch,
        resetValues: resetTouches,
        setValues: setTouches,
    } = useGenericValues<boolean>();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const touchField = useCallback((name: string): void => setTouch(name, true), []);
    return {
        touches, setTouch, resetTouches, touchField, setTouches,
    };
}
