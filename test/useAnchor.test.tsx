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
  function createMockReset() {
    return {
      handleReset: jest.fn().mockImplementation((e: SyntheticEvent) => {
        e.preventDefault();
      }),
    };
  }
  function createMockHandlers() {
    return {
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
    };
  }
  it.each(['change', 'blur'])('sets %s event handlers on form elements', async (event) => {
    const props = createMockHandlers();
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
  it.each([
    ['change', 'handleChange'],
    ['blur', 'handleBlur'],
  ])('removes %s event handlers on form unmount', async (event, handler) => {
    const props = createMockHandlers();
    const props2 = createMockHandlers();
    const { result, rerender } = renderHook(
      (props) => {
        return useAnchor(props);
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
        </div>
      </form>
    );

    const mount = render(<Component anchor={result.current.anchor} />);
    const trigger = async () => {
      const name = await mount.findByTitle('name');
      fireEvent(name, new Event(event));
      fireEvent(name, new Event(event));
    };
    await trigger();
    expect(props[handler]).toBeCalledTimes(1);
    expect(props2[handler]).toBeCalledTimes(0);

    rerender(props2);
    mount.rerender(<Component anchor={result.current.anchor} />);
    await trigger();
    expect(props[handler]).toBeCalledTimes(1);
    expect(props2[handler]).toBeCalledTimes(1);
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
    const { result, rerender } = renderHook((props) => useAnchor(props), {
      initialProps: props,
    });

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
  it('sets reset event handler on the form', async () => {
    const props = createMockReset();
    const { result } = renderHook(() => useAnchor(props));

    const mount = render(
      <form ref={result.current.anchor}>
        <button title='name' type='reset'>
          Submit
        </button>
      </form>,
    );
    const name = await mount.findByTitle('name');
    name.click();
    // try by click submit
    expect(props.handleReset).toBeCalledTimes(1);
    // now try with the form
    (mount.container.firstElementChild as HTMLFormElement).reset();
    expect(props.handleReset).toBeCalledTimes(2);
  });
});
