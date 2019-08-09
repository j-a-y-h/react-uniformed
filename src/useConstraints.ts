import { useMemo } from "react";
import { Values } from "./useResetableValues";
import {
    validator, Validators, singleValidator, validateValidators,
} from "./useValidation";
import { log } from "./utils";
import { Errors } from "./useErrors";

type supportedTypes = "email" | "text" | "url" | "number" | "date";
// possible values:
// "text" | "number" | "date" | "email" | "checkbox" |
// "tel" | "time" | "url" | "week" | "month" | "year" | "range";
const supportedTypesSet = new Set(["text", "email", "url", "number", "date"]);
type supportedConstraints = "minLength" | "maxLength" | "min" | "max" | "required" | "pattern" | "type";

type constraintValues = boolean | number | RegExp | string;
interface Constraints {
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
     *
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
     *
     * @default text
     */
    readonly type?: supportedTypes | [string, string];
}
interface MutableValidator {
    [name: string]: validator;
}

type syncedConstraint = (values: Values<string>) => Values<Constraints | validator>;

const defaultMessage = {
    required: "There must be a value (if set).",
    maxLength: "The number of characters is too long.",
    minLength: "The number of characters is too short.",
    max: "The value is too large.",
    min: "The value is too small.",
    pattern: "The value must match the pattern.",
    type: "The value must match the type.",
};

const supportedProperties: supportedConstraints[] = [
    "required",
    "type",
    "pattern",
    "maxLength",
    "minLength",
    "max",
    "min",
];

