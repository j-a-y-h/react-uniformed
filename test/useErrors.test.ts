import { renderHook, act } from 'react-hooks-testing-library'
import { useErrors, Errors, useErrorsHook } from "../src/useErrors"

describe("useErrors", () => {
  it("doesn't accept arguments", () => {
    const errors = {
      name: "hello"
    };
    // @ts-ignore
    const { result } = renderHook<Errors, useErrorsHook>(() => useErrors(errors));
    expect(result.current.errors).toEqual({});
  });
  
  it('should return errors, setError, resetErrors', () => {
    const { result } = renderHook<Errors, useErrorsHook>(() => useErrors());

    // values, setValue, resetValues
    expect(result.current.errors).toEqual({});
    expect(result.current.setError).toBeInstanceOf(Function);
    expect(result.current.resetErrors).toBeInstanceOf(Function);
  });
  
  it('can set errors', () => {
    const { result } = renderHook<Errors, useErrorsHook>(() => useErrors());
  
    act(() => result.current.setError("email", "required"));
    expect(result.current.errors.email).toEqual("required");
  });
  it('can reset errors', () => {
    const { result } = renderHook<Errors, useErrorsHook>(() => useErrors());

    act(() => {
      result.current.setError("cream", "cream is required");
      result.current.setError("soda", "please pick a soda");
      result.current.resetErrors();
    });
    
    expect(result.current.errors).toEqual({});
  });
});
