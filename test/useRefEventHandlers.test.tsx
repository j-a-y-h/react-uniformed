import React from 'react';
import { useRefEventHandlers } from '../src/useRefEventHandlers';
import { renderHook } from '@testing-library/react-hooks';
import { render, fireEvent } from '@testing-library/react';

describe('useRefEventHandlers', () => {
  function createMockHandlers(event = 'change') {
    return {
      handlers: [jest.fn(), jest.fn()],
      event,
    };
  }
  it.each(['click', 'focus'])('sets %s event handlers using a ref', async (event) => {
    const props = createMockHandlers(event);
    const { result } = renderHook(() => useRefEventHandlers<HTMLButtonElement>(props));

    const mount = render(
      <button ref={result.current} title='name'>
        Clicker
      </button>,
    );
    const name = await mount.findByTitle('name');
    props.handlers.forEach((handler) => {
      expect(handler).toBeCalledTimes(0);
    });
    fireEvent(name, new Event(event));
    props.handlers.forEach((handler) => {
      expect(handler).toBeCalledTimes(1);
    });
  });
  it.each([['click'], ['blur']])('removes %s event handlers on unmount', async (event) => {
    const props = createMockHandlers(event);
    const props2 = createMockHandlers(event);
    const { result, rerender } = renderHook(
      (props) => {
        return useRefEventHandlers<HTMLButtonElement>(props);
      },
      {
        initialProps: props,
      },
    );

    const Component = React.forwardRef((_, ref: React.Ref<HTMLButtonElement>) => (
      <button ref={ref} title='name'>
        Clicker
      </button>
    ));
    const mount = render(<Component ref={result.current} />);
    const trigger = async () => {
      const name = await mount.findByTitle('name');
      fireEvent(name, new Event(event));
    };
    await trigger();
    props.handlers.forEach((handler) => {
      expect(handler).toBeCalledTimes(1);
    });
    props2.handlers.forEach((handler) => {
      expect(handler).toBeCalledTimes(0);
    });

    rerender(props2);
    mount.rerender(<Component ref={result.current} />);
    await trigger();
    props.handlers.forEach((handler) => {
      expect(handler).toBeCalledTimes(1);
    });
    props2.handlers.forEach((handler) => {
      expect(handler).toBeCalledTimes(1);
    });
  });
});
