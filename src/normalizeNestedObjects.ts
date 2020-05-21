import {
  NormalizerHandler, NormalizeSetValue, FieldValue, Fields, MutableFields,
} from './useFields';

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
  const key = rawKey.replace(/(^\[\s*['"]?|['"]?\s*\]$)/g, '');
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
    shadowCopy: shadowCopy?.[newIndex],
  });
  return mergedValue;
}


/**
 * Used to add nested object support to useFields or useForms. Nested objects
 * must use bracket notation. E.g. referencing an
 * array value indexed at `0` would look like this `arrayName[0]`; referencing an object
 * value that is keyed by `'country'` would look like this `locations[country]`.
 *
 * @returns Returns a normalizer handler
 * @example <caption>Basic mapping</caption>
 * ```javascript
 *    // jsx
 *    <input name="users[0]" value="John">
 *    // field value
 *    {users: ["John"]}
 *
 *    // jsx
 *    <input name="users[0][name]" value="John">
 *    // field value
 *    {users: [{
 *        name: "John"
 *    }]}
 *
 *    // jsx
 *    <input name="user['string keys with spaces']" value="John">
 *    // field value
 *    {user: {"string keys with spaces": "John"}}
 * ```
 * @example <caption>Usage with {@link useForm} and {@link useFields}</caption>
 * ```javascript
 * const {values} = useFields(
 *   {}, // initialValues must come first
 *   normalizeNestedObjects()
 * );
 *
 * const {values} = useForm({
 *   normalizer: normalizeNestedObjects()
 * });
 * ```
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
