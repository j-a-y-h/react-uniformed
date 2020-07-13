import { Ref, useCallback } from 'react';
import { Fields } from './useFields';
import { ReactOrNativeEventListener } from './useSettersAsEventHandler';

type Props = Readonly<{
  values?: Fields;
  handleChange?: ReactOrNativeEventListener;
  handleBlur?: ReactOrNativeEventListener;
}>;

interface UseAnchor {
  anchor: Ref<HTMLFormElement>;
}

export function useAnchor({}: Props): UseAnchor {
  const anchor = useCallback((form: HTMLFormElement | null): void => {}, []);
  return { anchor };
}
