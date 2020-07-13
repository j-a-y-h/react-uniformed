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
    fireEvent(name, new Event(event));
    props.handlers.forEach((handler) => {
      expect(handler).toBeCalledTimes(1);
    });
  });
});
