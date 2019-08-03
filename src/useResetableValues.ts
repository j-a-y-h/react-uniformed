import React, { Reducer } from "react";

type allowableKeys = string;

export interface Values<T> {
    readonly [name: string]: T;
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
export type setValueCallback<T> = (name: allowableKeys, value: T) => void;
export interface UseResetableValuesHook<T> {
    readonly values: Values<T>;
    readonly hasValue: boolean;
    readonly setValues: (values: Values<T>) => void;
    readonly setValue: setValueCallback<T>;
    readonly resetValues: () => void;
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
    const [values, dispatch] = React.useReducer<ReducerType<T>>(reducer, initialValues);
    const setValue = React.useCallback((name: allowableKeys, value: T): void => {
        dispatch({ type: ActionTypes.update, payload: { name, value } });
    }, []);
    const resetValues = React.useCallback((): void => {
        dispatch({ type: ActionTypes.reset, payload: initialValues });
    }, [initialValues]);
    const setValues = React.useCallback((newValues: Values<T>): void => {
        dispatch({ type: ActionTypes.reset, payload: newValues });
    }, []);
    // note: this counts 0 and empty string as no value.
    const hasValue = React.useMemo(
        (): boolean => Object.keys(values).some((key): boolean => Boolean(values[key])),
        [values],
    );
    return {
        values, setValue, resetValues, setValues, hasValue,
    };
}
