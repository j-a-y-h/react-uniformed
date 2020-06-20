import { Constraints, constraintValues } from './types';
import { FieldValue } from '../useFields';
import { getRuleValue } from './utils';

function hasValue(value?: FieldValue): value is string {
  return value === 0 || Boolean(value);
}

export const propertyValidators = {
  required(_: Constraints, required: constraintValues, value?: FieldValue): boolean {
    return !required || hasValue(value);
  },
  maxLength(_: Constraints, maxLength: constraintValues, value?: FieldValue): boolean {
    return !hasValue(value) || (typeof value === 'string' && value.length <= Number(maxLength));
  },
  minLength(_: Constraints, minLength: constraintValues, value?: FieldValue): boolean {
    return !hasValue(value) || (typeof value === 'string' && value.length >= Number(minLength));
  },
  max(rules: Constraints, max: constraintValues, value?: FieldValue): boolean {
    if (!hasValue(value)) {
      return true;
    }
    const type = getRuleValue(rules, 'type');
    return type === 'date'
      ? new Date(value) <= new Date(max as string | number)
      : Number(value) <= Number(max);
  },
  min(rules: Constraints, min: constraintValues, value?: FieldValue): boolean {
    if (!hasValue(value)) {
      return true;
    }
    const type = getRuleValue(rules, 'type');
    return type === 'date'
      ? new Date(value) >= new Date(min as string | number)
      : Number(value) >= Number(min);
  },
  type(_: Constraints, type: constraintValues, value: FieldValue = ''): boolean {
    if (!hasValue(value)) {
      return true;
    }
    let regex: RegExp;
    switch (type) {
      case 'url':
        regex = /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)$/;
        return regex.test(value);
      case 'email':
        regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return regex.test(value);
      case 'number':
        return /^-?(\d+|\d+\.\d+|\.\d+)([eE][-+]?\d+)?$/.test(value);
      case 'date':
        // TODO: update to date yyyy-MM-dd
        // TODO: support datetime-local and datetime with warning
        return !Number.isNaN(new Date(value).getTime());
      case 'text':
      default:
        return true;
    }
  },
  pattern(_: Constraints, pattern: constraintValues, value: FieldValue = ''): boolean {
    return !hasValue(value) || !(pattern instanceof RegExp) || pattern.test(value);
  },
};
