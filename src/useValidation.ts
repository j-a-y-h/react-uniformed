import { useCallback, useMemo } from "react";
import {
    validErrorValues, Errors, useErrors, errorHandler,
} from "./useErrors";
import { Values, useResetableValues, MutableValues } from "./useResetableValues";

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
    return useMemo((): string[] => requiredFields || ((typeof validator === "function") ? [] : Object.keys(validator)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
        []);
}

export async function validateValidators(
    names: string[], validators: Validators, values: Values<string>,
): Promise<Errors> {
    const errorsPromiseMap = names
        .map(async (name): Promise<[string, validValidatorReturnTypes]> => {
            const handler = validators[name] || ((): validValidatorReturnTypes => "");
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
    const validateByName = useCallback(async (
        name: string, value: string,
    ): Promise<validErrorValues> => {
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
    const validate = useCallback(async (values: Values<string>): Promise<Errors> => {
        const names = [...Object.keys(values), ...fieldsToUseInValidateAll];
        const setAllValidationState = (state: boolean): void => {
            names.forEach((name): void => {
                setValidationState(name, state);
            });
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
