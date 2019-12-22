import { renderHook, act } from '@testing-library/react-hooks';
import { useInvoking, useInvokeCount } from '../src/useFunctionUtils';

describe("useInvokeCount", () => {
    it("counts the number of times a function is invoked", () => {
        const { result } = renderHook(() => useInvokeCount(() => { }));
        act(() => {
            result.current[0]();
            result.current[0]();
            result.current[0]();
        });
        expect(result.current[1]).toEqual(3);
    });
    it("supports async functions", () => {
        const { result } = renderHook(() => useInvokeCount(async () => { }));
        act(() => {
            result.current[0]();
            result.current[0]();
            result.current[0]();
        });
        expect(result.current[1]).toEqual(3);
    });
});
describe("useInvoking", () => {
    it("supports sync function", async () => {
        const { result, waitForNextUpdate } = renderHook(() => useInvoking(() => { }));
        act(() => {
            result.current[0]();
        });
        expect(result.current[1]).toEqual(false);
        // @ts-ignore
        await waitForNextUpdate({
            timeout: 100,
        }).catch(() => {});
        expect(result.current[1]).toEqual(false);
    })
    it("determines if a function is being invoked", async () => {
        const { result, waitForNextUpdate } = renderHook(() => useInvoking(async () => { }));
        act(() => {
            result.current[0]();
        });
        expect(result.current[1]).toEqual(true);
        await waitForNextUpdate();
        expect(result.current[1]).toEqual(false);
    });
    it("turns state to false for rejected async functions", async () => {
        const { result, waitForNextUpdate } = renderHook(() => useInvoking(async () => {
            return Promise.reject();
         }));
        act(() => {
            result.current[0]().catch(() => {});
        });
        expect(result.current[1]).toEqual(true);
        // @ts-ignore
        await waitForNextUpdate({
            timeout: 100,
        });
        expect(result.current[1]).toEqual(false);
    });
});
