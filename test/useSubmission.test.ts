import { renderHook, act } from 'react-hooks-testing-library';
import { useSubmission } from '../src';

function sleep(timeout: number) {
    return new Promise((res) => {
        setTimeout(res, timeout);
    });
}

describe("useSubmission", () => {
    it.todo("doesn't allow invalid arguments");
    it("supports async validators", async () => {
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
        await waitForNextUpdate().then(() => {
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
        await waitForNextUpdate().then(() => {
            expect(result.current.submitCount).toBe(1);
            expect(onSubmit.mock.calls.length).toBe(1);
        });
    });
    it.todo("supports async submit handlers");
    it("only submits after the form is error free", async () => {
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
        await waitForNextUpdate().then(() => {
            expect(result.current.submitCount).toBe(0);
            expect(onSubmit.mock.calls.length).toBe(0);
        });
    });
    it("calls preventDefault when submitting", async () => {
        const { result, waitForNextUpdate } = renderHook(() => useSubmission({
            validator: () => ({}),
            onSubmit: () => { },
        }));
        const preventDefault = jest.fn(() => { });
        act(() => {
            // @ts-ignore
            result.current.submit({ preventDefault });
        });
        await waitForNextUpdate().then(() => {
            expect(preventDefault.mock.calls.length).toBe(1);
        });
    });
    it("supports a submission count", async () => {
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
        await waitForNextUpdate().then(() => {
            expect(result.current.submitCount).toBe(4);
        });
    });
});