import { renderHook } from '@testing-library/react-hooks'
import { normalizeNestedObjects, useNormalizers } from "../src";

describe("normalizeNestedObjects", () => {
    it("normalizes nested arrays", () => {
        let key = "user[1]";
        const normalizeName = (): void => {};
        const normalizer = normalizeNestedObjects();
        const results: any = normalizer({
            normalizeName,
            currentValues: { user: [99,, "test"] },
            name: key,
            value: 55,
        });
        expect([99, 55, "test"]).toEqual(expect.arrayContaining(results));
    });
    it("normalizes nested objects", () => {
        let key = "user[name]";
        const normalizeName = (): void => {};
        const normalizer = normalizeNestedObjects();
        const results: any = normalizer({
            normalizeName,
            currentValues: { user: { name: "old name"} },
            name: key,
            value: "John Doe",
        });
        expect(results).toMatchObject({ name: "John Doe" });
    });
    it("merges current value", () => {
        let key = "user[team][first]";
        const normalizeName = (): void => {};
        const normalizer = normalizeNestedObjects();
        const results: any = normalizer({
            normalizeName,
            currentValues: {
                user: {
                    dontTouchThis: "leave this alone",
                    team: {
                        leavemeAlone: {
                            first: "please don't change this",
                        },
                        first: "old name"
                    }
                }
            },
            name: key,
            value: "John Doe",
        });
        expect(results).toMatchObject({
            dontTouchThis: "leave this alone",
            team: {
                leavemeAlone: {
                    first: "please don't change this",
                },
                first: "John Doe"
            }
        });
    });
    it('normalizes the key', () => {
        let key = "user[0]";
        let keyToChange = key;
        const normalizeName = (newKey: string): void => {
            keyToChange = newKey;
        };
        normalizeNestedObjects()({
            normalizeName,
            currentValues: {},
            name: key,
            value: 55,
        });
        expect(keyToChange).toEqual("user");
    });
    it("handles non-nested objects", () => {
        const results = normalizeNestedObjects()({
            normalizeName: (): void => { },
            currentValues: {},
            name: "name",
            value: "John",
        });
        expect(results).toEqual("John");
    });
    it("handles keys with spaces", () => {
        let key = `user['name with space'][" double quotes "]`;
        const normalizeName = (): void => {};
        const normalizer = normalizeNestedObjects();
        const results: any = normalizer({
            normalizeName,
            currentValues: {},
            name: key,
            value: 55,
        });
        expect(results).toMatchObject({ 'name with space': { " double quotes ": 55 } });
    });
});

describe("useNormalizers", () => {
    it("Pipes value in order", () => {
        const hook = renderHook(() => useNormalizers(
            {
                name: /name$/i,
                normalizer: ({ value }) => `${value}123`,
            },
            {
                name: "name",
                normalizer: ({ value }) => `${value}456`,
            },
            {
                name: ["name", /name$/i],
                normalizer: ({ value }) => `${value}789`,
            }
        ));
        const results = hook.result.current({
            normalizeName(): void { },
            currentValues: {},
            name: "name",
            value: "John",
        });
        expect(results).toEqual("John123456789");
    });
    it("Skips normalizer if name doesn't match", () => {
        const hook = renderHook(() => useNormalizers(
            {
                name: /name$/i,
                normalizer: ({ value }) => `${value}123`,
            },
            {
                name: "email",
                normalizer: ({ value }) => `${value}456`,
            },
            {
                name: ["name", /name$/i],
                normalizer: ({ value }) => `${value}789`,
            }
        ));
        const results = hook.result.current({
            normalizeName(): void { },
            currentValues: {},
            name: "name",
            value: "John",
        });
        expect(results).toEqual("John123789");
    });
    it("Accepts normalizer functions as arguments", () => {
        const hook = renderHook(() => useNormalizers(
            normalizeNestedObjects(),
        ));
        const results = hook.result.current({
            normalizeName(): void { },
            currentValues: {},
            name: "name[john]",
            value: "John",
        });
        expect(results).toEqual({ john: "John" });
    });
});