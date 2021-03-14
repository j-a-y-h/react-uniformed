/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useCallback, RefCallback } from 'react';
import { Fields } from './useFields';
import { log } from './utils';

export function useMountedRefValues<
  T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement = HTMLInputElement
>(values?: Fields): RefCallback<T> {
  const ref = useCallback(
    (input: T | null): void => {
      if (input) {
        // @ts-expect-error
        const value = values?.[input.name];
        if (['string', 'number'].includes(typeof value)) {
          // @ts-expect-error
          if (input.value) {
            // warn if there is a value present
            // @ts-expect-error
            log.warn(`value is going to be overwritten for '${input.name}' element`);
          }
          // need to set the mounted values
          // @ts-expect-error
          // eslint-disable-next-line no-param-reassign
          input.value = value;
        }
      }
    },
    [values],
  );
  return ref;
}
