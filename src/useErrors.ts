import { useResetableValues, Values } from "./useResetableValues";

export type validErrorValues = string;
export type Errors = Values<validErrorValues>;
export interface ErrorHandler {
    (name: string, error: validErrorValues): void;
}
export interface UseErrorsHook {
    readonly errors: Errors;
    readonly hasErrors: boolean;
    readonly setError: ErrorHandler;
    readonly setErrors: (errors: Errors) => void;
    readonly resetErrors: () => void;
}

export function useErrors(): UseErrorsHook {
    const {
        values: errors,
        setValue: setError,
        resetValues: resetErrors,
        setValues: setErrors,
        hasValue: hasErrors,
    } = useResetableValues<validErrorValues>();
    return {
        errors, setError, resetErrors, hasErrors, setErrors,
    };
}
