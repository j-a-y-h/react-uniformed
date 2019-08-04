import React from "react";
import { hasValue } from "./useResetableValues";
import { Errors } from "./useErrors";

export type submissionHandler = () => void | Promise<void>;
export type submitHandler = (event?: React.SyntheticEvent) => void;
export interface UseSubmissionProps {
    readonly onSubmit: submissionHandler;
    readonly validator: () => Promise<Errors> | Errors;
}

export interface UseSubmissionHook {
    readonly isSubmitting: boolean;
    readonly submitCount: number;
    readonly submit: submitHandler;
}

// async handlers should return promises
export function useSubmission({validator, onSubmit}: UseSubmissionProps): UseSubmissionHook {
    const [isSubmitting, setSubmitting] = React.useState(false);
    const [submitCount, setSubmitCount] = React.useState(0);
    const submit = React.useCallback(async (event?: React.SyntheticEvent): Promise<void> => {
        if (event) {
            event.preventDefault();
        }
        setSubmitting(true);
        const errors = await validator();
        if (!hasValue(errors)) {
            await onSubmit();
            setSubmitCount((currentCount): number => currentCount + 1);
        }
        setSubmitting(false);
    }, [validator, onSubmit]);
    return { isSubmitting, submitCount, submit };
}
