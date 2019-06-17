import { renderHook, act } from 'react-hooks-testing-library'
import { useFields, Values, useFieldsHook } from "../src/useFields"

describe("useFields", () => {
  it("should accept initial values as the only argument", () => {
    const fields = {
      name: "hello"
    };
    const { result } = renderHook<Values, useFieldsHook>(() => useFields(fields));
    expect(result.current.values).toEqual(fields);
  });
  
  it('should return values, setValue, resetValues', () => {
    const { result } = renderHook<Values, useFieldsHook>(() => useFields());

    // values, setValue, resetValues
    expect(result.current.values).toEqual({});
    expect(result.current.setValue).toBeInstanceOf(Function);
    expect(result.current.resetValues).toBeInstanceOf(Function);
  });
  
  it('can set values', () => {
    const { result } = renderHook<Values, useFieldsHook>(() => useFields());
  
    act(() => result.current.setValue("email", "test@example.com"));
    expect(result.current.values.email).toEqual("test@example.com");
  });
  it('can reset values', () => {
    const fields = {
      name: "hello",
      message: "five dollar footlong"
    };
    const { result } = renderHook<Values, useFieldsHook>(() => useFields(fields));

    act(() => {
      result.current.setValue("name", "hello world");
      result.current.setValue("message", "walking across the street is dangerous");
      result.current.resetValues();
    });
    
    expect(result.current.values).toEqual(fields);
  });
});
