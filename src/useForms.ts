import { useCallback } from "react";
import { Errors, ErrorHandler } from "./useErrors";
import { useHandlers } from "./useHandlers";
import { useFields } from "./useFields";
import {
    useTouch, Touches, TouchHandler, TouchFieldHandler,
} from "./useTouch";
import { useSubmission, SubmissionHandler, SubmitHandler } from "./useSubmission";
import {
    useValidation,
    Validators,
    ValidateHandler,
    ValidateAllHandler,
    SingleValidator,
    userSuppliedValue,
} from "./useValidation";
import {
    Values, SetValueCallback, MutableValues, PartialValues,
} from "./useResetableValues";

export interface UseFormsHook {
    readonly errors: Errors | PartialValues<Validators, Error>;
    readonly hasErrors: boolean;
    readonly isSubmitting: boolean;
    readonly values: Values<userSuppliedValue>;
    readonly setError: ErrorHandler;
    readonly setTouch: TouchHandler;
    readonly touchField: TouchFieldHandler;
    readonly setValue: SetValueCallback<userSuppliedValue>;
    readonly submitCount: number;
    readonly submit: SubmitHandler;
    readonly touches: Touches;
    readonly validateByName: ValidateHandler<userSuppliedValue>;
    readonly validate: ValidateAllHandler<userSuppliedValue>;
    readonly reset: () => void;
}
interface UseFormParameters {
    readonly defaultValues?: Values<userSuppliedValue>;
    readonly validators?: Validators | SingleValidator<userSuppliedValue>;
    readonly onSubmit: (values: Values<userSuppliedValue>) => void | Promise<void>;
}

// useHandlers(validateAll, onSubmit)
export function useForm({
    defaultValues, validators = {}, onSubmit,
}: UseFormParameters): UseFormsHook {
    const { values, setValue, resetValues } = useFields(defaultValues);
    const {
        touches, resetTouches, setTouch, touchField, setTouches,
    } = useTouch();
    // I want to decouple validator from use form
    const {
        validate, validateByName, errors, resetErrors, setError, hasErrors,
    } = useValidation(validators);
    const submissionValidator = useCallback(async (): Promise<Errors> => {
        const validationErrors = await validate(values);
        const newTouches = Object.keys(validationErrors).reduce((
            _touches: MutableValues<boolean>, name,
        ): Touches => {
            // eslint-disable-next-line no-param-reassign
            _touches[name] = true;
            return _touches;
        }, {});
        setTouches(newTouches);
        return validationErrors;
    }, [validate, values, setTouches]);
    const reset = useHandlers(resetValues, resetErrors, resetTouches);
    const handleSubmit: SubmissionHandler = useCallback(async (): Promise<void> => {
        // note: give the handler every value so that we don't have to worry about
        // it later
        await onSubmit(values);
        reset();
    }, [onSubmit, values, reset]);
    const { isSubmitting, submit, submitCount } = useSubmission({
        onSubmit: handleSubmit,
        validator: submissionValidator,
    });
    return {
        values,
        touches,
        errors,
        hasErrors,
        touchField,
        setTouch,
        setError,
        setValue,
        reset,
        validateByName,
        validate,
        isSubmitting,
        submit,
        submitCount,
    };
}
