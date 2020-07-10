import { Constraints, supportedConstraints, constraintValues, RequiredConstraint } from './types';

function getRuleValueAndMessage(
  rules: Constraints,
  name: supportedConstraints,
): [constraintValues, string] {
  const rule = rules[name];
  let message = '';
  let value: constraintValues;
  if (Array.isArray(rule)) {
    [value, message] = rule;
  } else {
    value = rule ?? '';
  }
  if (name === 'required') {
    message = !message && typeof value === 'string' ? value : message;
    value = Boolean(value);
  }
  return [value, message];
}

export function getRuleValue(rules: Constraints, name: supportedConstraints): constraintValues {
  const [value] = getRuleValueAndMessage(rules, name);
  return value;
}

export function getRuleMessage(rules: Constraints, name: supportedConstraints): string {
  const [, message] = getRuleValueAndMessage(rules, name);
  return message;
}
export function hasRule<T extends supportedConstraints>(
  rules: Constraints,
  name: T,
): rules is RequiredConstraint<T> {
  return {}.hasOwnProperty.call(rules, name);
}
