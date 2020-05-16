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
    it("only submits if disabled is set to false", () => {
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
    it("calls preventDefault when submitting", () => {
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
    it("supports a submission count", () => {
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
    it("setFeedback sets submitFeedback.message", () => {
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
    it("onSubmit's setError calls the specified setError function", () => {
        const setError = jest.fn();
        const { result } = renderHook(() => useSubmission({
            setError,
            onSubmit: (_, { setError }) => {
                setError("TEST", "TESTING");
             },
        }));
        expect(setError).not.toBeCalled();
        act(() => {
            result.current.submit();
        });
        expect(setError).toBeCalledTimes(1);
        expect(setError).toBeCalledWith("TEST", "TESTING");
    });
    it("onSubmit is called with an event object if submit was called with an event object", () => {
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
        act(() => {
            result.current.submit();
        });
        expect(returnedEvent).toBeUndefined();
    });
    describe.each([
        ['throws an error', () => { throw "TEST" }, 'TEST'],
        ['returns Promise.reject', () => Promise.reject("HARRY"), 'HARRY'],
    ])("when onSubmit %s", (_, onSubmit, TEST_VARIABLE) => {
        it("doesn't call reset", () => {
            const reset = jest.fn();
            const { result } = renderHook(() => useSubmission({ reset, onSubmit }));
            expect(reset).not.toBeCalled();
            act(() => {
                result.current.submit();
            });
            expect(reset).not.toBeCalled();
        });
        it("sets submitFeedback.error", async () => {
            const { result, wait } = renderHook(() => useSubmission({ onSubmit }));
            expect(result.current.submitFeedback.error).toBeUndefined();
            act(() => {
                result.current.submit();
            });
            await wait(() => !result.current.isSubmitting);
            expect(result.current.submitFeedback.error).toBe(TEST_VARIABLE);
        });
    });
});