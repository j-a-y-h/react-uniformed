import React, { SyntheticEvent } from "react";
import { validateAllHandler } from "./useValidation";
import { Values } from "./useResetableValues";

type handler<T, K extends T[], Z> = (...args: K) => Z;
type keyValueEvent<T> = [string, T, SyntheticEvent];

export function useHandlers<T, K extends T[]>(
    ...handlers: handler<T, K, void>[]
): handler<T, K, void> {
    return React.useCallback((...args: K): void => {
        handlers.forEach((func): void => {
            func(...args);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...handlers]);
}

export function useEventHandlers(
    ...handlers: handler<string | SyntheticEvent, keyValueEvent<string>, void>[]
): handler<SyntheticEvent, [SyntheticEvent], void> {
    const handler = useHandlers<string | SyntheticEvent, keyValueEvent<string>>(...handlers);
    return React.useCallback((evt: SyntheticEvent): void => {
        const { target } = evt;
        handler(
            (target as HTMLInputElement).name,
            (target as HTMLInputElement).value,
            evt,
        );
    }, [handler]);
}

export function useValidationWithValues<T>(
    validate: validateAllHandler<T>, values: Values<T>,
): () => void {
    return React.useCallback((): void => { validate(values); }, [validate, values]);
}
