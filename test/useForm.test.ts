import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../src';

const SUCCESS = '';
const sleep = (duration: number) => {
  return new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, duration * 1000);
  });
};

describe('useForm', () => {
  describe('no validation', () => {
    it('will not set touch on inputs', async () => {
      const onSubmit = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() =>
        useForm({
          onSubmit,
          initialValues: { test: 'hello' },
        }),
      );
      act(() => {
        result.current.submit();
      });
      await waitForNextUpdate({ timeout: 100 });
      expect(result.current.touches.test).toBeFalsy();
    });
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
    it('will not set touch on inputs', async () => {
      const onSubmit = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() =>
        useForm({
          onSubmit,
          validators: {
            email: () => '',
          },
          initialValues: {
            test: 'hello',
          },
        }),
      );
      act(() => {
        result.current.submit();
      });
      await waitForNextUpdate();
      expect(result.current.touches.test).toBeFalsy();
    });
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
    it('sets isDirty to true after submission of a form', async () => {
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
    it('will not set touch on inputs', async () => {
      const onSubmit = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() =>
        useForm({
          onSubmit,
          constraints: {
            email: { type: 'email', required: true },
          },
          initialValues: {
            test: 'hello',
          },
        }),
      );
      act(() => {
        result.current.submit();
      });
      await waitForNextUpdate();
      expect(result.current.touches.test).toBeFalsy();
    });
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
    it('sets isDirty to true after submission of a form', async () => {
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
    it('will not reset form inputs when submission fails', async () => {
      const onSubmit = jest.fn().mockImplementation(() => {
        return sleep(1).then(() => {
          throw 'error';
        });
      });
      const { result, waitForNextUpdate } = renderHook(() =>
        useForm({
          onSubmit,
          constraints: {
            email: { type: 'email', required: true },
          },
        }),
      );
      act(() => {
        result.current.setValue('email', 'test@example.com');
      });
      act(() => {
        result.current.submit();
      });
      await waitForNextUpdate();
      expect(onSubmit).toBeCalledTimes(1);
      expect(result.current.values.email).toEqual('test@example.com');
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
