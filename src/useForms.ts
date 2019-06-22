import React from "react";
import {useValidation, validator, validateHandler, validateAllHandler} from "./useValidation";
import {useErrors, Errors, errorHandler} from "./useErrors";
import {useHandlers} from "./useHandlers";
import { useFields, Fields, fieldHandler } from "./useFields";
import { useTouch, Touches, touchHandler } from "./useTouch";
import { useSubmission, submissionHandler, submitHandler } from "./useSubmission";

export interface useFormsHook {
    readonly errors: Errors;
    readonly hasErrors: boolean;
    readonly isSubmitting: boolean; 
    readonly values: Fields;
    readonly setError: errorHandler;
    readonly setTouch: touchHandler;
    readonly setValue: fieldHandler;
    readonly submitCount: number;
    readonly submit: submitHandler;
    readonly touches: Touches;
    readonly validate: validateHandler;
    readonly validateAll: validateAllHandler; 
    reset(): void;
}
interface FormFields {
    readonly [name: string]: {
        readonly value: any;
        readonly validator: validator;
    }
}

interface onSubmitProps {
    readonly done: submissionHandler;
    readonly touches: Touches;
    readonly errors: Errors;
    readonly hasErrors: boolean;
    reset(): void;
}

export function useForm(
    fields: FormFields, 
    onSubmit: (values: FormFields, submitHelpers: onSubmitProps) => void
): useFormsHook {
    const {initialValues, validators} = React.useMemo(() => {
        const initialReducerValue: any = {initialValues: {}, validators: {}};
        return Object.keys(fields).reduce((obj, key) => {
            const {value = "", validator} = fields[key];
            obj.initialValues[key] = value;
            obj.validators[key] = validator;
            return obj;
        }, initialReducerValue);
    }, [fields]);
    const {values, setValue, resetValues} = useFields(initialValues);
    const {touches, touchField, resetTouches, setTouch} = useTouch();
    const {errors, resetErrors, setError, hasErrors} = useErrors();
    const {validate, validateAll, isValidating, stopValidating} = useValidation(setError, validators);
    const reset = React.useMemo(
        () => useHandlers(resetValues, resetErrors, resetTouches, stopValidating),
        []
    );
    const handler: submissionHandler = React.useMemo(() => ((done) => {
        // note: give the handler every value so that we don't have to worry about
        // it later
        onSubmit(values, {touches, done, reset, errors, hasErrors});
    }), [touches, errors, hasErrors, values]);
    const {isSubmitting, submit, submitCount} = useSubmission({
        hasErrors, 
        isValidating,
        handler,
        validator: () => validateAll(values), 
    });
    return {
        values,
        touches,
        errors,
        hasErrors,
        setTouch,
        setError,
        setValue,
        reset,
        validate,
        validateAll,
        isSubmitting, 
        submit, 
        submitCount
    };
}
