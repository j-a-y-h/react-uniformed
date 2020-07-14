import { Ref, useCallback } from 'react';
import { Fields } from './useFields';
import { log } from './utils';

type ValueLikeElement =
  | Pick<HTMLInputElement, 'value' | 'name'>
  | Pick<HTMLSelectElement, 'value' | 'name'>
  | Pick<HTMLTextAreaElement, 'value' | 'name'>;

export function useMountedRefValues<T extends ValueLikeElement = HTMLInputElement>(
  values: Fields,
): Ref<T> {
  const ref = useCallback(
    (input: T | null): void => {
      if (input) {
        const value = values[input.name];
        if (['string', 'number'].includes(typeof value)) {
          if (input.value) {
            // warn if there is a value present
            log.warn(`value is going to be overwritten for '${input.name}' element`);
          }
          // need to set the mounted values
          // eslint-disable-next-line no-param-reassign
          input.value = value;
        }
      }
    },
    [values],
  );
  return ref;
}
