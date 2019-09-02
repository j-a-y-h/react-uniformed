import { useMemo, useCallback } from "react";

/*
if a normalizer is set
   then all calls to setValue, setValues are routed through the normalizer
   the normalizers will have access to the input name, value, currentState, inputElement?
   normalizers must return a value

normalizer: (name, value, currentValues, element?) => userValue
normalizer: (newValues, currentValues) => Object

boundaries:
    normalizing is for mapping a value to a property or

NestedObjects
   - read the current state and make precise updates
   - syntax:
    - Array: users[0], users[1]
        - users: [String, String]
    - Object: users[0][name], users[0][email]
        - users: [{name: String, email: String}]

ConvertToArray
   - read the current state, create a unique id for the inputElement (fallback #id, then value)
   - use a map to map updates then return the values of the map

const normalizer = useNormalizer(nestedObjects, ConvertValuesToArray("value"), Convert(Boolean))
const {} = useFields({}, opts: {normalizer});


const normalizer = useNormalizer(nestedObjects);
const {} = useForms({onSubmit, normalizer});


const normalizer = useNormalizers(
    nestedObjects,
    {
        names: [""],
        normalizers: (v) => !v ? v : v.toLowerCase()
    },
    {
        names: /name.+/,
        normalizers: [nestedObjects, (v) => !v ? v : v.toUpperCase()]
    }
);

normalizer("name[0][location]", "asfd", currentValues, element);

const normalizer = useNormalizers(nestedObjects);
const {} = useForms({onSubmit, normalizer});
*/
type NormalizeSetValue = Readonly<{
    name: string,
    value: any,
    currentValues: any,
    element?: any | null,
}>;
interface NormalizerHandler {
    (valuesUpdate: NormalizeSetValue): any;
}
export type UseNormalizersOption = Readonly<{
    names: string | RegExp | (string | RegExp)[],
    normalizer: NormalizerHandler;
}>;
export function normalizeNestedObjects(): NormalizerHandler {
    return ({ name, value, currentValues }: NormalizeSetValue) => {
    };
 }
export function useNormalizers(
    ...normalizers: (NormalizerHandler | UseNormalizersOption)[]
): NormalizerHandler {
    const memoNormalizers = useMemo(() => normalizers, []);
    const normalize = useCallback(({ name, value, currentValues, element }: NormalizeSetValue) => {
        const nameMatches = (matcher: string | RegExp): boolean => {
            return matcher instanceof RegExp ? matcher.test(name) : matcher === name;
        };
        // pipe the value through the normalizers
        return memoNormalizers.reduce((currentValue, normalizerObj) => {
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
    }, []);
    return normalize;
 }
