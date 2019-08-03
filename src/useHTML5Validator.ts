import React from "react";
import { Values } from "./useResetableValues";
import { validator } from "./useValidation";

// note: not all browsers support validation for some of these types.
type supportedInputTypes = "text" | "number" | "date" | "email" | "checkbox" |
"tel" | "time" | "url" | "week" | "month" | "year" | "range";
const supportedInputTypesSet = new Set(["text", "number", "date", "email", "checkbox",
    "tel", "time", "url", "week", "month", "year", "range"]);
type supportedInputAttributes = "minLength" | "maxLength" | "min" | "max" | "required" | "pattern" | "type";
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

function getRuleValueAndMessage(
    name: supportedInputAttributes, rules: HTML5ValidatorRules,
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
    if (name === "type" && (typeof value !== "string" || !supportedInputTypesSet.has(value))) {
        // TODO: throw error telling user that the type is not supported
        value = "text";
    }
    return [value, message];
}

function getRuleValue(
    name: supportedInputAttributes, rules: HTML5ValidatorRules,
): string | number | boolean | RegExp {
    const [value] = getRuleValueAndMessage(name, rules);
    return value;
}
function getRuleMessage(name: supportedInputAttributes, rules: HTML5ValidatorRules): string {
    const [, message] = getRuleValueAndMessage(name, rules);
    return message;
}
function hasRule(name: supportedInputAttributes, rules: HTML5ValidatorRules): boolean {
    return ({}).hasOwnProperty.call(rules, name);
}

function getValidationMessage(input: HTMLInputElement, rules: HTML5ValidatorRules): string {
    let message = "";
    const { validity } = input;
    if (!validity.valid) {
        message = input.validationMessage;
        // TODO: convert to a loop
        if (validity.patternMismatch) {
            message = getRuleMessage("pattern", rules) || message;
        } else if (validity.rangeUnderflow) {
            message = getRuleMessage("min", rules) || message;
        } else if (validity.rangeOverflow) {
            message = getRuleMessage("max", rules) || message;
        } else if (validity.tooLong) {
            message = getRuleMessage("maxLength", rules) || message;
        } else if (validity.tooShort) {
            message = getRuleMessage("minLength", rules) || message;
        } else if (validity.valueMissing) {
            message = getRuleMessage("required", rules) || message;
        } else if (validity.typeMismatch) {
            message = getRuleMessage("type", rules) || message;
        }
    }
    return message;
}

function getStringValue(nonStringValue: string | number | boolean | RegExp): string {
    return (nonStringValue instanceof RegExp) ? nonStringValue.source : String(nonStringValue);
}

function validateUsingHTML5(value: string, rules: HTML5ValidatorRules): string {
    const rulesWithDefaults: HTML5ValidatorRules = {
        type: "text",
        required: false,
        ...rules,
    };
    // TODO: allow support outside of browser context
    const input = document.createElement("input");
    input.required = Boolean(getRuleValue("required", rulesWithDefaults));
    // note: don't put boolean properties here
    const supportedProperties: supportedInputAttributes[] = [
        "maxLength", "minLength", "max", "min", "type",
    ];
    supportedProperties.forEach((property): void => {
        if (hasRule(property, rulesWithDefaults)) {
            const ruleValue = getRuleValue(property, rulesWithDefaults) as string | number | RegExp;
            const stringValue = getStringValue(ruleValue);
            input.setAttribute(property, stringValue);
        }
    });
    input.value = value;
    return getValidationMessage(input, rulesWithDefaults);
}

// a declarative way of validating inputs
// add support for non-native validation, ie we roll our own
// eslint-disable-next-line import/prefer-default-export
export function useHTML5Validator(
    rules: Values<HTML5ValidatorRules | validator>,
): Values<validator> {
    return React.useMemo((): Values<validator> => {
        const rawValidator = Object.keys(rules)
            .reduce((validationMap: MutableValidator, name: string): MutableValidator => {
                const currentValidator = rules[name];
                return {
                    ...validationMap,
                    [name]: (typeof currentValidator !== "function")
                        ? (value: string): string => validateUsingHTML5(value, currentValidator)
                        : currentValidator,
                };
            }, {});
        return rawValidator;
    }, [rules]);
}
