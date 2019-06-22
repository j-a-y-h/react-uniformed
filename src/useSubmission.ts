import React from "react";

export type submissionHandler = (done: () => void) => void;
export type submitHandler = (event?: Event) => void;
export interface useSubmissionProps {
    readonly isValidating: boolean;
    readonly hasErrors: boolean;
    readonly handler: submissionHandler;
    validator(): void;
}

export interface useSubmissionHook {
    readonly isSubmitting: boolean;
    readonly submitCount: number;
    readonly submit: submitHandler;
}

export function useSubmission({
    isValidating,
    hasErrors,
    validator,
    handler,
}: useSubmissionProps): useSubmissionHook {
    const [isSubmitting, setSubmitting] = React.useState(false);
    const [submitCount, setSubmitCount] = React.useState(0);
    const [waitForValidation, setWaitForValidation] = React.useState(false);
    const [runningSubmitHandler, setRunningSubmitHandler] = React.useState(false);
    // TODO: check if useState update functions allow callback function as second argument
    const submit = React.useMemo(() => (event?: Event) => {
        if (event) {
            event.preventDefault();
        }
        setSubmitting(true)
        setSubmitCount(currentCount => currentCount + 1);
    }, []);
    const done = React.useMemo(() => () => {
        setSubmitting(false);
        setRunningSubmitHandler(false);
        setWaitForValidation(false);
    }, []);
    React.useEffect(() => {
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
                        handler(done);
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
    }, [hasErrors, isValidating, isSubmitting, runningSubmitHandler, waitForValidation]);
    return {isSubmitting: runningSubmitHandler, submitCount, submit};
}