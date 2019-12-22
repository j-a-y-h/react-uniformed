import { renderHook, act } from '@testing-library/react-hooks';
import { useSubmission } from '../src';

function sleep(timeout: number) {
    return new Promise((res) => {
        setTimeout(res, timeout);
    });
}

describe("useSubmission", () => {
    it.todo("doesn't allow invalid arguments");
    it("supports async validators", () => {
        const onSubmit = jest.fn(() => { });
        let { result, waitForNextUpdate } = renderHook(() => useSubmission({
            validator: async () => {
                await sleep(500);
                return { name: "test is an error" };
            },
            onSubmit,
        }));
        act(() => {
            result.current.submit();
        });
        waitForNextUpdate().then(() => {
            expect(result.current.submitCount).toBe(0);
            expect(onSubmit.mock.calls.length).toBe(0);
        });
        ({ result, waitForNextUpdate } = renderHook(() => useSubmission({
            validator: async () => {
                await sleep(500);
                return {};
            },
            onSubmit,
        })));
        act(() => {
            result.current.submit();
        });
        waitForNextUpdate().then(() => {
            expect(result.current.submitCount).toBe(1);
            expect(onSubmit.mock.calls.length).toBe(1);
        });
    });
    it.todo("supports async submit handlers");
    it("only submits after the form is error free", () => {
        const onSubmit = jest.fn(() => { });
        const { result, waitForNextUpdate } = renderHook(() => useSubmission({
            validator: () => ({ name: "this is an error" }),
            onSubmit,
        }));
        act(() => {
            result.current.submit();
            result.current.submit();
            result.current.submit();
            result.current.submit();
        });
        waitForNextUpdate().then(() => {
            expect(result.current.submitCount).toBe(0);
            expect(onSubmit.mock.calls.length).toBe(0);
        });
    });
    it("calls preventDefault when submitting", () => {
        const { result, waitForNextUpdate } = renderHook(() => useSubmission({
            validator: () => ({}),
            onSubmit: () => { },
        }));
        const preventDefault = jest.fn(() => { });
        act(() => {
            // @ts-ignore
            result.current.submit({ preventDefault });
        });
        waitForNextUpdate().then(() => {
            expect(preventDefault.mock.calls.length).toBe(1);
        });
    });
    it("supports a submission count", () => {
        const { result, waitForNextUpdate } = renderHook(() => useSubmission({
            validator: () => ({}),
            onSubmit: () => { },
        }));
        act(() => {
            result.current.submit();
            result.current.submit();
            result.current.submit();
            result.current.submit();
        });
        waitForNextUpdate().then(() => {
            expect(result.current.submitCount).toBe(4);
        });
    });
});