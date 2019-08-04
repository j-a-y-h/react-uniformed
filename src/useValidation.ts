import React from "react";
import {
    validErrorValues, Errors, useErrors, errorHandler,
} from "./useErrors";
import { Values, useResetableValues } from "./useResetableValues";

type validValidatorReturnTypes = validErrorValues | Promise<validErrorValues>;
type validSingleValidatorReturnTypes = Errors | Promise<Errors>;

export type singleValidator<T> = (values: Values<T>) => validSingleValidatorReturnTypes;
export type validator = (value?: string) => validValidatorReturnTypes;
export type Validators = Values<validator>;
export type validateHandler<T> = (name: string, value: T) => Promise<validErrorValues>;
export type validateAllHandler<T> = (valuesMap: Values<T>) => Promise<Errors>;
interface UseValidatorHook<T> {
    // TODO: jsdocs
    readonly errors: Errors;
    readonly hasErrors: boolean;
    readonly setError: errorHandler;
    readonly validateByName: validateHandler<T>;
    readonly validate: validateAllHandler<T>;
    readonly isValidating: boolean;
    readonly resetErrors: () => void;
}

function useValidationFieldNames(
    validator: Validators | singleValidator<string>, requiredFields?: string[],
): string[] {
    return React.useMemo((): string[] => requiredFields || ((typeof validator === "function") ? [] : Object.keys(validator)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
        []);
}

// TODO: consist naming conventaiton for return functions. ie (handleSubmit, onSubmit)
// TODO: all methods should accept one param that is an object
// TODO: all methods returned in all api should return void
// TODO: look into supporting touch state
export function useValidation(
    validator: Validators | singleValidator<string>,
    requiredFields?: string[],
): UseValidatorHook<string> {
    const {
        setError, errors, hasErrors, resetErrors, setErrors,
    } = useErrors();
    // this is empty if the user passes singleValidator
    const fieldsToUseInValidateAll = useValidationFieldNames(validator, requiredFields);
    const { setValue: setValidationState, hasValue: isValidating } = useResetableValues();
    // create a validation function
    const validateByName = React
        .useCallback(async (name: string, value: string): Promise<validErrorValues> => {
            let error: validErrorValues;
            setValidationState(name, true);
            if (typeof validator === "function") {
                const localErrors = await validator({ [name]: value });
                error = localErrors[name] || "";
            } else {
                const handler = validator[name] || ((): validValidatorReturnTypes => "");
                error = await handler(value) || "";
            }
            setError(name, error);
            setValidationState(name, false);
            return error;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [setError, setValidationState, validator]);

    // create validate all function
    // TODO: decouple values
    const validate = React.useCallback(async (values: Values<string>): Promise<Errors> => {
        const names = [...Object.keys(values), ...fieldsToUseInValidateAll];
        const setAllValidationState = (state: boolean): void => {
            names.forEach((name): void => {
                setValidationState(name, state);
            });
        };
        setAllValidationState(true);
        let localErrors: Values<string>;
        if (typeof validator === "function") {
            localErrors = await validator(values);
        } else {
            const errorsPromiseMap = names
                .map(async (name): Promise<[string, validValidatorReturnTypes]> => {
                    const handler = validator[name] || ((): validValidatorReturnTypes => "");
                    const currentErrors = await handler(values[name]);
                    return [name, currentErrors];
                });
            const errorsMap = await Promise.all(errorsPromiseMap);
            localErrors = errorsMap.reduce((objectMap, [name, error]): Errors => ({
                ...objectMap,
                [name]: error,
            }), {});
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
