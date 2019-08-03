import { renderHook, act } from 'react-hooks-testing-library'
import { useErrors } from "../src/useErrors"

describe("useErrors", () => {
  it('can set errors', () => {
    const { result } = renderHook(() => useErrors());

    act(() => result.current.setError("email", "required"));
    expect(result.current.errors.email).toEqual("required");
  });
  it('can reset errors', () => {
    const { result } = renderHook(() => useErrors());

    act(() => {
      result.current.setError("cream", "cream is required");
      result.current.setError("soda", "please pick a soda");
      result.current.resetErrors();
    });

    expect(result.current.errors).toEqual({});
  });
  it('determines if there are errors', () => {
    const { result } = renderHook(() => useErrors());

    act(() => result.current.setError("email", "required"));
    expect(result.current.hasErrors).toEqual(true);
    act(() => result.current.resetErrors());
    expect(result.current.hasErrors).toEqual(false);
  });
});
