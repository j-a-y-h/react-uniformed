import { renderHook, act } from '@testing-library/react-hooks';
import { useSubmission } from '../src';
import { UseSubmissionProps, UseSubmissionHook } from '../src/useSubmission';
import { SyntheticEvent } from 'react';

const sleep = (duration: number) => {
return new Promise<void>((res) => {
    setTimeout(() => {
        res();
    }, duration * 1000);
});
};
describe("useSubmission", () => {
    it.todo("doesn't allow invalid arguments");
    it.todo("supports async submit handlers");
    it("only submits if disabled is set to false", async () => {
        const onSubmit = jest.fn();
        const { result, rerender } = renderHook<UseSubmissionProps, UseSubmissionHook>(
            // @ts-ignore
            ({ disabled } = {}) => useSubmission({
                onSubmit,
                disabled,
            })
        );
        act(() => {
            result.current.submit();
        });
        expect(result.current.submitCount).toBe(1);
        expect(onSubmit.mock.calls.length).toBe(1);

        onSubmit.mockReset();
        rerender({ disabled: true, onSubmit });
        expect(result.current.submitCount).toBe(1);
        expect(onSubmit.mock.calls.length).toBe(0);
    });
    it("calls preventDefault when submitting", async () => {
        const { result } = renderHook(() => useSubmission({
            onSubmit: () => { },
        }));
        const preventDefault = jest.fn(() => { });
        act(() => {
            // @ts-ignore
            result.current.submit({ preventDefault });
        });
        expect(preventDefault.mock.calls.length).toBe(1);
    });
    it("supports a submission count", async () => {
        const { result } = renderHook(() => useSubmission({
            onSubmit: () => { },
        }));
        act(() => {
            result.current.submit();
        });
        act(() => {
            result.current.submit();
        });
        act(() => {
            result.current.submit();
        });
        expect(result.current.submitCount).toBe(3);
    });
    it("determines when submission is happening", async () => {
        let { result, waitForNextUpdate } = renderHook(() => useSubmission({
            onSubmit: () => sleep(0.250),
        }));
        expect(result.current.isSubmitting).toBe(false);
        act(() => {
            result.current.submit();
        });
        expect(result.current.isSubmitting).toBe(true);
        await waitForNextUpdate();
        expect(result.current.isSubmitting).toBe(false);
    });
    it("setFeedback sets submitFeedback.message", async () => {
        const { result } = renderHook(() => useSubmission({
            onSubmit: (_, { setFeedback }) => {
                setFeedback("TEST");
             },
        }));
        expect(result.current.submitFeedback.message).toBeUndefined();
        act(() => {
            result.current.submit();
        });
        expect(result.current.submitFeedback.message).toBe("TEST");
    });
    it("onSubmit's setError calls the specified setError function", async () => {
        const setError = jest.fn();
        const { result } = renderHook(() => useSubmission({
            setError,
            onSubmit: (_, { setError }) => {
                setError("TEST", "TESTING");
             },
        }));
        expect(setError).toBeCalledTimes(0);
        act(() => {
            result.current.submit();
        });
        expect(setError).toBeCalledTimes(1);
        expect(setError).toBeCalledWith("TEST", "TESTING");
    });
    it("onSubmit is called with an event object if submit was called with an event object", async () => {
        const test = {} as SyntheticEvent;
        let returnedEvent;
        const { result } = renderHook(() => useSubmission({
            onSubmit: (_, { event }) => {
                returnedEvent = event;
             },
        }));
        expect(returnedEvent).toBeUndefined();
        act(() => {
            result.current.submit(test);
        });
        expect(returnedEvent).toBe(test);
    });
});