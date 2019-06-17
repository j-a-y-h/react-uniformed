import { renderHook } from 'react-hooks-testing-library'
import { useFields, Fields } from "../src/useFields"

describe("useFields", () => {
  test("should accept initial values as the only argument", () => {
    const fields = {
      name: "hello"
    };
    const { result } = renderHook<Fields, any>(() => useFields(fields));
    expect(result.current.values).toEqual(fields);
  });
  
  test('should return values, setValue, resetValues', () => {
    const { result } = renderHook<Fields, any>(() => useFields());
  
    // values, setValue, resetValues
    expect(result.current.values).toEqual({});
    expect(result.current.setValue).toBeInstanceOf(Function);
    expect(result.current.resetValues).toBeInstanceOf(Function);
  });
});
