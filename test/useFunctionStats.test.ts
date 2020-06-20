import { renderHook, act } from '@testing-library/react-hooks';
import { useFunctionStats } from '../src/useFunctionStats';

describe('useFunctionStats', () => {
  it('counts the number of times a function is invoked', () => {
    const { result } = renderHook(() => useFunctionStats(() => {}));
    act(() => {
      result.current.fnc();
      result.current.fnc();
      result.current.fnc();
    });
    expect(result.current.invokeCount).toEqual(3);
  });
  it('supports async functions', async () => {
    const { result, wait } = renderHook(() => useFunctionStats(async () => {}));
    act(() => {
      result.current.fnc();
      result.current.fnc();
      result.current.fnc();
    });
    await wait(() => !result.current.isRunning);
    expect(result.current.invokeCount).toEqual(3);
  });
  it('supports sync function', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFunctionStats(() => {}));
    act(() => {
      result.current.fnc();
    });
    expect(result.current.isRunning).toEqual(false);
    // @ts-ignore
    await waitForNextUpdate({
      timeout: 100,
    }).catch(() => {});
    expect(result.current.isRunning).toEqual(false);
  });
  it('determines if a function is being invoked', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFunctionStats(async () => {}));
    act(() => {
      result.current.fnc();
    });
    expect(result.current.isRunning).toEqual(true);
    await waitForNextUpdate();
    expect(result.current.isRunning).toEqual(false);
  });
  it('turns state to false for rejected async functions', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useFunctionStats(async () => {
        return Promise.reject();
      }),
    );
    act(() => {
      result.current.fnc().catch(() => {});
    });
    expect(result.current.isRunning).toEqual(true);
    // @ts-ignore
    await waitForNextUpdate({
      timeout: 100,
    });
    expect(result.current.isRunning).toEqual(false);
  });
});