function getRuleValueAndMessage(
    rules: Constraints, name: supportedConstraints,
): [constraintValues, string] {
    const rule = rules[name];
    let message = "";
    let value: constraintValues;
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

function getRuleValue(rules: Constraints, name: supportedConstraints): constraintValues {
    const [value] = getRuleValueAndMessage(rules, name);
    return value;
}

const propertyValidators = {
    required(rules: Constraints, required: constraintValues, value?: string): boolean {
        return !required || Boolean(value);
    },
    maxLength(rules: Constraints, maxLength: constraintValues, value?: string): boolean {
        return !value || (typeof value === "string" && value.length <= Number(maxLength));
    },
    minLength(rules: Constraints, minLength: constraintValues, value?: string): boolean {
        return !value || (typeof value === "string" && value.length >= Number(minLength));
    },
    max(rules: Constraints, max: constraintValues, value?: string): boolean {
        if (!value) {
            return true;
        }
        const type = getRuleValue(rules, "type");
        return (type === "date")
            ? new Date(value || "") <= new Date(max as string | number || "")
            : Number(value) <= Number(max);
    },
    min(rules: Constraints, min: constraintValues, value?: string): boolean {
        if (!value) {
            return true;
        }
        const type = getRuleValue(rules, "type");
        return (type === "date")
            ? new Date(value || "") >= new Date(min as string | number || "")
            : Number(value) >= Number(min);
    },
    // do custom check: email, url, date
    type(rules: Constraints, type: constraintValues, value: string = ""): boolean {
        if (!value) {
            return true;
        }
        let regex: RegExp;
        switch (type) {
            case "url":
                regex = /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
                return regex.test(value);
            case "email":
                regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                return regex.test(value);
            case "number":
                return !Number.isNaN(Number(value));
            case "date":
                return !Number.isNaN((new Date(value)).getTime());
            case "text":
            default: return true;
        }
    },
    pattern(rules: Constraints, pattern: constraintValues, value: string = ""): boolean {
        return !value || (!(pattern instanceof RegExp) || pattern.test(value));
    },
};

function getRuleMessage(rules: Constraints, name: supportedConstraints): string {
    const [, message] = getRuleValueAndMessage(rules, name);
    return message;
}
function hasRule(rules: Constraints, name: supportedConstraints): boolean {
    return ({}).hasOwnProperty.call(rules, name);
}

function validateRule(name: string, rules: Constraints): void {
    // throws warnings for invalid rules
    if (hasRule(rules, "type")) {
        const type = getRuleValue(rules, "type") as string;
        if (!supportedTypesSet.has(type)) {
            log.warning("ConstraintError", `(input: ${name}) unsupported type (${type}).
            An unsupported type just means we don't have custom validation logic for this.`);
        }
    }
    if (hasRule(rules, "maxLength") && hasRule(rules, "minLength")) {
        const minLength = getRuleValue(rules, "minLength") as number;
        const maxLength = getRuleValue(rules, "maxLength") as number;
        if (maxLength < minLength) {
            log.warning("ConstraintError", `(input: ${name}) maxLength (${maxLength}) is less than minLength (${minLength}).`);
        }
    }
    if (hasRule(rules, "min") && hasRule(rules, "max")) {
        const min = getRuleValue(rules, "min") as number;
        const max = getRuleValue(rules, "max") as number;
        if (max < min) { // TODO: convert to date for date type
            log.warning("ConstraintError", `(input: ${name}) max (${max}) is less than min (${min}).`);
        }
    }
    if (hasRule(rules, "pattern")) {
        const pattern = getRuleValue(rules, "pattern");
        if (!(pattern instanceof RegExp)) {
            log.warning("ConstraintError", `(input: ${name}) pattern must be a RegExp object.`);
        }
    }
}
function validateUsingHTML5(rules: Constraints, value?: string): string {
    // check required
    const erroredProperty = supportedProperties.find((property): boolean => {
        let hasError = false;
        if (hasRule(rules, property)) {
            const propValue = getRuleValue(rules, property);
            hasError = !propertyValidators[property](rules, propValue, value);
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

function mapConstraintsToValidators(rules: Values<Constraints | validator>): Validators {
    return Object.keys(rules)
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
}

/* eslint-disable import/prefer-default-export */
/**
 * A declarative way of validating inputs based upon HTML 5 constraints
 *
 * @param rules an object mapping that
 * consist of HTML5ValidatorRules as value or validator function that accepts value
 * as the only argument.
 * @return maps the rules to an object map with the value
 * being a function that accepts value as the only argument.
 * @example
 *  // BASIC
 *  const validator = useConstraints({
 *      firstName: { required: true, minLength: 5, maxLength: 6 },
 *      lastName: { required: true, maxLength: 100 },
 *      age: { type: "number", min: 18, max: 99 },
 *      location: { required: true, pattern: /(europe|africa)/},
 *      email: { required: true, type: "email" },
 *      website: { required: true, type: "url" }
 *  })
 *  // ADVANCED
 *  const validator = useConstraints({
 *      // use min, max on date type
 *      startDate: { type: "date", min: Date.now() },
 *      // custom message
 *      name: {
 *          required: "name is required",
 *          maxLength: [55, "name must be under 55 characters"]
 *      },
 *  })
 *  // BIND CONSTRAINTS TO VALUES
 *  const validator = useConstraints((values) => ({
 *      startDate: { type: "date", min: Date.now() },
 *      // ensure that the end date is always greater than the start date
 *      endDate: {
 *          type: "date",
 *          min: [values.startDate, "end date must be greater than start date"]
 *      },
 *  }))
 *  // this requires binding the validator with the values
 *  const handleBlur = useValidationWithValues(validator, values);
 */
export function useConstraints(
    rules: Values<Constraints | validator> | syncedConstraint,
): Validators | singleValidator<string> {
    return useMemo((): Validators | singleValidator<string> => {
        if (typeof rules === "function") {
            return (values: Values<string>): Promise<Errors> => {
                const constraints = rules(values);
                const validators = mapConstraintsToValidators(constraints);
                const names = Object.keys(constraints);
                return validateValidators(names, validators, values);
            };
        }
        return mapConstraintsToValidators(rules);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
}
