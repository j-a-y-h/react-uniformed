import { useResetableValues } from "./useResetableValues";

export interface Touches {
    readonly [name: string]: boolean;
}

export interface useTouchHook {
    readonly touches: Touches,
    setTouch(name: string, touched: boolean): void;
    touchField(name: string): void;
    resetTouches(): void;
}

export function useTouch(): useTouchHook {
    const {values, setValue, resetValues} = useResetableValues<boolean>({});
    return {
        touches: values,
        setTouch: setValue,
        touchField: (name: string) => setValue(name, true),
        resetTouches: resetValues,
    }
}
