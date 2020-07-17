import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render, fireEvent } from '@testing-library/react';
import { useFormInputsRef } from '../src/useFormRef/useFormInputsRef';

describe('useFormInputsRef', () => {
  function createMockHandlers() {
    return {
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
    };
  }
  it.each(['change', 'blur'])('sets %s event handlers on form elements', async (event) => {
    const props = createMockHandlers();
    const { result } = renderHook(() => useFormInputsRef(props));

    const mount = render(
      <form ref={result.current}>
        <div>
          <label>Name </label>
          <input type='text' name='name' title='name' />
        </div>
      </form>,
    );
    const name = await mount.findByTitle('name');

    fireEvent(name, new Event(event));
    expect(event === 'change' ? props.handleChange : props.handleBlur).toBeCalledTimes(1);
  });
  it.each([
    ['change', 'handleChange'],
    ['blur', 'handleBlur'],
  ])('removes %s event handlers on form unmount', async (event, handler) => {
    const props = createMockHandlers();
    const props2 = createMockHandlers();
    const { result, rerender } = renderHook(
      (props) => {
        return useFormInputsRef(props);
      },
      {
        initialProps: props,
      },
    );

    const Component = ({ anchor }) => (
      <form ref={anchor}>
        <div>
          <label>Name </label>
          <input type='text' name='name' title='name' />
          <input type='text' name='names' title='names' />
        </div>
      </form>
    );

    expect(props[handler]).toBeCalledTimes(0);
    expect(props2[handler]).toBeCalledTimes(0);
    const mount = render(<Component anchor={result.current} />);
    const trigger = async () => {
      const name = await mount.findByTitle('name');
      fireEvent(name, new Event(event));
    };
    await trigger();
    expect(props[handler]).toBeCalledTimes(1);
    expect(props2[handler]).toBeCalledTimes(0);

    rerender(props2);
    mount.rerender(<Component anchor={result.current} />);
    await trigger();
    expect(props[handler]).toBeCalledTimes(1);
    expect(props2[handler]).toBeCalledTimes(1);
  });
  it.todo('only adds event handler to input, textarea, and select elements');
  it.todo('will not add event handler to submit type input');
  it.todo('handles dynamically added input elements');
});
