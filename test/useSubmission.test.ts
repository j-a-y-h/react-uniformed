import { renderHook, act } from 'react-hooks-testing-library';
import { useSubmission } from '../src';

describe("useSubmission", () => {
    it.todo("supports async validators");
    it.todo("supports async submit handlers");
    it.todo("doesn't allow invalid arguments");
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