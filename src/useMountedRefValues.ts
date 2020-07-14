import { useCallback, RefCallback } from 'react';
import { Fields } from './useFields';
import { log } from './utils';

export function useMountedRefValues<
  T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement = HTMLInputElement
>(values?: Fields): RefCallback<T> {
  const ref = useCallback(
    (input: T | null): void => {
      if (input) {
        const value = values?.[input.name];
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
