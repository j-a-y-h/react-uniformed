import React from "react";

export type submissionHandler = () => void | Promise<void>;
export type submitHandler = (event?: Event) => void;
export interface UseSubmissionProps {
    readonly isValidating: boolean;
    readonly hasErrors: boolean;
    readonly handler: submissionHandler;
    readonly validator: () => void;
}

export interface UseSubmissionHook {
    readonly isSubmitting: boolean;
    readonly submitCount: number;
    readonly submit: submitHandler;
}

export function useSubmission({
    isValidating,
    hasErrors,
    validator,
    // async handlers should return promises
    handler,
}: UseSubmissionProps): UseSubmissionHook {
    const [isSubmitting, setSubmitting] = React.useState(false);
    const [submitCount, setSubmitCount] = React.useState(0);
    const [waitForValidation, setWaitForValidation] = React.useState(false);
    const [runningSubmitHandler, setRunningSubmitHandler] = React.useState(false);
    const submit = React.useCallback((event?: Event): void => {
        if (event) {
            event.preventDefault();
        }
        setSubmitting(true);
        setSubmitCount((currentCount): number => currentCount + 1);
    }, []);
    const done = React.useCallback((): void => {
        setSubmitting(false);
        setRunningSubmitHandler(false);
        setWaitForValidation(false);
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
                        Promise.resolve(handler())
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
        waitForValidation, done, handler, validator,
    ]);
    return { isSubmitting: runningSubmitHandler, submitCount, submit };
}
