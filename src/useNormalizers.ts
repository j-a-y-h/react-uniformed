import { useCallback } from 'react';
import { FieldValue, NormalizerHandler, NormalizeSetValue } from './useFields';

export type UseNormalizersOption = Readonly<{
  name: string | RegExp | (string | RegExp)[];
  normalizer: NormalizerHandler;
}>;

/**
 * Creates a single normalizer function from the specified list of normalizers.
 * note: order matters when passing normalizers. This means that the results or value
 * of the first normalizer is passed to the next normalizer.
 *
 * @param normalizers - if you
 * pass a normalizer handler then it will apply to all fields. You can specify
 * a specific list of fields by passing in a {@link UseNormalizersOption}
 * @returns returns a normalizer handler
 * @example
 *```javascript
 * const normalizer = useNormalizers(
 *    // apply to all fields
 *    normalizeNestedObjects(),
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
 *      name: ["username", /^slug$/],
 *      normalizer: ({value}) => !value ? value : value.toLowerCase(),
 *    }
 * )
 * ```
 * @example <caption>Usage with {@link useForm} and {@link useFields}</caption>
 * ```javascript
 * const normalizer = useNormalizers({
 *   name: /name$/i,
 *   normalizer: ({value}) => !value ? value : value.toUpperCase()
 * });
 *
 * const {values} = useFields(
 *   {}, // initialValues must come first
 *   normalizer
 * );
 *
 * const {values} = useForm({ normalizer });
 * ```
 */
export function useNormalizers(
  ...normalizers: (NormalizerHandler | UseNormalizersOption)[]
): NormalizerHandler {
  return useCallback(({ name, value, ...opts }: NormalizeSetValue) => {
    const nameMatches = (matcher: string | RegExp): boolean =>
      matcher instanceof RegExp ? matcher.test(name) : matcher === name;
    // pipe the value through the normalizers
    return normalizers.reduce((currentValue: FieldValue, normalizerObj): FieldValue => {
      let normalizer: NormalizerHandler | undefined;
      if (typeof normalizerObj === 'function') {
        // apply the normalizer to all
        normalizer = normalizerObj;
      } else {
        // apply to only matching names
        const { name: names, normalizer: handler } = normalizerObj;
        const matches = Array.isArray(names) ? names.some(nameMatches) : nameMatches(names);
        if (matches) {
          // name matches so apply
          normalizer = handler;
        }
      }
      return normalizer ? normalizer({ name, value: currentValue, ...opts }) : currentValue;
    }, value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
