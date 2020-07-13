import { Ref, useCallback } from 'react';
import { Fields } from './useFields';

type Props = Readonly<{
  values: Fields;
}>;

export function useMountedRefValues<T extends HTMLElement = HTMLElement>({
  values,
}: Props): Ref<T> {
  const ref = useCallback((input: T | null): void => {}, [event]);
  return ref;
}
