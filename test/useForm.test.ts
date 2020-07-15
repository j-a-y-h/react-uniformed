import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../src';

const SUCCESS = '';

describe('useForm', () => {
  describe('no validation', () => {
    it('sets isDirty to true after submission', async () => {
      const onSubmit = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() =>
        useForm({
          onSubmit,
        }),
      );
      act(() => {
        result.current.submit();
      });
      await waitForNextUpdate({ timeout: 100 });
      expect(result.current.isDirty).toBe(true);
    });
    it('will call onSubmit when the form is submitted', async () => {
      const onSubmit = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() =>
        useForm({
          onSubmit,
        }),
      );
      act(() => {
        result.current.submit();
      });
      await waitForNextUpdate({ timeout: 100 });
      expect(onSubmit).toBeCalledTimes(1);
    });
  });
  describe('with non-constraint validation', () => {
    it('sets isDirty to true after submission of an optional form', async () => {
      const onSubmit = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() =>
        useForm({
          onSubmit,
          validators: {
            email: () => '',
          },
        }),
      );
      act(() => {
        result.current.submit();
      });
      await waitForNextUpdate();
      expect(result.current.isDirty).toBe(true);
    });
    it('will call onSubmit when the form is optional', async () => {
      const onSubmit = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() =>
        useForm({
          onSubmit,
          validators: {
            email: () => '',
          },
        }),
      );
      act(() => {
        result.current.submit();
      });
      await waitForNextUpdate();
      expect(onSubmit).toBeCalledTimes(1);
    });
    it('will only call onSubmit when the form is valid', async () => {
      const onSubmit = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() =>
        useForm({
          onSubmit,
          validators: {
            email: () => 'false',
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
    it('sets isDirty to true after submission of an optional form', async () => {
      const onSubmit = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() =>
        useForm({
          onSubmit,
          constraints: {
            email: { type: 'email', required: false },
          },
        }),
      );
      act(() => {
        result.current.submit();
      });
      await waitForNextUpdate();
      expect(result.current.isDirty).toBe(true);
    });
    it('will call onSubmit when the form is optional', async () => {
      const onSubmit = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() =>
        useForm({
          onSubmit,
          constraints: {
            email: { type: 'email', required: false },
          },
        }),
      );
      act(() => {
        result.current.submit();
      });
      await waitForNextUpdate();
      expect(onSubmit).toBeCalledTimes(1);
    });
    it('will only call onSubmit when the form is valid', async () => {
      const onSubmit = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() =>
        useForm({
          onSubmit,
          constraints: {
            email: { type: 'email', required: true },
          },
        }),
      );
      act(() => {
        result.current.submit();
      });
      await waitForNextUpdate();
      expect(onSubmit).toBeCalledTimes(0);
    });
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
