import { useCallback } from "react";
import { useResetableValues, Values } from "./useResetableValues";

export type Touches = Values<boolean>;
export type touchHandler = (name: string, touched: boolean) => void;
export type touchFieldHandler = (name: string) => void;
export interface UseTouchHook {
    readonly touches: Touches;
    readonly setTouch: touchHandler;
    readonly touchField: touchFieldHandler;
    readonly resetTouches: () => void;
}

export function useTouch(): UseTouchHook {
    const {
        values: touches,
        setValue: setTouch,
        resetValues: resetTouches,
    } = useResetableValues<boolean>();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const touchField = useCallback((name: string): void => setTouch(name, true), []);
    return {
        touches, setTouch, resetTouches, touchField,
    };
}
