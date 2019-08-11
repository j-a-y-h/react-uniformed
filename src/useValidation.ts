import { useCallback, useMemo } from "react";
import {
    validErrorValues, Errors, useErrors, ErrorHandler,
} from "./useErrors";
import { Values, useResetableValues, MutableValues } from "./useResetableValues";
import { assert, LoggingTypes } from "./utils";

type validValidatorReturnTypes = validErrorValues | Promise<validErrorValues>;
type validSingleValidatorReturnTypes = Errors | Promise<Errors>;

export interface SingleValidator<T> {
    (values: Values<T>): validSingleValidatorReturnTypes;
}
export interface Validator {
    (value?: string): validValidatorReturnTypes;
}
export type Validators = Values<Validator>;
export interface ValidateHandler<T> {
    (name: string, value: T): Promise<validErrorValues>;
}
export interface ValidateAllHandler<T> {
    (valuesMap: Values<T>): Promise<Errors>;
}
interface UseValidatorHook<T> {
    readonly errors: Errors;
    readonly hasErrors: boolean;
    readonly setError: ErrorHandler;
    readonly validateByName: ValidateHandler<T>;
    readonly validate: ValidateAllHandler<T>;
    readonly isValidating: boolean;
    readonly resetErrors: () => void;
}

function defaultValidator(): validValidatorReturnTypes {
    return "";
}

function useValidationFieldNames(
    validator: Validators | SingleValidator<string>,
    expectedFields?: string[],
): string[] {
    return useMemo((): string[] => expectedFields || ((typeof validator === "function") ? [] : Object.keys(validator)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
        []);
}

function assertValidator(functionName: string, name: string, validator: Function): void {
    assert.error(
        typeof validator === "function",
        LoggingTypes.typeError,
        // note: received is any bc we don't know what the validator is
        // as the input could have defaulted to the defaultValidator
        `(expect: function, received: any) ${functionName} expects the validator with the name (${name}) to be a function.`,
    );
}

export async function validateValidators(
    names: string[], validators: Validators, values: Values<string>,
): Promise<Errors> {
    const errorsPromiseMap = names
        .map(async (name): Promise<[string, validValidatorReturnTypes]> => {
            const handler = validators[name] || defaultValidator;
            assertValidator(validateValidators.name, name, handler);
            const currentErrors = await handler(values[name]);
            return [name, currentErrors];
        });
    const errorsMap = await Promise.all(errorsPromiseMap);
    return errorsMap.reduce((
        objectMap: MutableValues<validValidatorReturnTypes>, [name, error],
    ): Errors => {
        // eslint-disable-next-line no-param-reassign
        objectMap[name] = error;
        return objectMap as Errors;
    }, {});
}

export function useValidation(
    validator: Validators | SingleValidator<string> = {},
    expectedFields?: string[],
): UseValidatorHook<string> {
    const {
        setError, errors, hasErrors, resetErrors, setErrors,
    } = useErrors();
    // this is empty if the user passes singleValidator
    const fieldsToUseInValidateAll = useValidationFieldNames(validator, expectedFields);
    const {
        setValue: setValidationState,
        hasValue: isValidating,
        setValues: setValidationStates,
    } = useResetableValues();
    // create a validate by input name function
    const validateByName = useCallback(async (
        name: string, value: string,
    ): Promise<validErrorValues> => {
        let error: validErrorValues;
        setValidationState(name, true);
        if (typeof validator === "function") {
            const localErrors = await validator({ [name]: value });
            error = localErrors[name] || "";
        } else {
            const handler = validator[name] || defaultValidator;
            assertValidator(useValidation.name, name, handler);
            error = await handler(value) || "";
        }
        setError(name, error);
        setValidationState(name, false);
        return error;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setError, setValidationState, validator]);

    // create validate all function
    const validate = useCallback(async (values: Values<string>): Promise<Errors> => {
        const names = [...Object.keys(values), ...fieldsToUseInValidateAll];
        const setAllValidationState = (state: boolean): void => {
            const allStates = names.reduce((
                states: MutableValues<boolean>, name,
            ): Values<boolean> => {
                // eslint-disable-next-line no-param-reassign
                states[name] = state;
                return states;
            }, {});
            setValidationStates(allStates);
        };
        setAllValidationState(true);
        let localErrors: Errors;
        if (typeof validator === "function") {
            localErrors = await validator(values);
        } else {
            localErrors = await validateValidators(names, validator, values);
        }
        setErrors(localErrors);
        setAllValidationState(false);
        return localErrors;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setValidationState, setErrors, fieldsToUseInValidateAll, validator]);
    return {
        validate, validateByName, errors, hasErrors, resetErrors, setError, isValidating,
    };
}
