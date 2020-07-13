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
      const mount = render(<input ref={result.current} title='name' />);
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
      const mount = render(<input ref={result.current} title='name' value='99' />);
      const button = mount.container.firstElementChild as HTMLInputElement;
      expect(button.value).toBe(5);
    });
    it('sets the ref elements value on re-mount', () => {});
  });
  describe('ref element name does NOT match a mounted value key', () => {
    it('will not set the ref elements value on mount', () => {});
    it('will not overwrite the ref elements value on mount', () => {});
    it('will not set the ref elements value on re-mount', () => {});
  });
});
