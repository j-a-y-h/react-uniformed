import { useResetableValues, Values } from "./useResetableValues";

export type Fields = Values<any>;
export type fieldHandler = (name: string, value: any) => void;
export interface useFieldsHook {
    readonly values: Fields;
    readonly setValue: fieldHandler;
    resetValues(): void;
}

export function useFields(initialValues: Fields = {}): useFieldsHook {
    return useResetableValues(initialValues);
}
