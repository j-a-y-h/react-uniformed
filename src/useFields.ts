import { useResetableValues } from "./useResetableValues";

export interface Values {
    [name: string]: any;
}

export interface useFieldsHook {
    values: Values,
    setValue: (name: string, value: any) => void,
    resetValues: () => void
}

export function useFields(initialValues: Values = {}): useFieldsHook {
    return useResetableValues(initialValues);
}
