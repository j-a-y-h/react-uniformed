import React, { useCallback } from "react";
import { Errors, errorHandler } from "./useErrors";
import { useHandlers } from "./useHandlers";
import { useFields } from "./useFields";
import { useTouch, Touches, touchHandler } from "./useTouch";
import { useSubmission, submissionHandler, submitHandler } from "./useSubmission";
import {
    useValidation, Validators, validateHandler, validateAllHandler, singleValidator,
} from "./useValidation";
import { Values, setValueCallback } from "./useResetableValues";

export interface UseFormsHook {
    readonly errors: Errors;
    readonly hasErrors: boolean;
    readonly isSubmitting: boolean;
    readonly values: Values<string>;
    readonly setError: errorHandler;
    readonly setTouch: touchHandler;
    readonly setValue: setValueCallback<string>;
    readonly submitCount: number;
    readonly submit: submitHandler;
    readonly touches: Touches;
    readonly validate: validateHandler<string>;
    readonly validateAll: validateAllHandler<string>;
    readonly reset: () => void;
}
interface UseFormParameters {
    readonly defaultValues?: Values<string>;
    readonly validators: Validators | singleValidator<string>;
    readonly onSubmit: (values: Values<string>) => void | Promise<void>;
}

// useHandlers(validateAll, onSubmit)
export function useForm({ defaultValues, validators, onSubmit }: UseFormParameters): UseFormsHook {
    const { values, setValue, resetValues } = useFields(defaultValues);
    const { touches, resetTouches, setTouch } = useTouch();
    // I want to decouple validator from use form
    const {
        validate, validateAll, isValidating, errors, resetErrors, setError, hasErrors,
    } = useValidation(validators);
    const validator = useCallback((): void => validateAll(values), [values, validateAll]);
    const reset = useHandlers(resetValues, resetErrors, resetTouches);
    const submissionHandler: submissionHandler = React.useCallback(async (): Promise<void> => {
        // note: give the handler every value so that we don't have to worry about
        // it later
        await onSubmit(values);
        reset();
    }, [onSubmit, values, reset]);
    const { isSubmitting, submit, submitCount } = useSubmission({
        hasErrors, isValidating, onSubmit: submissionHandler, validator,
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
        submitCount,
    };
}
