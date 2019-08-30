import {
    Reducer, useReducer, useCallback, useMemo,
} from "react";
import { LoggingTypes, assert } from "./utils";

type allowableKeys = string;

export interface Values<T> {
    readonly [name: string]: T;
}
export type ConstantValues<T, V> = Readonly<{
    [P in keyof T]: V
}>;
export type PartialValues<T, V> = Readonly<Partial<{
    [P in keyof T]: V
}>>;
export interface MutableValues<T> {
    [name: string]: T;
}

interface UpdatePayload<T> {
    name: string;
    value: T;
}
type ActionPayload<T> = Values<T> | UpdatePayload<T>;

enum ActionTypes { update, reset }
interface Action<T> {
    readonly type: ActionTypes;
    readonly payload: ActionPayload<T>;
}

type ReducerType<T> = Reducer<Values<T>, Action<T>>;
export interface SetValueCallback<T> {
    (name: allowableKeys, value: T): void;
}

export interface UseResetableValuesHook<T> {
    readonly values: Values<T>;
    readonly hasValue: boolean;
    readonly setValue: SetValueCallback<T>;
    readonly setValues: (values: Values<T>) => void;
    readonly resetValues: () => void;
}
export function hasValue<T>(values: Values<T>): boolean {
    return !values || typeof values !== "object" || Object.keys(values).some((key): boolean => Boolean(values[key]));
}
function reducer<T>(state: Values<T>, action: Action<T>): Values<T> {
    let value;
    let name;
    switch (action.type) {
    case ActionTypes.update:
        ({ value, name } = action.payload as UpdatePayload<T>);
        // don't do unnecessary updates
        return (state[name] !== value)
            ? { ...state, [name]: value }
            : state;
    case ActionTypes.reset:
        return (action.payload !== state)
            ? { ...action.payload as Values<T> }
            : state;
    default:
        throw new Error();
    }
}

export function useResetableValues<T>(initialValues: Values<T> = {}): UseResetableValuesHook<T> {
    // TODO: support initializer function as the initial value
    assert.error(
        !initialValues || typeof initialValues === "object",
        LoggingTypes.typeError,
        `(expected: Object<string, any> | undefined, received: ${typeof initialValues}) ${useResetableValues.name} expects an object map as the first argument or zero arguments.`,
    );
    const [values, dispatch] = useReducer<ReducerType<T>>(reducer, initialValues);
    const setValue = useCallback((name: allowableKeys, value: T): void => {
        dispatch({ type: ActionTypes.update, payload: { name, value } });
    }, []);
    // TODO: support set all where we merge with current state
    const resetValues = useCallback((): void => {
        dispatch({ type: ActionTypes.reset, payload: initialValues });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // TODO: support a non overriding variant
    const setValues = useCallback((newValues: Values<T>): void => {
        dispatch({ type: ActionTypes.reset, payload: newValues });
    }, []);
    // note: this counts 0 and empty string as no value.
    const hasValueCallback = useMemo((): boolean => hasValue(values), [values]);
    return {
        values, setValue, resetValues, setValues, hasValue: hasValueCallback,
    };
}
