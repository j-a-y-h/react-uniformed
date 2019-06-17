import { renderHook } from 'react-hooks-testing-library'
import { useFields } from "../src/useFields"

describe("useFields hook", () => {
  test('should return values object, setValue function, resetValues function', () => {
    const { result } = renderHook<any, any>(() => useFields());
  
    // values, setValue, resetValues
    expect(result.current.values).toBe("object");
    expect(result.current.setValue).toBeInstanceOf(Function);
    expect(result.current.resetValues).toBeInstanceOf(Function);
  });
});
