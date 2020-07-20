import React, { SyntheticEvent } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render, fireEvent } from '@testing-library/react';
import { useFormRef } from '../src';

describe('useFormRef', () => {
  function createMockSubmit() {
    return {
      submit: jest.fn().mockImplementation((e: SyntheticEvent) => {
        e.preventDefault();
      }),
    };
  }
  function createMockReset() {
    return {
      reset: jest.fn().mockImplementation((e: SyntheticEvent) => {
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
    const { result } = renderHook(() => useFormRef(props));

    const mount = render(
      <form ref={result.current.ref}>
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
        return useFormRef(props);
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
    const mount = render(<Component anchor={result.current.ref} />);
    const trigger = async () => {
      const name = await mount.findByTitle('name');
      fireEvent(name, new Event(event));
    };
    await trigger();
    expect(props[handler]).toBeCalledTimes(1);
    expect(props2[handler]).toBeCalledTimes(0);

    rerender(props2);
    mount.rerender(<Component anchor={result.current.ref} />);
    await trigger();
    expect(props[handler]).toBeCalledTimes(1);
    expect(props2[handler]).toBeCalledTimes(1);
  });
  it.each([
    ['submit', 'submit', createMockSubmit],
    ['reset', 'reset', createMockReset],
    // @ts-expect-error
  ])('sets %s event handler on the form', async (type: 'submit' | 'reset', handler, mocker) => {
    const props = mocker();
    const { result } = renderHook(() => useFormRef(props));

    const mount = render(
      <form ref={result.current.ref}>
        <button title='name' type={type}>
          {type}
        </button>
      </form>,
    );
    const name = await mount.findByTitle('name');
    name.click();
    // try by click submit
    expect(props[handler]).toBeCalledTimes(1);
    // now try with the form
    (mount.container.firstElementChild as HTMLFormElement)[type]();
    expect(props[handler]).toBeCalledTimes(2);
  });
  it.each([
    ['submit', 'submit', createMockSubmit],
    ['reset', 'reset', createMockReset],
  ])(
    'removes %s event handler on the form when unmounting',
    // @ts-expect-error
    async (type: 'submit' | 'reset', handler, mocker) => {
      const props = mocker();
      const props2 = mocker();
      const { result, rerender } = renderHook((props) => useFormRef(props), {
        initialProps: props,
      });

      const Component = ({ anchor }) => (
        <form ref={anchor}>
          <button title='name' type={type}>
            {type}
          </button>
        </form>
      );

      const mount = render(<Component anchor={result.current.ref} />);
      const name = await mount.findByTitle('name');
      name.click();
      expect(props[handler]).toBeCalledTimes(1);
      expect(props2[handler]).toBeCalledTimes(0);

      rerender(props2);
      mount.rerender(<Component anchor={result.current.ref} />);
      name.click();
      expect(props[handler]).toBeCalledTimes(1);
      expect(props2[handler]).toBeCalledTimes(1);
    },
  );
  it('only adds event handler to input, textarea, and select elements', async () => {
    const props = createMockHandlers();
    const { result } = renderHook(() => useFormRef(props));

    const mount = render(
      <form ref={result.current.ref}>
        <label title='name'>Name </label>
        <input type='text' title='allowed' />
        <textarea title='allowed'></textarea>
        <select title='allowed'>
          <option value='4'>4</option>
        </select>
        <object title='name' />
        <output title='name'>60</output>
        <fieldset title='name'>
          <legend title='name'>Choose your favorite monster</legend>
          <label title='name'>Mothman</label>
        </fieldset>
        <button title='name'>Button</button>
      </form>,
    );
    const trigger = async (title = 'name') => {
      const names = await mount.findAllByTitle(title);
      names.forEach((name) => {
        fireEvent(name, new Event('change'));
        fireEvent(name, new Event('blur'));
      });
    };
    await trigger();
    expect(props.handleChange).toBeCalledTimes(0);
    expect(props.handleBlur).toBeCalledTimes(0);
    await trigger('allowed');
    expect(props.handleChange).toBeCalledTimes(3);
    expect(props.handleBlur).toBeCalledTimes(3);
  });
  it.each(['submit', 'image', 'reset', 'hidden'])(
    `will not add event handlers to inputs of '%s' type`,
    async (type) => {
      const props = createMockHandlers();
      const { result } = renderHook(() => useFormRef(props));

      const mount = render(
        <form ref={result.current.ref}>
          <input type={type} title='name' />
        </form>,
      );
      const trigger = async (title = 'name') => {
        const names = await mount.findAllByTitle(title);
        names.forEach((name) => {
          fireEvent(name, new Event('change'));
          fireEvent(name, new Event('blur'));
        });
      };
      await trigger();
      await trigger();
      await trigger();
      expect(props.handleChange).toBeCalledTimes(0);
      expect(props.handleBlur).toBeCalledTimes(0);
    },
  );
  it('handles dynamically added input elements', async () => {
    const props = createMockHandlers();
    const { result, rerender } = renderHook(
      (props) => {
        return useFormRef(props);
      },
      {
        initialProps: props,
      },
    );

    const Component = ({ anchor, showThird = false }) => (
      <form ref={anchor}>
        <input type='text' title='name' />
        <input type='text' title='name' />
        {showThird ? <input type='text' title='name' /> : null}
      </form>
    );

    expect(props.handleBlur).toBeCalledTimes(0);
    expect(props.handleChange).toBeCalledTimes(0);
    const mount = render(<Component anchor={result.current.ref} />);
    const trigger = async () => {
      const names = await mount.findAllByTitle('name');
      names.forEach((name) => {
        fireEvent(name, new Event('change'));
        fireEvent(name, new Event('blur'));
      });
    };
    await trigger();
    expect(props.handleBlur).toBeCalledTimes(2);
    expect(props.handleChange).toBeCalledTimes(2);

    rerender(props);
    mount.rerender(<Component anchor={result.current.ref} showThird />);
    await trigger();
    expect(props.handleBlur).toBeCalledTimes(5);
    expect(props.handleChange).toBeCalledTimes(5);

    rerender(props);
    mount.rerender(<Component anchor={result.current.ref} />);
    await trigger();
    expect(props.handleBlur).toBeCalledTimes(7);
    expect(props.handleChange).toBeCalledTimes(7);
  });
  xit('handles dynamically added input elements from nested components', async () => {
    const props = createMockHandlers();
    const { result } = renderHook(
      (props) => {
        return useFormRef(props);
      },
      {
        initialProps: props,
      },
    );
    const NestedComponent = () => {
      const [showThird, setShowThird] = React.useState(false);
      return (
        <>
          <button type='button' title='toggle' onClick={() => setShowThird((i) => !i)}>
            Toggle
          </button>
          {showThird ? <input type='text' title='name' /> : null}
        </>
      );
    };

    const Component = ({ anchor }) => (
      <form ref={anchor}>
        <input type='text' title='name' />
        <input type='text' title='name' />
        <NestedComponent />
      </form>
    );

    expect(props.handleBlur).toBeCalledTimes(0);
    expect(props.handleChange).toBeCalledTimes(0);
    const mount = render(<Component anchor={result.current} />);
    const trigger = async () => {
      const names = await mount.findAllByTitle('name');
      names.forEach((name) => {
        fireEvent(name, new Event('change'));
        fireEvent(name, new Event('blur'));
      });
    };
    await trigger();
    expect(props.handleBlur).toBeCalledTimes(2);
    expect(props.handleChange).toBeCalledTimes(2);

    const toggle = await mount.findByTitle('toggle');
    toggle.click();
    await trigger();
    expect(props.handleBlur).toBeCalledTimes(5);
    expect(props.handleChange).toBeCalledTimes(5);
    toggle.click();
    await trigger();
    expect(props.handleBlur).toBeCalledTimes(7);
    expect(props.handleChange).toBeCalledTimes(7);
  });
});
