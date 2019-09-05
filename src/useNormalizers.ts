import { useCallback } from "react";
import {
    Fields, FieldValue, MutableFields, NormalizerHandler, NormalizeSetValue,
} from "./useFields";

export type UseNormalizersOption = Readonly<{
    names: string | RegExp | (string | RegExp)[];
    normalizer: NormalizerHandler;
}>;

type createNestedObjectProps = Readonly<{
    currentValue: Fields;
    value: FieldValue;
    path: string[];
    // TODO: find a better solution than any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shadowCopy?: any;
}>;

function createNestedObject({
    currentValue, value, path, shadowCopy,
}: createNestedObjectProps): FieldValue {
    /*
        ex: user[0][name]
        {
            user: [
                {name: any}
            ]
        }
    */
    const rawKey = path.shift();
    if (!rawKey) {
        return value;
    }
    const key = rawKey.replace(/(^\[\s*['"]?|['"]?\s*\]$)/g, "");
    let mergedValue: MutableFields = currentValue;
    let newIndex: string | number = key;
    if (key !== rawKey) {
        const arrayIndex = Number(key);
        if (!Number.isNaN(arrayIndex)) {
            // handle array
            newIndex = arrayIndex;
            mergedValue = Object.assign([], shadowCopy);
        } else {
            // handle object
            mergedValue = { ...shadowCopy };
        }
    }
    mergedValue[newIndex] = createNestedObject({
        value,
        path,
        currentValue: mergedValue,
        shadowCopy: shadowCopy && shadowCopy[newIndex],
    });
    return mergedValue;
}

/**
 * Used to add nested object support to useFields or useForms. This
 * function supports nesting with brackets. E.g. referencing an
 * array value indexed at 0 `arrayName[0]`; referencing an object
 * value indexed at country `locations[country]`.
 *
 * @return {NormalizerHandler} Returns a normalizer handler
 * @example
 *    // jsx
 *    <input name="user[0]" value="John">
 *    // field value
 *    {user: ["John"]}
 *
 *    // jsx
 *    <input name="user[0][name]" value="John">
 *    // field value
 *    {user: [{
 *        name: "John"
 *    }]}
 *
 *    <input name="user['string keys with spaces']"
 */
export function normalizeNestedObjects(): NormalizerHandler {
    return ({
        name, value, currentValues, normalizeName,
    }: NormalizeSetValue): FieldValue => {
        const nestedKeys = name.match(/(\w+|\[\w+\]|\['[^']+'\]|\["[^"]+"\])/gy);
        const path = nestedKeys ? Array.from(nestedKeys) : [name];
        if (path.length === 1) {
            // abort normalization
            return value;
        }
        // note: the as string is due to keys.length always being greater than 1
        //   at this point in the code
        const topKey = path.shift() as string;
        const currentValue = currentValues[topKey] as Fields;
        normalizeName(topKey);
        return createNestedObject({
            value,
            path,
            currentValue,
            shadowCopy: currentValue,
        });
    };
}

/**
 * Creates a single normalizer function from the specified list of normalizers.
 * note: order matters when passing normalizers. This means that the results or value
 * of the first normalizer is passed to the next normalizer.
 *
 * @param {(NormalizerHandler | UseNormalizersOption)[]} normalizers if you
 * pass a normalizer handler then it will apply to all fields. You can specify
 * a specific list of fields by passing in
 * @return {NormalizerHandler} returns a normalizer handler
 * @example
 *
 * useNormalizers(
 *    // apply to all fields
 *    normalizeNestedObjects,
 *    {
 *      // apply to only fields ending in name (eg: firstName, lastName)
 *      name: /name$/i,
 *      normalizer: ({value}) => !value ? value : value.toUpperCase(),
 *    },
 *    {
 *      // apply to only the date field
 *      name: "date",
 *      normalizer: ({value}) => !value ? value : value.replace(/-/g, "/"),
 *    },
 *    {
 *      // apply to username or slug field
 *      name: ["username", "slug"],
 *      normalizer: ({value}) => !value ? value : value.toLowerCase(),
 *    }
 * )
 */
export function useNormalizers(
    ...normalizers: (NormalizerHandler | UseNormalizersOption)[]
): NormalizerHandler {
    const normalize = useCallback(({
        name, value, ...opts
    }: NormalizeSetValue) => {
        const nameMatches = (matcher: string | RegExp): boolean => (matcher instanceof RegExp
            ? matcher.test(name)
            : matcher === name
        );
        // pipe the value through the normalizers
        return normalizers.reduce((currentValue: FieldValue, normalizerObj): FieldValue => {
            let normalizer: NormalizerHandler | undefined;
            if (typeof normalizerObj === "function") {
                // apply the normalizer to all
                normalizer = normalizerObj;
            } else {
                // apply to only matching names
                const { names, normalizer: handler } = normalizerObj;
                const matches = Array.isArray(names)
                    ? names.some(nameMatches)
                    : nameMatches(names);
                if (matches) {
                    // name matches so apply
                    normalizer = handler;
                }
            }
            return normalizer
                ? normalizer({ name, value: currentValue, ...opts })
                : currentValue;
        }, value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return normalize;
}
