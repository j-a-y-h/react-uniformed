import {} from 'react';
import { Fields } from './useFields';
import { Errors, validErrorValues } from './useErrors';
import { PartialValues } from './useGenericValues';
import { ReactOrNativeEventListener } from './useSettersAsEventHandler';

type Props = Readonly<{
  values: Fields;
  handleChange: ReactOrNativeEventListener;
  handleBlur: ReactOrNativeEventListener;
  errors: Errors | PartialValues<Errors, validErrorValues>;
}>;

interface UseAnchor {}

export function useAnchor({}: Props): UseAnchor {}
