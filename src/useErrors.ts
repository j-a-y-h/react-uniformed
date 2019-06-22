import { useResetableValues } from "./useResetableValues";

export interface Errors {
    readonly [name: string]: string;
}

export interface useErrorsHook {
    readonly errors: Errors,
    setError(name: string, error: string): void,
    resetErrors(): void
}

export function useErrors(): useErrorsHook {
    const {values, setValue, resetValues} = useResetableValues<string>({});
    return {
        errors: values,
        setError: setValue,
        resetErrors: resetValues,
    }
}
