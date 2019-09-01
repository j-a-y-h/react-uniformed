import { useCallback } from "react";
import { useResetableValues, UseResetableValuesHook, Values, MutableValues } from "./useResetableValues";

export type userSuppliedValue = string | string[] | boolean | number | undefined | null;
export type Fields = Values<userSuppliedValue>;
export type MutableFields = MutableValues<userSuppliedValue>;

function getResetValue(currentValue: userSuppliedValue) {
    switch (typeof currentValue) {
    case "number":
        return 0;
    case "boolean":
        return false;
    case "object":
        if (Array.isArray(currentValue)) {
            return [];
        } else {
            return "";
        }
    case "string":
    default:
        return "";
    }
}

export function useFields(initialValues?: Fields): UseResetableValuesHook<userSuppliedValue> {
    const { resetValues: _, setValues, ...resetableValues } = useResetableValues(initialValues);
    const resetValues = useCallback((): void => {
        setValues((currentState) => {
            const nonNullInitialValues: MutableFields = { ...initialValues } || {};
            return Object.keys(currentState).reduce((newState, key) => {
                if (!({}).hasOwnProperty.call(newState, key)) {
                    newState[key] = getResetValue(currentState[key]);
                }
                return newState;
            }, nonNullInitialValues);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return { ...resetableValues, setValues, resetValues };
};
