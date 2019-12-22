import { renderHook, act } from '@testing-library/react-hooks';
import { useValidation } from '../src';

describe("useValidation", () => {
    const ERROR = "__required__";
    const SUCCESS = "";

    it("returns validateByName", async () => {
        const { result, waitForNextUpdate } = renderHook(() => useValidation({
            name: () => ERROR,
        }));
        act(() => {
            result.current.validateByName("name", "");
        });
        await waitForNextUpdate();
        expect(result.current.errors.name).toEqual(ERROR);
    });
    it("returns validate", async () => {
        const { result, waitForNextUpdate } = renderHook(() => useValidation({
            name: () => ERROR,
        }));
        act(() => {
            result.current.validate({ name: "asfdkasjdkl" });
        });
        await waitForNextUpdate();
        expect(result.current.errors.name).toEqual(ERROR);
    });
    it("accepts a validation function", async () => {
        const { result, waitForNextUpdate } = renderHook(() => useValidation((values) => {
            return { name: values.name ? SUCCESS : ERROR, john: ERROR };
        }));
        act(() => {
            result.current.validateByName("john", "asfdkasjdkl");
        });
        await waitForNextUpdate();
        expect(result.current.errors.john).toEqual(ERROR);
        expect(result.current.errors.name).not.toEqual(ERROR);
        act(() => {
            result.current.validate({ name: "safsd" });
        });
        await waitForNextUpdate();
        expect(result.current.errors.name).toEqual(SUCCESS);
        expect(result.current.errors.john).toEqual(ERROR);
    });
    it("values validate to true if no corresponding validator", async () => {
        // @ts-ignore
        const testFunction = async (validator, expectLastTest?: "") => {
            const { result, waitForNextUpdate } = renderHook(() => useValidation(validator));
            act(() => {
                // @ts-ignore
                result.current.validateByName("john", "asfdkasjdkl");
            });
            await waitForNextUpdate();
            // @ts-ignore
            expect(result.current.errors.john).toEqual(SUCCESS);
            // @ts-ignore
            expect(result.current.errors.pizza).toEqual(undefined);
            act(() => {
                result.current.validate({ pizza: "asfdkasjdkl" });
            });
            await waitForNextUpdate();
            // @ts-ignore
            expect(result.current.errors.john).toEqual(undefined);
            // @ts-ignore
            expect(result.current.errors.pizza).toEqual(expectLastTest);
        };
        await testFunction({}, SUCCESS);
        await testFunction(() => ({}), undefined);
    });
});