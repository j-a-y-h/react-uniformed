import { renderHook } from '@testing-library/react-hooks'
import { useSettersAsRefEventHandler } from '../src';

describe("useSettersAsRefEventHandler", () => {
    it.todo("Supports setting values on mount");
    it("sets change event handlers on ref elements", () => {
      const { result } = renderHook(() => useSettersAsRefEventHandler(jest.fn()));
      const target = {
        addEventListener: jest.fn(),
      };
      // @ts-ignore
      result.current(target as any);
      expect(target.addEventListener).toHaveBeenCalledTimes(1);
      expect(target.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
      // test with the other api that uses an object for the options
      const { result: result2 } = renderHook(() => useSettersAsRefEventHandler({
        handlers: [jest.fn()],
      }));
      const target2 = {
        addEventListener: jest.fn(),
      };
      // @ts-ignore
      result2.current(target2 as any);
      expect(target2.addEventListener).toHaveBeenCalledTimes(1);
      expect(target2.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
    });
    it("supports any event listeners", () => {
      const { result } = renderHook(() => useSettersAsRefEventHandler({
        handlers: [jest.fn()],
        event: "click",
      }));
      const target = {
        addEventListener: jest.fn(),
      };
      // @ts-ignore
      result.current(target as any);
      expect(target.addEventListener).toHaveBeenCalledTimes(1);
      expect(target.addEventListener).toHaveBeenCalledWith("click", expect.any(Function));
    });
    it("correctly calls event handlers", () => {
      const argumentsPassed: string[] = [];
      const first = jest.fn().mockImplementation((...args) => argumentsPassed.push(...args));
      const second = jest.fn().mockImplementation((...args) => argumentsPassed.push(...args));
      const { result } = renderHook(() => useSettersAsRefEventHandler(first, second));
      const name = "testing";
      const value = "testing value";
      const target = {
        name,
        value,
        // @ts-ignore
        addEventListener: (_: string, eventHandler: any) => {
          eventHandler({
            target,
          });
        },
      };
      // @ts-ignore
      result.current(target as any);
      expect(argumentsPassed).toEqual([name, value, target, name, value, target]);
    });
  });