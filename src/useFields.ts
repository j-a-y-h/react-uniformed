import React from "react";
export interface Fields {
    /**
     * The key is the name of the field
     * The value is the initial value
     */
    [name: string]: string;
}

export interface Values {
    [name: string]: any;
}
enum ActionTypes { update, reset }
export interface Action {
    type: ActionTypes;
    payload: Values;
}

function reducer(state: Values, action: Action) {
    switch (action.type) {
    case ActionTypes.update:
        return {...state, ...action.payload};
    case ActionTypes.reset:
        return {...action.payload};
    default:
        throw new Error();
    }
}

export function useFields(initialValues?: Fields) {
    const [values, dispatch] = React.useReducer(reducer, initialValues || {});
    dispatch;
    return {values};
}
