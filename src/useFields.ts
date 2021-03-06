import { useCallback, useMemo } from 'react';
import { useGenericValues, UseResetableValuesHook } from './useGenericValues';

// Could switch to a generic but that's a can of worms
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FieldValue = any;

export type MutableFields = Partial<{
  [key: string]: FieldValue;
}>;
export type Fields = Readonly<MutableFields>;

interface SetField {
  (name: string, value: FieldValue, eventTarget?: EventTarget | null): void;
}
export interface UseFieldsHook extends Omit<UseResetableValuesHook<FieldValue>, 'setValue'> {
  readonly setValue: SetField;
}

export interface NormalizeSetValue {
  readonly name: string;
  readonly value: FieldValue;
  readonly currentValues: Fields;
  readonly eventTarget?: EventTarget | null;
  normalizeName(normalizedName: string): void;
}
export interface NormalizerHandler {
  (valuesUpdate: NormalizeSetValue): FieldValue;
}

function getResetValue(currentValue: FieldValue): FieldValue {
  switch (typeof currentValue) {
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'object':
      return Array.isArray(currentValue) ? [] : undefined;
    case 'string':
    default:
      return '';
  }
}

// TODO: add examples

// eslint-disable-next-line import/prefer-default-export
/**
 * A hook for managing form values.
 *
 * @param initialValues - The initial values for the form
 * @param normalizer - A normalizer handler that transforms the field values.
 * See {@link useNormalizers}.
 * @returns An api for setting, reading, resetting form values.
 */
export function useFields(initialValues?: Fields, normalizer?: NormalizerHandler): UseFieldsHook {
  const { setValues, setValue: setGenericValue, ...resetableValues } = useGenericValues(
    initialValues,
  );
  const setValue = useMemo(() => {
    if (typeof normalizer === 'function') {
      return (name: string, value: FieldValue, eventTarget?: EventTarget | null): void => {
        setValues(
          (currentValues: Fields): Fields => {
            let normalizedName = name;
            const normalizedValue = normalizer({
              name,
              value,
              currentValues,
              eventTarget,
              normalizeName(newName: string) {
                normalizedName = newName;
              },
            });
            return {
              ...currentValues,
              [normalizedName]: normalizedValue,
            };
          },
        );
      };
    }
    return setGenericValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const resetValues = useCallback((): void => {
    setValues(
      (currentState: Fields): Fields => {
        const nonNullInitialValues: MutableFields = { ...initialValues };
        return Object.keys(currentState).reduce((newState, key) => {
          // if no initial value then set it to the default reset value
          if (!{}.hasOwnProperty.call(newState, key)) {
            // eslint-disable-next-line no-param-reassign
            newState[key] = getResetValue(currentState[key]);
          }
          return newState;
        }, nonNullInitialValues);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return {
    ...resetableValues,
    setValues,
    resetValues,
    setValue,
  };
}
