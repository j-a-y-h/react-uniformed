import { useCallback } from "react";
import { useResetableValues, Values } from "./useResetableValues";
import { assert, LoggingTypes } from "./utils";

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

function assertErrorType(name: string, error: validErrorValues): void {
    assert.warning(
        typeof error === "string",
        LoggingTypes.typeError,
        `(expected: string, received: ${typeof error}) The validator for the input named (${name}) must return an empty string for valid values or a string containing the error description for invalid values.`,
    );
}

export function useErrors(): UseErrorsHook {
    const {
        setValue,
        setValues,
        values: errors,
        resetValues: resetErrors,
        hasValue: hasErrors,
    } = useResetableValues<validErrorValues>();
    const setError = useCallback((name: string, error: validErrorValues): void => {
        assertErrorType(name, error);
        setValue(name, error);
    }, [setValue]);
    const setErrors = useCallback((newErrors: Errors): void => {
        Object.keys(newErrors).forEach((name): void => {
            assertErrorType(name, newErrors[name]);
        });
        setValues(newErrors);
    }, [setValues]);
    return {
        errors, setError, resetErrors, hasErrors, setErrors,
    };
}
