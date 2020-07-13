import React, { SyntheticEvent } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render, fireEvent } from '@testing-library/react';
import { useAnchor } from '../src';

describe('useAnchor', () => {
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
    const props = {
      handleSubmit: jest.fn().mockImplementation((e: SyntheticEvent) => {
        e.preventDefault();
      }),
    };
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
});
