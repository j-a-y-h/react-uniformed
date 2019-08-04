import React from "react";
import {
    validErrorValues, Errors, useErrors, errorHandler,
} from "./useErrors";
import { Values, useResetableValues } from "./useResetableValues";

type validValidorReturnTypes = validErrorValues | Promise<validErrorValues>;
type validSingleValidatorReturnTypes = Errors | Promise<Errors>;

export type singleValidator<T> = (values: Values<T>) => validSingleValidatorReturnTypes;
export type validator = (value?: string) => validValidorReturnTypes;
export type Validators = Values<validator>;
export type validateHandler<T> = (name: string, value: T) => void;
export type validateAllHandler<T> = (valuesMap: Values<T>) => void;
interface UseValidatorHook<T> {
    readonly errors: Errors;
    readonly hasErrors: boolean;
    readonly setError: errorHandler;
    readonly validate: validateHandler<T>;
    readonly validateAll: validateAllHandler<T>;
    readonly isValidating: boolean;
    readonly resetErrors: () => void;
}

// TODO: consist naming conventaiton for return functions. ie (handleSubmit, onSubmit)
// TODO: all methods should accept one param that is an object
// TODO: all methods returned in all api should return void
// TODO: look into supporting touch state
// TODO: cross validation. how to validate with reference to other values
export function useValidation(
    validator: Validators | singleValidator<string>,
    requiredFields?: string[],
): UseValidatorHook<string> {
    const {
        setError, errors, hasErrors, resetErrors, setErrors,
    } = useErrors();
    // this is empty if the user passes singleValidator
    const fieldsToUseInValidateAll = React.useMemo(
        () => requiredFields || ((typeof validator === "function") ? [] : Object.keys(validator)),
        [validator, requiredFields]
    );
    const { setValue: setValidationState, hasValue: isValidating } = useResetableValues();
    // create a validation function
    const validate = React.useCallback((name: string, value: string): void => {
        setValidationState(name, true);
        if (typeof validator === "function") {
            Promise.resolve(validator({ [name]: value })).then((localErrors = {}): void => {
                setError(name, localErrors[name]);
                setValidationState(name, false);
            });
        } else {
            const handler = validator[name] || ((): string => "");
            Promise.resolve(handler(value)).then((error): void => {
                setError(name, error);
                setValidationState(name, false);
            });
        }
    }, [setError, setValidationState, validator]);
    // create validate all function
    const validateAll = React.useCallback((values: Values<string>): void => {
        const names = [...Object.keys(values), ...fieldsToUseInValidateAll];
        const setAllValidationState = (state: boolean): void => {
            names.forEach((name): void => {
                setValidationState(name, state);
            });
        };
        setAllValidationState(true);
        if (typeof validator === "function") {
            Promise.resolve(validator(values)).then((localErrors): void => {
                setErrors(localErrors);
                setAllValidationState(false);
            });
        } else {
            names.forEach((name): void => {
                const value = values[name];
                // note: this can probably be more efficient if we do setErrors one time
                validate(name, value);
            });
        }
    }, [validator, setValidationState, setErrors, validate, fieldsToUseInValidateAll]);
    return {
        validateAll, validate, errors, hasErrors, resetErrors, setError, isValidating,
    };
}
