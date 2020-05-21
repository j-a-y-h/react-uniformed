import { renderHook } from '@testing-library/react-hooks';
import { useConstraints } from "../src";
import { supportedTypesSet, supportedProperties } from "../src/useConstraints/types";

describe("useConstraints", () => {
    const ERROR = "__required__";
    const SUCCESS = "";

    it("only supports email, url, text, number, and date types", () => {
        expect(["email", "url", "text", "number", "date"]).toEqual(
            expect.arrayContaining(Array.from(supportedTypesSet))
        );
    });
    it("supports email types", () => {
        const { result } = renderHook(() => useConstraints({
            email: { type: "email" },
        }));
        expect(result.current.email("example.com")).not.toEqual(SUCCESS);
        expect(result.current.email("e@example.com")).toEqual(SUCCESS);
        expect(result.current.email("john.doe@example.uk.co")).toEqual(SUCCESS);
     });
    it("supports number types", () => {
        const { result } = renderHook(() => useConstraints({
            number: { type: "number" },
        }));
        // @ts-ignore
        expect(result.current.number(new Date())).not.toEqual(SUCCESS);
        expect(result.current.number(5)).toEqual(SUCCESS);
        expect(result.current.number(5e4)).toEqual(SUCCESS);
        expect(result.current.number("asdfasdf")).not.toEqual(SUCCESS);
    });
    it("supports url types", () => {
        const { result } = renderHook(() => useConstraints({
            url: { type: "url" },
        }));
        // @ts-ignore
        expect(result.current.url(new Date())).not.toEqual(SUCCESS);
        expect(result.current.url(5)).not.toEqual(SUCCESS);
        expect(result.current.url("http://example.com")).toEqual(SUCCESS);
        expect(result.current.url("example.uk.co")).not.toEqual(SUCCESS);
        expect(result.current.url("https://dom.www.exa-mple.uk.co")).toEqual(SUCCESS);
    });
    it("supports text types", () => {
        const { result } = renderHook(() => useConstraints({
            text: { type: "text" },
        }));
        expect(result.current.text("asdfkalsdfk")).toEqual(SUCCESS);
        expect(result.current.text(55)).toEqual(SUCCESS);
    });
    it("supports date types", () => {
        const { result } = renderHook(() => useConstraints({
            date: { type: "date" },
        }));
        // @ts-ignore
        expect(result.current.date(new Date())).toEqual(SUCCESS);
        expect(result.current.date("asdfdsfds")).not.toEqual(SUCCESS);
        expect(result.current.date(Date.now())).toEqual(SUCCESS);
    });
    it("only supports required, type, pattern, maxLength, minLength, max, and min constraints", () => {
        expect(["required", "type", "pattern", "maxLength", "minLength", "max", "min",]).toEqual(
            expect.arrayContaining(Array.from(supportedProperties))
        );
    });
    it("supports pattern constraint", () => {
        const { result } = renderHook(() => useConstraints({
            pattern: { pattern: /johndoe/ },
        }));
        expect(result.current.pattern("johndoe")).toEqual(SUCCESS);
        expect(result.current.pattern(55)).not.toEqual(SUCCESS);
        expect(result.current.pattern(" johndoe ")).toEqual(SUCCESS);
        expect(result.current.pattern(0)).not.toEqual(SUCCESS);
    });
    it("supports type constraint", () => {
        const { result } = renderHook(() => useConstraints({
            type: { type: "number" },
            type2: { type: "email" },
        }));
        expect(result.current.type("55")).toEqual(SUCCESS);
        expect(result.current.type(55)).toEqual(SUCCESS);
        expect(result.current.type("bad number")).not.toEqual(SUCCESS);
        expect(result.current.type2(0)).not.toEqual(SUCCESS);
    });
    it("supports maxLength constraint", () => {
        const { result } = renderHook(() => useConstraints({
            maxLength: { maxLength: 3 },
        }));
        expect(result.current.maxLength(2)).not.toEqual(SUCCESS);
        expect(result.current.maxLength("bad number")).not.toEqual(SUCCESS);
        expect(result.current.maxLength(0)).not.toEqual(SUCCESS);
        expect(result.current.maxLength("bad")).toEqual(SUCCESS);
        expect(result.current.maxLength("b")).toEqual(SUCCESS);
    });
    it("supports minLength constraint", () => {
        const { result } = renderHook(() => useConstraints({
            minLength: { minLength: 3 },
        }));
        expect(result.current.minLength(3)).not.toEqual(SUCCESS);
        expect(result.current.minLength(3333)).not.toEqual(SUCCESS);
        expect(result.current.minLength("b")).not.toEqual(SUCCESS);
        expect(result.current.minLength(0)).not.toEqual(SUCCESS);
        expect(result.current.minLength("bad number")).toEqual(SUCCESS);
        expect(result.current.minLength("bad")).toEqual(SUCCESS);
    });
    it("supports minLength and maxLength range contraint", () => {
        const { result } = renderHook(() => useConstraints({
            lengthRange: { minLength: 3, maxLength: 7 },
        }));
        expect(result.current.lengthRange(3)).not.toEqual(SUCCESS);
        expect(result.current.lengthRange("b")).not.toEqual(SUCCESS);
        expect(result.current.lengthRange("test")).toEqual(SUCCESS);
        expect(result.current.lengthRange(8675309)).not.toEqual(SUCCESS);
        expect(result.current.lengthRange("cookies")).toEqual(SUCCESS);
        expect(result.current.lengthRange("mountains")).not.toEqual(SUCCESS);
    });
    it("supports max constraint", () => {
        const { result } = renderHook(() => useConstraints({
            max: { max: 3 },
        }));
        expect(result.current.max(4)).not.toEqual(SUCCESS);
        expect(result.current.max("b")).not.toEqual(SUCCESS);
        expect(result.current.max("2")).toEqual(SUCCESS);
        expect(result.current.max(2)).toEqual(SUCCESS);
        expect(result.current.max(3)).toEqual(SUCCESS);
     });
    it("supports min constraint", () => {
        const { result } = renderHook(() => useConstraints({
            min: { min: 3 },
        }));
        expect(result.current.min(2)).not.toEqual(SUCCESS);
        expect(result.current.min("b")).not.toEqual(SUCCESS);
        expect(result.current.min(3333)).toEqual(SUCCESS);
        expect(result.current.min("5")).toEqual(SUCCESS);
        expect(result.current.min(3)).toEqual(SUCCESS);
    });
    it("supports min and max range constraint", () => {
        const { result } = renderHook(() => useConstraints({
            range: { min: 5, max: 15},
        }));
        expect(result.current.range(3)).not.toEqual(SUCCESS);
        expect(result.current.range(7)).toEqual(SUCCESS);
        expect(result.current.range(17)).not.toEqual(SUCCESS);

    });
    it("supports required constraints", () => {
        const { result } = renderHook(() => useConstraints({
            required: { required: true },
        }));
        expect(result.current.required("")).not.toEqual(SUCCESS);
        expect(result.current.required(undefined)).not.toEqual(SUCCESS);
        expect(result.current.required(null)).not.toEqual(SUCCESS);
        expect(result.current.required("dfads")).toEqual(SUCCESS);
        expect(result.current.required(0)).toEqual(SUCCESS);
    });
    it("constraints supports custom error messages", () => {
        const { result } = renderHook(() => useConstraints({
            required: { required: ERROR },
            required2: { required: [true, ERROR] },
            type: { type: ["number", ERROR] },
            pattern: { pattern: [/johndoe/, ERROR] },
            maxLength: { maxLength: [3, ERROR] },
            minLength: { minLength: [3, ERROR] },
            max: { max: [3, ERROR] },
            min: { min: [3, ERROR] },
        }));
        expect(result.current.required()).toEqual(ERROR);
        expect(result.current.required2()).toEqual(ERROR);
        expect(result.current.type("asdf")).toEqual(ERROR);
        expect(result.current.pattern("asf")).toEqual(ERROR);
        expect(result.current.maxLength("dasdfjlsd")).toEqual(ERROR);
        expect(result.current.minLength("d")).toEqual(ERROR);
        expect(result.current.max(5)).toEqual(ERROR);
        expect(result.current.min(1)).toEqual(ERROR);
    });
    it("optional constraints", () => {
        const { result } = renderHook(() => useConstraints({
            optional: {},
            optional2: { required: false },
            optional3: { required: [false, ERROR]},
            type: { type: "number" },
            pattern: { pattern: /johndoe/ },
            maxLength: { maxLength: 3 },
            minLength: { minLength: 3 },
            max: { max: 3 },
            min: { min: 3 },
        }));
        const validate = (value?: any) => {
            expect(result.current.optional(value)).toEqual(SUCCESS);
            expect(result.current.type(value)).toEqual(SUCCESS);
            expect(result.current.pattern(value)).toEqual(SUCCESS);
            expect(result.current.maxLength(value)).toEqual(SUCCESS);
            expect(result.current.minLength(value)).toEqual(SUCCESS);
            expect(result.current.max(value)).toEqual(SUCCESS);
            expect(result.current.min(value)).toEqual(SUCCESS);
        };
        validate();
        validate(undefined);
        validate(null);
        validate("");
    });
    it("min and max supports date types", () => {
        const now = new Date("2019-08-21");
        const past = new Date("2015-08-21");
        const future = "2020-08-21"; // this is on purpose

        // @ts-ignore
        const { result } = renderHook(() => useConstraints({
            // @ts-ignore
            max: { max: now, type: "date" },
            // @ts-ignore
            min: { min: now, type: "date" },
        }));
        // @ts-ignore
        expect(result.current.min(now)).toEqual(SUCCESS);
        expect(result.current.min(future)).toEqual(SUCCESS);
        // @ts-ignore
        expect(result.current.min(past)).not.toEqual(SUCCESS);
        // @ts-ignore
        expect(result.current.max(now)).toEqual(SUCCESS);
        // @ts-ignore
        expect(result.current.max(past)).toEqual(SUCCESS);
        expect(result.current.max(future)).not.toEqual(SUCCESS);
    });
    it("supports custom validators", () => {
        const { result } = renderHook(() => useConstraints({
            custom: (value) => value ? SUCCESS : ERROR,
        }));
        expect(result.current.custom()).toEqual(ERROR);
        expect(result.current.custom("anything")).toEqual(SUCCESS);
    });
    it("keeps values in sync with sync validator", async () => {
        const { result } = renderHook(() => useConstraints((values: any): any => {
            return {
                start: { max: [values.end, ERROR] },
                end: { min: [values.start, ERROR] },
            };
        }));
        const validate = async (values: Record<string, number>, expectation: Object) => {
            let validation = await result.current(values);
            expect(validation).toEqual(expectation);
        };
        await validate(
            { start: 55, end: 75, },
            { start: SUCCESS, end: SUCCESS },
        );
        await validate(
            { start: 75, end: 75, },
            { start: SUCCESS, end: SUCCESS },
        );
        await validate(
            { start: 75.1, end: 75, },
            { start: ERROR, end: ERROR },
        );
    });
});