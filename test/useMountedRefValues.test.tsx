import React from 'react';
import { useMountedRefValues } from '../src/useMountedRefValues';
import { renderHook } from '@testing-library/react-hooks';
import { render } from '@testing-library/react';

describe('useMountedRefValues', () => {
  describe('ref element name matches a mounted value key', () => {
    it('sets the ref elements value on mount', () => {
      const { result } = renderHook(() =>
        useMountedRefValues<HTMLInputElement>({
          values: {
            test: 5,
          },
        }),
      );
      const mount = render(<input ref={result.current} title='name' name='test' />);
      const button = mount.container.firstElementChild as HTMLInputElement;
      expect(button.value).toBe(5);
    });
    it('overwrites the ref elements value on mount', () => {
      const { result } = renderHook(() =>
        useMountedRefValues<HTMLInputElement>({
          values: {
            test: 5,
          },
        }),
      );
      const mount = render(<input ref={result.current} title='name' value='99' name='test' />);
      const button = mount.container.firstElementChild as HTMLInputElement;
      expect(button.value).toBe(5);
    });
    it('warns before overwriting the ref elements value on mount', () => {
      const { result } = renderHook(() =>
        useMountedRefValues<HTMLInputElement>({
          values: {
            test: 5,
          },
        }),
      );
      const warnMock = jest.spyOn(console, 'warn');
      expect(warnMock).toBeCalledTimes(0);
      render(<input ref={result.current} title='name' value='99' name='test' />);
      expect(warnMock).toBeCalledTimes(1);
    });
  });
  describe('ref element name does NOT match a mounted value key', () => {
    it('will not set the ref elements value on mount', () => {
      const { result } = renderHook(() =>
        useMountedRefValues<HTMLInputElement>({
          values: {
            test: 5,
          },
        }),
      );
      const mount = render(<input ref={result.current} title='name' name='not-test' />);
      const button = mount.container.firstElementChild as HTMLInputElement;
      expect(button.value).toBeFalsy();
    });
  });
});
