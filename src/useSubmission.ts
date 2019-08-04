import { useState, useCallback, SyntheticEvent } from "react";
import { hasValue } from "./useResetableValues";
import { Errors } from "./useErrors";

export type submissionHandler = () => void | Promise<void>;
export type submitHandler = (event?: SyntheticEvent) => void;
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
export function useSubmission({ validator, onSubmit }: UseSubmissionProps): UseSubmissionHook {
    const [isSubmitting, setSubmitting] = useState(false);
    const [submitCount, setSubmitCount] = useState(0);
    const submit = useCallback(async (event?: SyntheticEvent): Promise<void> => {
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
