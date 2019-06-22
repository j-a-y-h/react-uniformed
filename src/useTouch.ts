import { useResetableValues, Values } from "./useResetableValues";

export type Touches = Values<boolean>;

export type touchHandler = (name: string, touched: boolean) => void;
export type touchFieldHandler = (name: string) => void;
export interface useTouchHook {
    readonly touches: Touches,
    readonly setTouch: touchHandler;
    readonly touchField: touchFieldHandler;
    resetTouches(): void;
}

export function useTouch(): useTouchHook {
    const {
        values: touches, 
        setValue: setTouch, 
        resetValues: resetTouches,
    } = useResetableValues<boolean>();
    return {
        touches,
        setTouch,
        resetTouches,
        touchField: (name: string) => setTouch(name, true),
    }
}
