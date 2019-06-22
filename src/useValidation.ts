import React, {Reducer} from "react";

enum ActionTypes {
    validating, none, reset, waitingForValidator
}
type validValidationValues = string | false | null | undefined;
type validValidorReturnTypes = validValidationValues | Promise<validValidationValues>;
type validationCallback = (name: string, value: validValidationValues) => void;
type validator = (value: string) => validValidorReturnTypes;
interface InternalValidationState {
    readonly state: ActionTypes;
    readonly results?: validValidorReturnTypes;
    readonly waitingForValidator?: boolean;
}
interface InternalValidationStateMap {
    readonly [name: string]: InternalValidationState;
}
interface ValidationStateMap {
    readonly [name: string]: ActionTypes;
}
// TODO: use extends
interface ActionPayload {
    readonly name: string;
    readonly results?: validValidorReturnTypes;
}
interface Action {
    readonly type: ActionTypes;
    readonly payload?: ActionPayload;
}

interface Validators {
    readonly [name: string]: validator;
}
interface Values {
    readonly [name: string]: any;
}
interface useValidationHook {
    readonly isValidating: boolean; 
    readonly validationState: ValidationStateMap;
    validate(name: string, value: any): void; 
    validateAll(valuesMap: Values): void; 
}
type ValidationReducer = Reducer<InternalValidationStateMap, Action>;

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
        case ActionTypes.reset:
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
    // TODO: probably should add touches to the last arg
    const validate = React.useMemo(() => (name: string, value: any) => {
        // note: validator defaults to no validation
        const validator = validators[name] || (() => false);
        // validate
        dispatchValidating({
            type: ActionTypes.validating, 
            payload: { name, results: validator(value) }
        });
    }, []);
    // TODO: probably should add touches to the last arg
    const validateAll = React.useMemo(() => (values: any) => {
        // I need a way to call a function after validation
        Object.keys(values).forEach((valueKey) => {
            const value = values[valueKey];
            validate(valueKey, value);
        });
    }, []);
    // maps names or keys to the current validation state
    const validationState: ValidationStateMap = React.useMemo(() => (
        Object.keys(validating).reduce((accState, key) => {
            const {state = ActionTypes.none} = validating[key];
            accState[key] = state;
            return accState;
        }, {} as {[key: string]: ActionTypes})
    ), [validating]);
    // determines if we are doing validation
    const isValidating = React.useMemo(() => (
        Object.keys(validating).some((key) => isInValidationState(validating[key]))
    ), [validating]);
    React.useEffect(() => {
        Object.keys(validating).forEach((name) => {
            const {results, state} = validating[name];
            if (state === ActionTypes.validating) {
                // after validation
                const errorCallback = (error: validValidationValues) => {
                    onValidate(name, error);
                };
                Promise.resolve(results)
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
    return {validate, validateAll, isValidating, validationState};
}
