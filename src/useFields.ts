import { useCallback, useMemo } from "react";
import {
    useGenericValues, UseResetableValuesHook,
} from "./useGenericValues";
import { NormalizerHandler } from "./useNormalizers";

export type FieldValue = string | number | boolean | undefined | MutableFields | any[];

export type MutableFields = Partial<{
    [key: string]: FieldValue;
}>;
export type Fields = Readonly<MutableFields>;

interface SetField {
    (name: string, value: FieldValue, eventTarget?: EventTarget | null): void;
}
export interface UseFieldsHook extends Omit<UseResetableValuesHook<FieldValue>, "setValue"> {
    readonly setValue: SetField;
}

function getResetValue(currentValue: FieldValue): FieldValue {
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
export function useFields(
    initialValues?: Fields,
    normalizer?: NormalizerHandler,
): UseFieldsHook {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
        resetValues: _,
        setValues,
        setValue: setGenericValue,
        ...resetableValues
    } = useGenericValues(initialValues);
    const setValue = useMemo(() => {
        if (typeof normalizer === "function") {
            return (name: string, value: FieldValue, eventTarget?: EventTarget | null): void => {
                setValues((currentValues: Fields): Fields => {
                    return {
                        ...currentValues,
                        [name]: normalizer({ name, value, currentValues, eventTarget }),
                    };
                });
            };
        } else {
            return setGenericValue;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
    return { ...resetableValues, setValues, resetValues, setValue };
}
