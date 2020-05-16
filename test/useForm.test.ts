import { renderHook, act } from "@testing-library/react-hooks";
import { useForm } from "../src";

const ERROR = "__required__";
const SUCCESS = "";

describe("useForm", () => {
    describe("with constraints", () => {
        it("supports email types", async () => {
            const { result, waitForNextUpdate } = renderHook(() => useForm({
                onSubmit() { },
                constraints: {
                    email: { type: "email" },
                }
            }));
            const subtest = async (value, shouldFail?) => {
                act(() => {
                    result.current.validateByName('email', value)
                });
                await waitForNextUpdate();
                let exp = expect(result.current.errors.email);
                if (shouldFail) {
                    // @ts-expect-error
                    exp = exp.not;
                }
                exp.toEqual(SUCCESS);
            };
            await subtest("example.com", true);
            await subtest("e@example.com");
            await subtest("john.doe@example.uk.co");
        });
    });
});
