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
interface NormalizerHandler {
    (name: string, value: any, currentValues: any): any;
    (name: string, value: any, currentValues: any, element?: any | null): any;
}
export type UseNormalizersOption = Readonly<{
    names: string | RegExp | (string | RegExp)[],
    normalizers: NormalizerHandler | NormalizerHandler[];
}>;
function nestedObjects(): NormalizerHandler {  }
function convertValues() {  }
export function useNormalizers() {  }
