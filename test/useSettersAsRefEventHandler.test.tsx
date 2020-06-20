import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render } from '@testing-library/react';
import { useSettersAsRefEventHandler } from '../src';

describe('useSettersAsRefEventHandler', () => {
  it('Supports setting values on mount', () => {
    const mountedValues = {
      test: 'john doe',
    };
    // @ts-ignore
    const { result } = renderHook(() =>
      useSettersAsRefEventHandler<HTMLInputElement>({
        handlers: [jest.fn()],
        mountedValues,
      }),
    );

    // @ts-ignore
    const renderer = render(<input name='test' ref={result.current} />);
    // @ts-ignore
    const getInput = (r = renderer): HTMLInputElement => r.container.querySelector('[name=test]');
    expect(getInput().value).toEqual('john doe');
    mountedValues.test = '';
    // hook shouldn't change value as the component is uncontrolled
    expect(getInput().value).toEqual('john doe');

    // test that the hook will update after a rerender
    const renderer2 = render(<input name='test' ref={result.current} />);
    expect(getInput(renderer2).value).toEqual('');
  });
  it('sets change event handlers on ref elements', () => {
    const { result } = renderHook(() => useSettersAsRefEventHandler(jest.fn()));
    const target = {
      addEventListener: jest.fn(),
    };
    // @ts-ignore
    result.current(target as any);
    expect(target.addEventListener).toHaveBeenCalledTimes(1);
    expect(target.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    // test with the other api that uses an object for the options
    const { result: result2 } = renderHook(() =>
      useSettersAsRefEventHandler({
        handlers: [jest.fn()],
      }),
    );
    const target2 = {
      addEventListener: jest.fn(),
    };
    // @ts-ignore
    result2.current(target2 as any);
    expect(target2.addEventListener).toHaveBeenCalledTimes(1);
    expect(target2.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
  it('supports any event listeners', () => {
    const { result } = renderHook(() =>
      useSettersAsRefEventHandler({
        handlers: [jest.fn()],
        event: 'click',
      }),
    );
    const target = {
      addEventListener: jest.fn(),
    };
    // @ts-ignore
    result.current(target as any);
    expect(target.addEventListener).toHaveBeenCalledTimes(1);
    expect(target.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
  });
  it('correctly calls event handlers', () => {
    const argumentsPassed: string[] = [];
    const first = jest.fn().mockImplementation((...args) => argumentsPassed.push(...args));
    const second = jest.fn().mockImplementation((...args) => argumentsPassed.push(...args));
    const { result } = renderHook(() => useSettersAsRefEventHandler(first, second));
    const name = 'testing';
    const value = 'testing value';
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
