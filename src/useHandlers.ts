import {
    SyntheticEvent, useCallback, Ref,
} from "react";
import { assert, LoggingTypes } from "./utils";
import { validateAllHandler } from "./useValidation";
import { Values } from "./useResetableValues";

interface Handler<T, K extends T[], Z> {
    (...args: K): Z;
}
type reactOrNativeEvent = SyntheticEvent | Event;
type keyValueEvent<T> = [string, T, reactOrNativeEvent];
type eventLikeHandlers = Handler<string | reactOrNativeEvent, keyValueEvent<string>, void>
interface UseEventHandlersWithRefProps {
    readonly event: keyof HTMLElementEventMap;
    readonly handlers: eventLikeHandlers[] | eventLikeHandlers;
}

export function useHandlers<T, K extends T[]>(
    ...handlers: Handler<T, K, void>[]
): Handler<T, K, void> {
    return useCallback((...args: K): void => {
        handlers.forEach((func): void => {
            func(...args);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...handlers]);
}

export function useEventHandlers(
    ...handlers: eventLikeHandlers[]
): Handler<reactOrNativeEvent, [reactOrNativeEvent], void> | EventListener {
    const handler = useHandlers<string | reactOrNativeEvent, keyValueEvent<string>>(...handlers);
    return useCallback((evt: reactOrNativeEvent): void => {
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
    return useCallback((): void => { validate(values); }, [validate, values]);
}

// TODO: use interface functions (ie functions without names in the interface)
export function useEventHandlersWithRef(
    ...args: UseEventHandlersWithRefProps[] | eventLikeHandlers[]
): Ref<HTMLInputElement> {
    let event: keyof HTMLElementEventMap = "change";
    let handlers: eventLikeHandlers[];
    if (typeof args[0] === "function") {
        // provided a event handler list
        handlers = args as eventLikeHandlers[];
    } else {
        // provided an object
        assert.error(
            !!args[0],
            LoggingTypes.invalidArgument,
            "useEventHandlersWithRef requires at least one argument",
        );
        const {
            event: firstEvent,
            handlers: firstHandlers,
        } = args[0] as UseEventHandlersWithRefProps;
        event = firstEvent || event;
        handlers = Array.isArray(firstHandlers) ? firstHandlers : [firstHandlers];
    }
    const eventHandler = useEventHandlers(...handlers) as EventListener;
    const ref = useCallback((input: HTMLInputElement): void => {
        assert.error(
            !!input,
            LoggingTypes.invalidArgument,
            "useEventHandlersWithRef ref requires an HTMLElement",
        );
        input.addEventListener(event, eventHandler);
    }, [event, eventHandler]);
    return ref;
}
