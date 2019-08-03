import React, { SyntheticEvent } from "react";

type handler<T, K extends T[], Z> = (...args: K) => Z;
type keyValueEvent<T> = [string, T, SyntheticEvent];

export function useHandlers<T, K extends T[]>(
    ...handlers: handler<T, K, void>[]
): handler<T, K, void> {
    return React.useCallback((...args: K): void => {
        handlers.forEach((func): void => {
            func(...args);
        });
    }, [handlers]);
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
