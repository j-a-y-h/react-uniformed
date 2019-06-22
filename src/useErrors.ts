import React from "react";
import { useResetableValues, Values } from "./useResetableValues";

export type validErrorValues = string;
export type Errors = Values<validErrorValues>;
export type errorHandler = (name: string, error: validErrorValues) => void;
export interface useErrorsHook {
    readonly errors: Errors;
    readonly hasErrors: boolean;
    readonly setError: errorHandler;
    resetErrors(): void;
}

export function useErrors(): useErrorsHook {
    const {
        values: errors, 
        setValue: setError, 
        resetValues: resetErrors,
    } = useResetableValues<validErrorValues>();
    const hasErrors = React.useMemo(() => (
        Object.keys(errors).some((key) => errors[key])
    ), [errors]);
    return { errors, setError, resetErrors, hasErrors };
}
