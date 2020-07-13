import React, { SyntheticEvent } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render, fireEvent } from '@testing-library/react';
import { useAnchor } from '../src';

describe('useAnchor', () => {
  function createMockSubmit() {
    return {
      handleSubmit: jest.fn().mockImplementation((e: SyntheticEvent) => {
        e.preventDefault();
      }),
    };
  }
  it.each(['change', 'blur'])('sets %s event handlers on form elements', async (event) => {
    const props = {
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
    };
    const { result } = renderHook(() => useAnchor(props));

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
    expect(event === 'change' ? props.handleChange : props.handleBlur).toBeCalledTimes(1);
  });
  it('sets submit event handler on the form', async () => {
    const props = createMockSubmit();
    const { result } = renderHook(() => useAnchor(props));

    const mount = render(
      <form ref={result.current.anchor}>
        <button title='name' type='submit'>
          Submit
        </button>
      </form>,
    );
    const name = await mount.findByTitle('name');
    name.click();
    // try by click submit
    expect(props.handleSubmit).toBeCalledTimes(1);
    // now try with the form
    (mount.container.firstElementChild as HTMLFormElement).submit();
    expect(props.handleSubmit).toBeCalledTimes(2);
  });
  it('removes submit event handler on the form when unmounting', async () => {
    const props = createMockSubmit();
    const props2 = createMockSubmit();
    const { result, rerender } = renderHook(
      (props) => {
        return useAnchor({
          ...props,
          handleChange: jest.fn(),
        });
      },
      {
        initialProps: props,
      },
    );

    const Component = ({ anchor }) => (
      <form ref={anchor}>
        <button title='name' type='submit'>
          Submit
        </button>
      </form>
    );

    const mount = render(<Component anchor={result.current.anchor} />);
    const name = await mount.findByTitle('name');
    name.click();
    expect(props.handleSubmit).toBeCalledTimes(1);
    expect(props2.handleSubmit).toBeCalledTimes(0);

    rerender(props2);
    mount.rerender(<Component anchor={result.current.anchor} />);
    name.click();
    expect(props.handleSubmit).toBeCalledTimes(1);
    expect(props2.handleSubmit).toBeCalledTimes(1);
  });
});
