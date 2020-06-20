import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render, fireEvent } from '@testing-library/react';
import { useHandlers, useSettersAsEventHandler, useValidateAsSetter } from '../src';

describe('useHandlers', () => {
  it('uses one function to call n number of functions', () => {
    const callOrder: string[] = [];
    const first = jest.fn().mockImplementation(() => callOrder.push('first'));
    const second = jest.fn().mockImplementation(() => callOrder.push('second'));
    const third = jest.fn().mockImplementation(() => callOrder.push('third'));
    const { result } = renderHook(() => useHandlers(first, second, third));
    result.current();
    expect(callOrder).toEqual(['first', 'second', 'third']);
  });
  it('passes the given argument to all handlers', () => {
    const argumentsPassed: string[] = [];
    const first = jest.fn().mockImplementation((...args) => argumentsPassed.push(...args));
    const second = jest.fn().mockImplementation((...args) => argumentsPassed.push(...args));
    const { result } = renderHook(() => useHandlers(first, second));
    result.current(5, 'string', {});
    expect(argumentsPassed).toEqual([5, 'string', {}, 5, 'string', {}]);
  });
});
describe('useSettersAsEventHandler', () => {
  it('calls handlers with the following arguments (name: string, value: string, target: EventTarget)', () => {
    const first = jest.fn();
    const second = jest.fn();
    const { result } = renderHook(() => useSettersAsEventHandler(first, second));
    // @ts-ignore
    let renderer = render(<input name='test' type='checkbox' onChange={result.current} />);
    // @ts-ignore
    fireEvent.click(renderer.container.firstChild);
    expect(first).toBeCalledWith('test', 'on', renderer.container.firstChild);
    expect(second).toBeCalledWith('test', 'on', renderer.container.firstChild);
  });
  it('supports checkboxes', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => useSettersAsEventHandler(fn));
    let renderer = render(<input name='test' type='checkbox' onChange={result.current} />);
    expect(renderer.container.firstChild!.checked).toBe(false);
    fireEvent.click(renderer.container.firstChild);
    expect(renderer.container.firstChild!.checked).toBe(true);
    expect(fn).toBeCalledWith('test', 'on', expect.any(HTMLInputElement));
    fireEvent.click(renderer.container.firstChild);
    expect(renderer.container.firstChild!.checked).toBe(false);
    expect(fn).toBeCalledWith('test', '', expect.any(HTMLInputElement));
  });
  it('supports checkboxes with values', () => {
    const fn = jest.fn();
    const { result } = renderHook(() => useSettersAsEventHandler(fn));
    let renderer = render(
      <input name='test' type='checkbox' value='test-value' onChange={result.current} />,
    );
    expect(renderer.container.querySelector('input')!.checked).toBe(false);
    fireEvent.click(renderer.container.firstChild);
    expect(renderer.container.firstChild!.checked).toBe(true);
    expect(fn).toBeCalledWith('test', 'test-value', expect.any(HTMLInputElement));
    fireEvent.click(renderer.container.firstChild);
    expect(renderer.container.firstChild!.checked).toBe(false);
    expect(fn).toBeCalledWith('test', '', expect.any(HTMLInputElement));
  });
});

describe('useValidateAsSetter', () => {
  it('supports calls without function parameters', () => {
    let testValue;
    const validate: any = (val: any) => {
      testValue = val;
    };
    const { result } = renderHook(() => useValidateAsSetter(validate, { test: 66, test2: 59 }));
    // @ts-ignore
    result.current();
    expect({
      test: 66,
      test2: 59,
      // @ts-ignore
    }).toMatchObject(testValue);
  });
  it('calls validate with values passed into hook', () => {
    let testValue;
    const validate: any = (val: any) => {
      testValue = val;
    };
    const { result } = renderHook(() => useValidateAsSetter(validate, { test: 66, test2: 59 }));
    // @ts-ignore
    result.current('dont-test', 7);
    expect(testValue).toMatchObject({
      test: 66,
      test2: 59,
    });
  });
  it('calls validate with value from the function param', () => {
    let testValue;
    const validate: any = ({ test }: any) => {
      testValue = test;
    };
    const { result } = renderHook(() => useValidateAsSetter(validate, { test: 66 }));
    // @ts-ignore
    result.current('test', 7);
    expect(testValue).toEqual(7);
  });
});
