import React, {Reducer} from "react";
import { validErrorValues } from "./useErrors";
import { Fields } from "./useFields";
import { Values } from "./useResetableValues";

enum ActionTypes {
    validating, none, resetAll, waitingForValidator
}
type validValidorReturnTypes = validErrorValues | Promise<validErrorValues>;
interface InternalValidationState {
    readonly state: ActionTypes;
    readonly results?: validValidorReturnTypes;
}
interface ActionPayload {
    readonly name: string;
    readonly results?: validValidorReturnTypes;
}
interface Action {
    readonly type: ActionTypes;
    readonly payload?: ActionPayload;
}
type InternalValidationStateMap = Values<InternalValidationState>;
type ValidationStateMap = Values<boolean>;
type validationCallback = (name: string, value: validErrorValues) => void;
type ValidationReducer = Reducer<InternalValidationStateMap, Action>;
export type validator = (value: string) => validValidorReturnTypes;
export type Validators = Values<validator>;
export type validateHandler = (name: string, value: any) => void; 
export type validateAllHandler = (valuesMap: Fields) => void;
interface useValidationHook {
    readonly isValidating: boolean; 
    readonly validationState: ValidationStateMap;
    readonly validate: validateHandler;
    readonly validateAll: validateAllHandler; 
    stopValidating(): void;
}

function validatingReducer(validationStateMap: InternalValidationStateMap, action: Action): InternalValidationStateMap {
    const {name, results} = action.payload || {} as ActionPayload;
    switch (action.type) {
        case ActionTypes.none:
        case ActionTypes.waitingForValidator:
            return {...validationStateMap, [name]: {
                state: action.type,
            }}
        case ActionTypes.validating:
            return {...validationStateMap, [name]: {
                state: action.type,
                results,
            }}
        case ActionTypes.resetAll:
            return {};
        default:
            throw new Error();
    }
}

function isInValidationState(state?: InternalValidationState): boolean {
    return !!state && (
        state.state === ActionTypes.validating ||
        state.state === ActionTypes.waitingForValidator
    );
}

// TODO: all methods returned in all api should return void
export function useValidation(
    onValidate: validationCallback, 
    validators: Validators
): useValidationHook {
    const [validating, dispatchValidating] = React.useReducer<ValidationReducer>(
        validatingReducer, {}
    );
    const validate = React.useMemo(() => (name: string, value: any) => {
        // note: validator defaults to no validation
        const validator = validators[name] || (() => false);
        // validate
        dispatchValidating({
            type: ActionTypes.validating, 
            payload: { name, results: validator(value) }
        });
    }, []);
    const validateAll = React.useMemo(() => (values: Fields) => {
        // I need a way to call a function after validation
        Object.keys(values).forEach((valueKey) => {
            const value = values[valueKey];
            validate(valueKey, value);
        });
    }, []);
    // maps names or keys to the current validation state
    const validationState: ValidationStateMap = React.useMemo(() => (
        Object.keys(validating).reduce((accState, key) => {
            accState[key] = isInValidationState(validating[key]);
            return accState;
        }, {} as {[key: string]: boolean})
    ), [validating]);
    // determines if we are validating any input
    const isValidating = React.useMemo(() => (
        Object.keys(validationState).some((key) => validationState[key])
    ), [validationState]);
    const stopValidating = React.useMemo(() => () => {
        dispatchValidating({ type: ActionTypes.resetAll });
    }, []);
    React.useEffect(() => {
        Object.keys(validating).forEach((name) => {
            const {results, state} = validating[name];
            if (state === ActionTypes.validating) {
                // after validation
                const errorCallback = (error: validErrorValues) => {
                    onValidate(name, error);
                };
                Promise.resolve(results as validErrorValues)
                .then(errorCallback, (error: string = "Unexpected error") => {
                    errorCallback(String(error));
                })
                .finally(() => {
                    // done validating
                    dispatchValidating({ 
                        type: ActionTypes.none,
                        payload: { name }
                    });
                });
                // waitingForValidation
                dispatchValidating({
                    type: ActionTypes.waitingForValidator,
                    payload: { name }
                });
            }
        });
    }, [validating]);
    return {validate, validateAll, isValidating, validationState, stopValidating};
}
