import { renderHook, act } from '@testing-library/react-hooks';
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
    it("supports setting a field to touch via a function with one parameter", () => {
        const { result, waitForNextUpdate } = renderHook(() => useTouch());
        act(() => {
            result.current.touchField("name");
        });
        waitForNextUpdate().then(() => {
            expect(result.current.touches.name).toEqual(true);
        });
    });
});