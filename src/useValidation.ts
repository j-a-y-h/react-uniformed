import { useCallback, useMemo } from "react";
import {
    validErrorValues, Errors, useErrors, ErrorHandler,
} from "./useErrors";
import {
    Values, useGenericValues, MutableValues, PartialValues,
} from "./useGenericValues";
import { assert, LoggingTypes } from "./utils";
import { userSuppliedValue, Fields } from "./useFields";

type validValidatorReturnTypes = validErrorValues | Promise<validErrorValues>;
type validSingleValidatorReturnTypes = Errors | Promise<Errors>;
export interface SingleValidator<T> {
    (values: Values<T>): validSingleValidatorReturnTypes;
}
export interface Validator {
    (value?: userSuppliedValue): validValidatorReturnTypes;
}
export type Validators = Values<Validator>;
export interface ValidateHandler<T, K = string> {
    (name: K, value: T): Promise<validErrorValues>;
}
export interface ValidateAllHandler<T, K = Values<T>> {
    (valuesMap: K): Promise<Errors>;
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
interface UseValidatorHookPartial<T, K> {
    readonly errors: PartialValues<K, Error>;
    readonly hasErrors: boolean;
    readonly setError: ErrorHandler<keyof K>;
    readonly validateByName: ValidateHandler<T, keyof K>;
    readonly validate: ValidateAllHandler<T, PartialValues<K, T>>;
    readonly isValidating: boolean;
    readonly resetErrors: () => void;
}

function defaultValidator(): validValidatorReturnTypes {
    return "";
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
    names: string[], validators: Validators, values: Fields,
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
    validator: SingleValidator<userSuppliedValue>
): UseValidatorHook<userSuppliedValue>;

export function useValidation<T extends Validators>(
    validator: T
): UseValidatorHookPartial<userSuppliedValue, T>;

export function useValidation<T extends Validators>(
    validator: T | SingleValidator<userSuppliedValue>
): UseValidatorHookPartial<userSuppliedValue, T> | UseValidatorHook<userSuppliedValue>;

/**
 * A hook for performing validation.
 *
 * @param validator A validation map or a validation function.
 * @return returns an useValidation object
 *
 * @example
 *
 * // validate using validation maps
 * const {validateByName, errors} = useValidation({
 *     name: (value) => value ? "" : "name is required!",
 *     email: (value) => value ? "" : "email is required!"
 * });
 *
 * // "email is required!"
 * await validateByName("email", "");
 * // {email: "email is required!"}
 * console.log(errors);
 *
 * // validate with one validation function
 * const {errors, validate} = useValidation((values) => {
 *     const errors = {name: "", email: ""};
 *     if (!values.name) {
 *         errors.name = "name is required!";
 *     }
 *     if (!values.email) {
 *         errors.email = "email is required!";
 *     }
 *     return errors;
 * });
 *
 * // {name: "", email: "email is required!"}
 * await validate({name: "John"});
 * // {name: "", email: "email is required!"}
 * console.log(errors);
 */
export function useValidation(
    validator: Validators | SingleValidator<userSuppliedValue>,
): UseValidatorHookPartial<userSuppliedValue, Validators> | UseValidatorHook<userSuppliedValue> {
    const {
        setError, errors, hasErrors, resetErrors, setErrors,
    } = useErrors();
    const fieldsToUseInValidateAll = useMemo((): string[] => (
        (!validator || typeof validator === "function") ? [] : Object.keys(validator)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);
    const {
        setValue: setValidationState,
        hasValue: isValidating,
        setValues: setValidationStates,
    } = useGenericValues();
    // create a validate by input name function
    const validateByName = useCallback(async (
        name: string, value: userSuppliedValue,
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
    const validate = useCallback(async (values: Fields): Promise<Errors> => {
        const names = Array.from(new Set([...Object.keys(values), ...fieldsToUseInValidateAll]));
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
