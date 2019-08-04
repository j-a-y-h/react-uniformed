import React from "react";
import { Values } from "./useResetableValues";
import { validator } from "./useValidation";
import { log } from "./utils";

// note: not all browsers support validation for some of these types.
type supportedInputTypes = "email" | "text" | "url";
// possible values:
// "text" | "number" | "date" | "email" | "checkbox" |
// "tel" | "time" | "url" | "week" | "month" | "year" | "range";
const supportedInputTypesSet = new Set(["text", "email", "url"]);
type supportedInputAttributes = "minLength" | "maxLength" | "min" | "max" | "required" | "pattern" | "type";

type propertyValidatorsSetting = boolean | number | RegExp | string;
interface HTML5ValidatorRules {
    readonly minLength?: number | [number, string];
    readonly maxLength?: number | [number, string];
    readonly min?: number | [number, string];
    readonly max?: number | [number, string];
    readonly required?: boolean | string | [boolean, string];
    readonly pattern?: RegExp | [RegExp, string];
    // Date requires a new call
    readonly type?: supportedInputTypes | [string, string];
    // TODO: do we need to suport arrays for radios?
}
// type HTML5Validator = Values<HTML5ValidatorRules>;
interface MutableValidator {
    [name: string]: validator;
}

const defaultMessage = {
    required: "input is required",
    maxLength: "too long",
    minLength: "too short",
    max: "overflow",
    min: "underflow",
    pattern: "pattern mismatch",
    type: "type mismatch",
};

const supportedProperties: supportedInputAttributes[] = [
    "required", "pattern", "maxLength", "minLength", "max", "min", "type",
];

const propertyValidators = {
    required(required: propertyValidatorsSetting, value?: string): boolean {
        return !required || Boolean(value);
    },
    maxLength(maxLength: propertyValidatorsSetting, value?: string): boolean {
        return typeof value === "string" && value.length <= Number(maxLength);
    },
    minLength(minLength: propertyValidatorsSetting, value?: string): boolean {
        return typeof value === "string" && value.length >= Number(minLength);
    },
    max(max: propertyValidatorsSetting, value?: string): boolean {
        return Number(value) <= Number(max);
    },
    min(min: propertyValidatorsSetting, value?: string): boolean {
        return Number(value) >= Number(min);
    },
    // do custom check: email, url, date
    type(type: propertyValidatorsSetting, value: string = ""): boolean {
        let regex: RegExp;
        switch (type) {
            case "url":
                regex = /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
                return regex.test(value);
            case "email":
                regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                return regex.test(value);
            case "text":
            default: return true;
        }
    },
    pattern(pattern: propertyValidatorsSetting, value: string = ""): boolean {
        return !(pattern instanceof RegExp) || pattern.test(value);
    },
};

function getRuleValueAndMessage(
    rules: HTML5ValidatorRules, name: supportedInputAttributes,
): [RegExp | number | boolean | string, string] {
    const rule = rules[name];
    let message = "";
    let value: RegExp | number | boolean | string;
    if (Array.isArray(rule)) {
        ([value, message] = rule);
    } else {
        value = rule || "";
    }
    if (name === "required") {
        value = Boolean(value);
    }
    return [value, message];
}

function getRuleValue(
    rules: HTML5ValidatorRules, name: supportedInputAttributes,
): string | number | boolean | RegExp {
    const [value] = getRuleValueAndMessage(rules, name);
    return value;
}
function getRuleMessage(rules: HTML5ValidatorRules, name: supportedInputAttributes): string {
    const [, message] = getRuleValueAndMessage(rules, name);
    return message;
}
function hasRule(rules: HTML5ValidatorRules, name: supportedInputAttributes): boolean {
    return ({}).hasOwnProperty.call(rules, name);
}

function validateRule(name: string, rules: HTML5ValidatorRules): void {
    // throws warnings for invalid rules
    if (hasRule(rules, "type")) {
        const type = getRuleValue(rules, "type") as string;
        if (!supportedInputTypesSet.has(type)) {
            // console warn unsupported type
            log.warning("HTML5ValidatorError", `(input: ${name}) unsupported type (${type}).
            An unsupported type just means we don't have custom validation logic for this.`);
        }
    }
    if (hasRule(rules, "maxLength") && hasRule(rules, "minLength")) {
        const minLength = getRuleValue(rules, "minLength") as number;
        const maxLength = getRuleValue(rules, "maxLength") as number;
        if (maxLength < minLength) {
            // console warn unsupported type
            log.warning("HTML5ValidatorError", `(input: ${name}) maxLength (${maxLength}) is less than minLength (${minLength}).`);
        }
    }
    if (hasRule(rules, "min") && hasRule(rules, "max")) {
        const min = getRuleValue(rules, "min") as number;
        const max = getRuleValue(rules, "max") as number;
        if (max < min) {
            // console warn unsupported type
            log.warning("HTML5ValidatorError", `(input: ${name}) max (${max}) is less than min (${min}).`);
        }
    }
    if (hasRule(rules, "pattern")) {
        const pattern = getRuleValue(rules, "pattern");
        if (!(pattern instanceof RegExp)) {
            // console warn unsupported type
            log.warning("HTML5ValidatorError", `(input: ${name}) pattern must be a RegExp object.`);
        }
    }
    // perform number validation
    const numberTypeRules: supportedInputAttributes[] = ["min", "max", "maxLength", "minLength"];
    numberTypeRules.forEach((rule): void => {
        if (hasRule(rules, rule)) {
            const ruleValue = getRuleValue(rules, rule);
            if (typeof ruleValue !== "number") {
                // console warn unsupported type
                log.warning("HTML5ValidatorError", `(input: ${name}) ${rule} must be a number.`);
            }
        }
    });
}
function validateUsingHTML5(rules: HTML5ValidatorRules, value?: string): string {
    // check required
    const erroredProperty = supportedProperties.find((property): boolean => {
        let hasError = false;
        if (hasRule(rules, property)) {
            const propValue = getRuleValue(rules, property);
            hasError = !propertyValidators[property](propValue, value);
        }
        return hasError;
    });
    let message = "";
    if (erroredProperty) {
        message = getRuleMessage(rules, erroredProperty)
            || defaultMessage[erroredProperty] || "input is invalid";
    }
    return message;
}

// a declarative way of validating inputs
// add support for non-native validation, ie we roll our own
// eslint-disable-next-line import/prefer-default-export
export function useHTML5Validator(
    rules: Values<HTML5ValidatorRules | validator>,
): Values<validator> {
    const validatorObject = React.useMemo((): Values<validator> => {
        const rawValidator = Object.keys(rules)
            .reduce((validationMap: MutableValidator, name: string): MutableValidator => {
                const currentValidator = rules[name];
                if (typeof currentValidator !== "function") {
                    validateRule(name, currentValidator);
                }
                return {
                    ...validationMap,
                    [name]: (typeof currentValidator !== "function")
                        ? (value?: string): string => validateUsingHTML5(currentValidator, value)
                        : currentValidator,
                };
            }, {});
        return rawValidator;
    }, [rules]);
    // TODO: don't memo rules,
    return validatorObject;
}
