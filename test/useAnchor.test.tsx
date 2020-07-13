import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render } from '@testing-library/react';
import { useAnchor } from '../src';

describe('useAnchor', () => {
  it('sets change event handlers on form elements', () => {
    const props = {
      handleChange: jest.fn(),
    };
    const { result } = renderHook(() => useAnchor(props));

    const mount = render(
      <form ref={result.current.anchor}>
        <div>
          <label>Name </label>
          <input type='text' name='name' />
        </div>
      </form>,
    );

    expect(props.handleChange).toBeCalledTimes(1);
  });
});
