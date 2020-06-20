import { renderHook, act } from '@testing-library/react-hooks';
import { useGenericValues, isMapWithValues } from '../src/useGenericValues';

describe('useGenericValues', () => {
  it('can set values', () => {
    const { result } = renderHook(() => useGenericValues<string>());

    act(() => result.current.setValue('email', 'required'));
    expect(result.current.values.email).toEqual('required');
    act(() => result.current.setValues({ 'timothy-mic': 'happyfeet' }));
    expect(result.current.values).toMatchObject({ 'timothy-mic': 'happyfeet' });
  });
  it('can reset values', () => {
    const { result } = renderHook(() => useGenericValues<string>());

    act(() => {
      result.current.setValue('cream', 'cream is required');
      result.current.setValue('soda', 'please pick a soda');
      result.current.resetValues();
    });

    expect(result.current.values).toEqual({});
  });
  it('can determine if there are values', () => {
    const { result } = renderHook(() => useGenericValues<string>());

    expect(result.current.hasValue).toEqual(false);
    act(() => result.current.setValue('email', 'required'));
    expect(result.current.hasValue).toEqual(true);
    act(() => result.current.resetValues());
    expect(result.current.hasValue).toEqual(false);
  });
  it.each([
    [null, false],
    [undefined, false],
    [{}, false],
    [{ t: 0 }, false],
    [{ t: '' }, false],
    [{ t: 'test' }, true],
    [() => {}, false],
  ])(`hasValue returns false for %s input`, (input, expects) => {
    // @ts-ignore
    expect(isMapWithValues(input)).toEqual(expects);
  });
  it('supports initial values', () => {
    const initialValue = {
      name: 'john',
      email: 'email@example.com',
    };
    const { result } = renderHook(() => useGenericValues<string>(initialValue));

    act(() => {
      result.current.setValue('name', 'cream is required');
      result.current.setValue('email', 'please pick a soda');
      result.current.setValue('unknown', "didn't set a value");
    });
    expect(result.current.values).not.toEqual({});
    expect(result.current.values).toEqual({
      name: 'cream is required',
      email: 'please pick a soda',
      unknown: "didn't set a value",
    });

    act(() => {
      result.current.resetValues();
    });
    expect(result.current.values).toEqual(initialValue);
  });
});
