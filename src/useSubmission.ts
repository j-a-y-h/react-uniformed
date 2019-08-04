import React from "react";

export type submissionHandler = () => void | Promise<void>;
export type submitHandler = (event?: React.SyntheticEvent) => void;
export interface UseSubmissionProps {
    readonly isValidating: boolean;
    readonly hasErrors: boolean;
    readonly onSubmit: submissionHandler;
    readonly validator: () => void;
}

export interface UseSubmissionHook {
    readonly isSubmitting: boolean;
    readonly submitCount: number;
    readonly submit: submitHandler;
}

// async handlers should return promises
export function useSubmission({
    isValidating, hasErrors, validator, onSubmit,
}: UseSubmissionProps): UseSubmissionHook {
    const [isSubmitting, setSubmitting] = React.useState(false);
    const [submitCount, setSubmitCount] = React.useState(0);
    const [waitForValidation, setWaitForValidation] = React.useState(false);
    const [runningSubmitHandler, setRunningSubmitHandler] = React.useState(false);
    const submit = React.useCallback((event?: React.SyntheticEvent): void => {
        if (event) {
            event.preventDefault();
        }
        setSubmitting(true);
    }, []);
    const done = React.useCallback((): void => {
        setSubmitting(false);
        setRunningSubmitHandler(false);
        setWaitForValidation(false);
        setSubmitCount((currentCount): number => currentCount + 1);
    }, []);
    React.useEffect((): void => {
        if (isSubmitting) {
            if (waitForValidation) {
                // waiting for validation
                if (!isValidating) {
                    // done validating
                    if (hasErrors) {
                        // abort
                        done();
                    } else {
                        // submit
                        setRunningSubmitHandler(true);
                        setWaitForValidation(false);
                        // note: handler cannot read states inside this function
                        Promise.resolve(onSubmit())
                            .then(done, done);
                    }
                }
            } else if (!runningSubmitHandler) {
                // start validation
                setWaitForValidation(true);
                // always validate bc user can click submit without touching anything
                // which would result in no initial validation
                validator();
            }
        }
    }, [
        hasErrors, isValidating, isSubmitting, runningSubmitHandler,
        waitForValidation, done, onSubmit, validator,
    ]);
    return { isSubmitting: runningSubmitHandler, submitCount, submit };
}
