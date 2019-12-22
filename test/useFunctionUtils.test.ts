import { renderHook, act } from '@testing-library/react-hooks';
import { useInvoking } from '../src/useFunctionUtils';

describe("useInvokeCount", () => {
    it("", () => { });
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
    it("supports async function", async () => {
        const { result, waitForNextUpdate } = renderHook(() => useInvoking(async () => { }));
        act(() => {
            result.current[0]();
        });
        expect(result.current[1]).toEqual(true);
        await waitForNextUpdate();
        expect(result.current[1]).toEqual(false);
    });
});
