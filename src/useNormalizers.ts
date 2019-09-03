import { useCallback } from "react";
import { userSuppliedValue, Fields } from "./useFields";

type NormalizeSetValue = Readonly<{
    name: string,
    value: userSuppliedValue,
    currentValues: Fields,
    eventTarget?: EventTarget | null,
}>;
export interface NormalizerHandler {
    (valuesUpdate: NormalizeSetValue): Fields;
}
export type UseNormalizersOption = Readonly<{
    names: string | RegExp | (string | RegExp)[],
    normalizer: NormalizerHandler;
}>;

function createNestedObject({ currentValue, valueToSet, path, shadowCopy }: {
    currentValue: any,
    valueToSet: userSuppliedValue,
    path: string[],
    shadowCopy: any,
}): any {
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
        return valueToSet;
    }
    const key = rawKey.replace(/(^\[\s*['"]?|['"]?\s*\]$)/g, "");
    let mergedValue = currentValue;
    let newIndex: string | number = key;
    if (key !== rawKey) {
        const arrayIndex = Number(key);
        if (!Number.isNaN(arrayIndex)) {
            // handle array
            newIndex = arrayIndex;
            mergedValue = Object.assign([], shadowCopy);
        } else {
            // handle object
            mergedValue = Object.assign({}, shadowCopy);
        }
    }
    mergedValue[newIndex] = createNestedObject({
        currentValue: mergedValue,
        valueToSet,
        path,
        shadowCopy: shadowCopy && shadowCopy[newIndex]
    });
    return mergedValue;
}

/**
 * Used to add nested object support to useFields or useForms. This
 * function supports nesting with brackets. E.g. referencing an
 * array value indexed at 0 `arrayName[0]`; referencing an object
 * value indexed at country `locations[country]`.
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
    return ({ name, value, currentValues }: NormalizeSetValue) => {
        const nestedKeys = name.match(/(\w+|\[\w+\]|\['[^']+'\]|\["[^"]+"\])/gy);
        const keys = nestedKeys ? Array.from(nestedKeys) : [name];
        if (keys.length === 1) {
            // abort normalization
            return value;
        } else {
            const currentValueCopy = { [name]: currentValues[name] };
            return createNestedObject({
                currentValue: currentValueCopy,
                valueToSet: value,
                path: keys,
                shadowCopy: currentValueCopy
            });
        }
    };
}

/**
 * Creates a single normalizer function from the specified list of normalizers.
 * note: order matters when passing normalizers. This means that the results or value
 * of the first normalizer is passed to the next normalizer.
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
    const normalize = useCallback(({ name, value, currentValues, element }: NormalizeSetValue) => {
        const nameMatches = (matcher: string | RegExp): boolean => {
            return matcher instanceof RegExp ? matcher.test(name) : matcher === name;
        };
        // pipe the value through the normalizers
        return normalizers.reduce((currentValue, normalizerObj) => {
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
                ? normalizer({ name, value: currentValue, currentValues, element })
                : currentValue;
        }, value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return normalize;
 }