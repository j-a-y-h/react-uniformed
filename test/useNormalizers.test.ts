// import { renderHook, act } from 'react-hooks-testing-library'
import { normalizeNestedObjects } from "../src/useNormalizers";

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
            dontTouchThis: "",
            team: {
                leavemeAlone: {
                    first: "",
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
        const normalizer = normalizeNestedObjects();
        normalizer({
            normalizeName,
            currentValues: {},
            name: key,
            value: 55,
        });
        expect(keyToChange).toEqual("user");
    });
});