import { useResetableValues } from "./useResetableValues";

export interface Errors {
    [name: string]: string;
}

export interface useErrorsHook {
    errors: Errors,
    setError: (name: string, value: string) => void,
    resetErrors: () => void
}

export function useErrors(): useErrorsHook {
    const {values, setValue, resetValues} = useResetableValues<string>({});
    return {
        errors: values,
        setError: setValue,
        resetErrors: resetValues,
    }
}
