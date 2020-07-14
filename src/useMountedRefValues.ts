import { Ref, useCallback } from 'react';
import { Fields } from './useFields';

type Props = Readonly<{
  values: Fields;
}>;

type ValueLikeElement =
  | Pick<HTMLInputElement, 'value' | 'name'>
  | Pick<HTMLSelectElement, 'value' | 'name'>
  | Pick<HTMLTextAreaElement, 'value' | 'name'>;

export function useMountedRefValues<T extends ValueLikeElement = HTMLInputElement>({
  values,
}: Props): Ref<T> {
  // TODO: console warn if the node already has a value
  const ref = useCallback(
    (input: T | null): void => {
      if (input) {
        const value = values[input.name];
        if (['string', 'number'].includes(typeof value)) {
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
