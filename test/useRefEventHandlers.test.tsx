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
  it.each(['change', 'blur'])('sets %s event handlers on form elements', async (event) => {
    const props = createMockHandlers(event);
    const { result } = renderHook(() => useRefEventHandlers(props));

    const mount = render(
      <form ref={result.current.anchor}>
        <div>
          <label>Name </label>
          <input type='text' name='name' title='name' />
        </div>
      </form>,
    );
    const name = await mount.findByTitle('name');

    fireEvent(name, new Event(event));
    props.handlers.forEach((handler) => {
      expect(handler).toBeCalledTimes(1);
    });
    expect(props.handlers[0]).toBeCalledTimes(1);
  });
});
