import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../src';

const SUCCESS = '';

describe('useForm', () => {
  describe('when submit is clicked with validation', () => {
    it('will only call onSubmit when the form is valid', async () => {
      const onSubmit = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() =>
        useForm({
          onSubmit,
          constraints: {
            email: { type: 'email' },
          },
        }),
      );
      act(() => {
        result.current.submit();
      });
      await waitForNextUpdate();
      expect(onSubmit).toBeCalledTimes(0);
    });
  });
  describe('with constraints', () => {
    it('supports email types', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useForm({
          onSubmit() {},
          constraints: {
            email: { type: 'email' },
          },
        }),
      );
      const subtest = async (value, shouldFail?) => {
        act(() => {
          result.current.validateByName('email', value);
        });
        await waitForNextUpdate();
        let exp = expect(result.current.errors.email);
        if (shouldFail) {
          // @ts-expect-error
          exp = exp.not;
        }
        exp.toEqual(SUCCESS);
      };
      await subtest('example.com', true);
      await subtest('e@example.com');
      await subtest('john.doe@example.uk.co');
    });
  });
});
