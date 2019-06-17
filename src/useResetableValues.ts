import React, {Reducer} from "react";

type allowableKeys = string | number;

interface Values<T> {
    [name: string]: T;
    [name: number]: T;
}

enum ActionTypes { update, reset }
interface Action<T> {
    type: ActionTypes;
    payload: Values<T>;
}

export interface useResetableValuesHook<T> {
    values: Values<T>,
    setValue: (name: allowableKeys, value: T) => void,
    resetValues: () => void
}
function reducer<T>(state: Values<T>, action: Action<T>) {
    switch (action.type) {
    case ActionTypes.update:
        return {...state, ...action.payload};
    case ActionTypes.reset:
        return {...action.payload};
    default:
        throw new Error();
    }
}

export function useResetableValues<T>(initialValues: Values<T> = {}): useResetableValuesHook<T> {
    const [values, dispatch] = React.useReducer<Reducer<Values<T>, Action<T>>>(
        reducer, initialValues
    );
    const setValue = (name: allowableKeys, value: T) => {
        dispatch({ type: ActionTypes.update, payload: {[name]: value}});
    };
    const resetValues = () => {
        dispatch({ type: ActionTypes.reset, payload: initialValues});
    };
    return {values, setValue, resetValues};
}
