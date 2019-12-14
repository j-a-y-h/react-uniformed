import { renderHook } from 'react-hooks-testing-library'
import { useHandlers, useSettersAsEventHandler, useSettersAsRefEventHandler } from '../src';

describe("useHandlers", () => {
  it("uses one function to call n number of functions", () => {
    const callOrder: string[] = [];
    const first = jest.fn().mockImplementation(() => callOrder.push('first'));
    const second = jest.fn().mockImplementation(() => callOrder.push('second'));
    const third = jest.fn().mockImplementation(() => callOrder.push('third'));
    const { result } = renderHook(() => useHandlers(first, second, third));
    result.current();
    expect(callOrder).toEqual(["first", "second", "third"]);
  });
  it("passes the given argument to all handlers", () => {
    const argumentsPassed: string[] = [];
    const first = jest.fn().mockImplementation((...args) => argumentsPassed.push(...args));
    const second = jest.fn().mockImplementation((...args) => argumentsPassed.push(...args));
    const { result } = renderHook(() => useHandlers(first, second));
    result.current(5, "string", {});
    expect(argumentsPassed).toEqual([5, "string", {}, 5, "string", {}]);
  });
});
describe("useSettersAsEventHandler", () => {
  it("calls handlers with the following arguments (name: string, value: string, target: EventTarget)", () => {
    const argumentsPassed: string[] = [];
    const first = jest.fn().mockImplementation((...args) => argumentsPassed.push(...args));
    const second = jest.fn().mockImplementation((...args) => argumentsPassed.push(...args));
    const { result } = renderHook(() => useSettersAsEventHandler(first, second));
    const name = "testing";
    const value = "testing value";
    const target = { name, value };
    result.current({ target } as any);
    expect(argumentsPassed).toEqual([name, value, target, name, value, target]);
  });
});
describe("useSettersAsRefEventHandler", () => {
  it("sets event handlers on ref elements", () => {
    const argumentsPassed: string[] = [];
    const first = jest.fn().mockImplementation((...args) => argumentsPassed.push(...args));
    const second = jest.fn().mockImplementation((...args) => argumentsPassed.push(...args));
    const { result } = renderHook(() => useSettersAsRefEventHandler(first, second));
    const name = "testing";
    const value = "testing value";
    const target = {
      name,
      value,
      addEventListener: jest.fn()
    };
    // @ts-ignore
    result.current(target as any);
    expect(argumentsPassed).toEqual([name, value, target, name, value, target]);
  });
  it("", () => {
    const argumentsPassed: string[] = [];
    const first = jest.fn().mockImplementation((...args) => argumentsPassed.push(...args));
    const second = jest.fn().mockImplementation((...args) => argumentsPassed.push(...args));
    const { result } = renderHook(() => useSettersAsRefEventHandler(first, second));
    const
    const name = "testing";
    const value = "testing value";
    const target = {
      name,
      value,
      addEventListener: jest.fn()
    };
    // @ts-ignore
    result.current(target as any);
    expect(argumentsPassed).toEqual([name, value, target, name, value, target]);
  });
});