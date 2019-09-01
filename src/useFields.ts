import { useCallback } from "react";
import {
    useResetableValues, UseResetableValuesHook, Values, MutableValues,
} from "./useResetableValues";

export type userSuppliedValue = string | string[] | boolean | number | undefined | null;
export type Fields = Values<userSuppliedValue>;
export type MutableFields = MutableValues<userSuppliedValue>;

function getResetValue(currentValue: userSuppliedValue): userSuppliedValue {
    switch (typeof currentValue) {
    case "number":
        return 0;
    case "boolean":
        return false;
    case "object":
        return Array.isArray(currentValue) ? [] : "";
    case "string":
    default:
        return "";
    }
}

// eslint-disable-next-line import/prefer-default-export
export function useFields(initialValues?: Fields): UseResetableValuesHook<userSuppliedValue> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { resetValues: _, setValues, ...resetableValues } = useResetableValues(initialValues);
    const resetValues = useCallback((): void => {
        setValues((currentState): Fields => {
            const nonNullInitialValues: MutableFields = { ...initialValues } || {};
            return Object.keys(currentState).reduce((newState, key) => {
                if (!({}).hasOwnProperty.call(newState, key)) {
                    // eslint-disable-next-line no-param-reassign
                    newState[key] = getResetValue(currentState[key]);
                }
                return newState;
            }, nonNullInitialValues);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return { ...resetableValues, setValues, resetValues };
}
