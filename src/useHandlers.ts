type handler<K extends any[]> = (...args: K) => any;
type keyValue = [string?, any?];
type keyValueEvent = [string, any, Event];
// TODO: make everything readonly 

// note: don't make these hooks as they can be used anywhere
export function useHandlers<K extends any[] | keyValue>(...handlers: handler<K>[]): handler<K> {
    return (...args: K) => {
        handlers.forEach((func) => {
            func(...args);
        });
    };
}

export function useEventHandlers(...handlers: handler<keyValueEvent>[]): handler<[Event]> {
    const handler = useHandlers<keyValueEvent>(...handlers);
    return (evt: Event) => {
        const {target} = evt;
        handler(
            (target as HTMLInputElement).name, 
            (target as HTMLInputElement).value,
            evt,
        );
    };
}