import { renderHook, act } from 'react-hooks-testing-library';
import { useTouch } from '../src';

describe("useTouch", () => {
    it("API only supports values, setValue, resetValues, setValues, touchField", () => {
        const { result } = renderHook(() => useTouch());
        const { current } = result;
        expect(typeof current.setTouch).toEqual("function");
        expect(typeof current.resetTouches).toEqual("function");
        expect(typeof current.touchField).toEqual("function");
        expect(typeof current.setTouches).toEqual("function");
        expect(current.touches).toMatchObject({});
    });
    it("supports setting a field to touch via a function with one parameter", async () => {
        const { result, waitForNextUpdate } = renderHook(() => useTouch());
        act(() => {
            result.current.touchField("name");
        });
        await waitForNextUpdate().then(() => {
            expect(result.current.touches.name).toEqual(true);
        });
    });
});