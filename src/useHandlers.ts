import React from "react";

type handler<T, K extends T[], Z> = (...args: K) => Z;
type keyValueEvent<T> = [string, T, Event];

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
    ...handlers: handler<string | Event, keyValueEvent<string>, void>[]
): handler<Event, [Event], void> {
    const handler = useHandlers<string | Event, keyValueEvent<string>>(...handlers);
    return React.useCallback((evt: Event): void => {
        const { target } = evt;
        handler(
            (target as HTMLInputElement).name,
            (target as HTMLInputElement).value,
            evt,
        );
    }, [handler]);
}
