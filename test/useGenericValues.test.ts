import { renderHook, act } from 'react-hooks-testing-library'
import { useGenericValues } from '../src/useGenericValues';

describe("useResetableValues", () => {
  it('can set values', () => {
    const { result } = renderHook(() => useGenericValues<string>());

    act(() => result.current.setValue("email", "required"));
    expect(result.current.values.email).toEqual("required");
    act(() => result.current.setValues({"timothy-mic": "happyfeet"}));
    expect(result.current.values).toMatchObject({"timothy-mic": "happyfeet"});
  });
  it('can reset values', () => {
    const { result } = renderHook(() => useGenericValues<string>());

    act(() => {
      result.current.setValue("cream", "cream is required");
      result.current.setValue("soda", "please pick a soda");
      result.current.resetValues();
    });

    expect(result.current.values).toEqual({});
  });
  it('can determine if there are values', () => {
    const { result } = renderHook(() => useGenericValues<string>());

    act(() => result.current.setValue("email", "required"));
    expect(result.current.hasValue).toEqual(true);
    act(() => result.current.resetValues());
    expect(result.current.hasValue).toEqual(false);
  });
});
