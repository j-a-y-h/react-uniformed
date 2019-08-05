import { useMemo } from "react";
import { Values } from "./useResetableValues";
import { validator } from "./useValidation";
import { log } from "./utils";

// note: not all browsers support validation for some of these types.
// TODO: add number support
type supportedInputTypes = "email" | "text" | "url" | "number";
// possible values:
// "text" | "number" | "date" | "email" | "checkbox" |
// "tel" | "time" | "url" | "week" | "month" | "year" | "range";
const supportedInputTypesSet = new Set(["text", "email", "url", "number"]);
type supportedInputAttributes = "minLength" | "maxLength" | "min" | "max" | "required" | "pattern" | "type";

type propertyValidatorsSetting = boolean | number | RegExp | string;
interface HTML5ValidatorRules {
    /**
     * A minLength used for non number values
     */
    readonly minLength?: number | [number, string];
    /**
     * A maxLength used for non number values
     */
    readonly maxLength?: number | [number, string];
    /**
     * A min boundary used for type numbers
     */
    readonly min?: number | [number, string];
    /**
     * A max boundary used for type numbers
     */
    readonly max?: number | [number, string];
    /**
     * Determines if the field is required
     * @default false
     */
    readonly required?: boolean | string | [boolean, string];
    /**
     * A RegExp pattern used for validation
     */
    readonly pattern?: RegExp | [RegExp, string];
    /**
     * The type of input.
     * currently supported values are **text**, **email**, **url**.
     * email and url types are validated using the appropriate regex
     * @default text
     */
    readonly type?: supportedInputTypes | [string, string];
}
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
    "required",
    "type",
    "pattern",
    "maxLength",
    "minLength",
    "max",
    "min",
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
            case "number":
                return !isNaN(Number(value));
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
            log.warning("HTML5ValidatorError", `(input: ${name}) unsupported type (${type}).
            An unsupported type just means we don't have custom validation logic for this.`);
        }
    }
    if (hasRule(rules, "maxLength") && hasRule(rules, "minLength")) {
        const minLength = getRuleValue(rules, "minLength") as number;
        const maxLength = getRuleValue(rules, "maxLength") as number;
        if (maxLength < minLength) {
            log.warning("HTML5ValidatorError", `(input: ${name}) maxLength (${maxLength}) is less than minLength (${minLength}).`);
        }
    }
    if (hasRule(rules, "min") && hasRule(rules, "max")) {
        const min = getRuleValue(rules, "min") as number;
        const max = getRuleValue(rules, "max") as number;
        if (max < min) {
            log.warning("HTML5ValidatorError", `(input: ${name}) max (${max}) is less than min (${min}).`);
        }
    }
    if (hasRule(rules, "pattern")) {
        const pattern = getRuleValue(rules, "pattern");
        if (!(pattern instanceof RegExp)) {
            log.warning("HTML5ValidatorError", `(input: ${name}) pattern must be a RegExp object.`);
        }
    }
    // perform number validation
    const numberTypeRules: supportedInputAttributes[] = ["min", "max", "maxLength", "minLength"];
    numberTypeRules.forEach((rule): void => {
        if (hasRule(rules, rule)) {
            const ruleValue = getRuleValue(rules, rule);
            if (typeof ruleValue !== "number") {
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

/* eslint-disable import/prefer-default-export */
/**
 * A declarative way of validating inputs
 *
 * @param rules an object mapping that
 * consist of HTML5ValidatorRules as value or validator function that accepts value
 * as the only argument.
 * @return maps the rules to an object map with the value
 * being a function that accepts value as the only argument.
 * @example
 *  const validator = useHTML5Validator({
 *      firstName: { required: true, minLength: 5, maxLength: 6 },
 *      lastName: { required: true, maxLength: 100 },
 *      age: { type: "number", min: 18, max: 99 },
 *      location: { required: true, pattern: /(europe|africa)/},
 *      email: { required: true, type: "email" },
 *      website: { required: true, type: "url" }
 *  })
 */
export function useHTML5Validator(
    rules: Values<HTML5ValidatorRules | validator>,
): Values<validator> {
    return useMemo((): Values<validator> => Object.keys(rules)
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
        }, {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
}
