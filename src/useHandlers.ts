import {
    SyntheticEvent, useCallback, Ref,
} from "react";
import { assert, LoggingTypes } from "./utils";
import { ValidateAllHandler } from "./useValidation";
import { Values } from "./useResetableValues";

interface Handler<T, K extends T[], Z> {
    (...args: K): Z;
}
type reactOrNativeEvent = SyntheticEvent | Event;
type keyValueEvent<T> = [string, T, reactOrNativeEvent];
type eventLikeHandlers = Handler<string | reactOrNativeEvent, keyValueEvent<string>, void>
interface UseEventHandlersWithRefProps {
    readonly event: keyof HTMLElementEventMap;
    // TODO: change to setters to match the function signature
    readonly handlers: eventLikeHandlers[] | eventLikeHandlers;
}
type useEventHandlersWithRefProps<T> = T extends UseEventHandlersWithRefProps[]
    ? [UseEventHandlersWithRefProps]
    : eventLikeHandlers[];

export function useHandlers<T, K extends T[]>(
    ...handlers: Handler<T, K, void>[]
): Handler<T, K, void> {
    return useCallback((...args: K): void => {
        handlers.forEach((func, index): void => {
            assert.error(
                typeof func === "function",
                LoggingTypes.typeError,
                `(expected: function, received: ${typeof func}) ${useHandlers.name} expects a function at index (${index}).`,
            );
            func(...args);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, handlers);
}

export function useSettersAsEventHandler(
    ...handlers: eventLikeHandlers[]
): Handler<reactOrNativeEvent, [reactOrNativeEvent], void> | EventListener {
    const handler = useHandlers<string | reactOrNativeEvent, keyValueEvent<string>>(...handlers);
    return useCallback((evt: reactOrNativeEvent): void => {
        assert.error(
            evt && !!evt.target,
            LoggingTypes.invalidArgument,
            `${useSettersAsEventHandler.name} expects to be used in an event listener.`,
        );
        const { target } = evt;
        handler(
            (target as HTMLInputElement).name,
            (target as HTMLInputElement).value,
            evt,
        );
    }, [handler]);
}

export function useValidatorWithValues<T>(
    validate: ValidateAllHandler<T>, values: Values<T>,
): () => void {
    assert.error(
        typeof validate === "function",
        LoggingTypes.typeError,
        `(expected: function, received: ${typeof validate}) ${useValidatorWithValues.name} expects a function as the first argument.`,
    );
    return useCallback((): void => { validate(values); }, [validate, values]);
}

export function useSettersAsRefEventHandler(
    ...args: useEventHandlersWithRefProps<UseEventHandlersWithRefProps[] | eventLikeHandlers[]>
): Ref<EventTarget> {
    let event: keyof HTMLElementEventMap = "change";
    let handlers: eventLikeHandlers[];
    if (typeof args[0] === "function") {
        // provided a event handler list
        handlers = args as eventLikeHandlers[];
    } else {
        // provided an object
        assert.error(
            args[0] && typeof args[0] === "object",
            LoggingTypes.typeError,
            `(expected: {event: string, handlers: function[]}, received: ${typeof args[0]}) ${useSettersAsRefEventHandler.name} expects a list of functions or an object with event and handlers as properties.`,
        );
        const {
            event: firstEvent,
            handlers: firstHandlers,
        } = args[0];
        event = firstEvent || event;
        handlers = Array.isArray(firstHandlers) ? firstHandlers : [firstHandlers];
    }
    const eventHandler = useSettersAsEventHandler(...handlers) as EventListener;
    const ref = useCallback((input: EventTarget): void => {
        assert.error(
            input && typeof input.addEventListener === "function",
            LoggingTypes.typeError,
            `(expected: EventTarget, received: ${typeof input}) ${useSettersAsRefEventHandler.name} ref requires an EventTarget.`,
        );
        input.addEventListener(event, eventHandler);
    }, [event, eventHandler]);
    return ref;
}
