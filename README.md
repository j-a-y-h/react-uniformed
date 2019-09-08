# react-uniformed - **Lightweight / Fast / Simple / Scalable**

<div align="center"><p align="center">

[![travis](https://travis-ci.com/j-a-y-h/react-uniformed.svg?branch=develop)](https://travis-ci.com/j-a-y-h/react-uniformed.svg?branch=develop)
[![Coverage Status](https://coveralls.io/repos/github/j-a-y-h/react-uniformed/badge.svg?branch=coveralls)](https://coveralls.io/github/j-a-y-h/react-uniformed?branch=coveralls)
[![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)
[![npm](https://badgen.net/bundlephobia/minzip/react-uniformed)](https://badgen.net/bundlephobia/minzip/react-uniformed)

</p></div>

**react-uniformed** is a lightweight library that simplifies the creation of declarative React forms using only React Hooks. Additionally, this library will out perform all of the popular React form libraries without adding complexity to your code.

*You don't have to learn a new framework with a massive API in order to do forms, <u>just use **react-uniformed**</u>*

##### Overview
* ‍️💆🏾‍♂️ Simple API
* 🐐  Lightweight / Fast / Scalable
* 🙅🏻‍♀️ Zero dependencies
* 📜 HTML standard validation
* 🚀 Controlled & Uncontrolled inputs support

##### References
* [Validation](#validation)
* [Performance](#performance)
* [API](https://github.com/j-a-y-h/react-uniformed/blob/develop/docs/API.md)
* [Examples](https://github.com/j-a-y-h/react-uniformed/blob/develop/examples/)

## Install

NPM
```shell
npm install --save react-uniformed
```
Yarn
```shell
yarn add react-uniformed
```

## Getting Started
```javascript
import {useForm, useSettersAsEventHandler} from "react-uniformed";

// useForm holds the state of the form (ie touches, values, errors)
const { setValue, values, submit } = useForm({
    onSubmit: data => console.log(JSON.stringify(data)),
});

// compose your event handlers using useSettersAsEventHandler
const handleChange = useSettersAsEventHandler(setValue);

return (
    {/* the submit function is only called after the form passes validation */}
    <form onSubmit={submit}>
        <label>Name</label>
        <input
            name="name"
            value={values.name}
            onChange={handleChange}
        />
        <label>Email</label>
        <input
            name="email"
            value={values.email}
            onChange={handleChange}
        />
        <input type="submit" />
    </form>
  );
```

## Validation
Add validation to your form by setting the `validators` property in `useForm` and start validation by calling `validateByName` or `validate`. Then read the validation state from the `errors` object.
```javascript
import {useForm, useSettersAsEventHandler, useConstraints} from "react-uniformed";

// Use HTML5 style validation
const validators = useConstraints({
    name: { required: true, minLength: 1, maxLength: 55 },
    // email & url types are validated using HTML standard regex
    email: { required: true, type: "email" },
    date: {
        // set the error message for required by using a non empty string
        required: "Date is required",
        type: "date",
        // set the error message and constraint using an array
        min: [Date.now(), "Date must be today or later"]
    }
});

const { setValue, validateByName, errors } = useForm({
    validators,
    onSubmit: data => console.log(JSON.stringify(data)),
});

// validate on change with the following code
// const handleChange = useSettersAsEventHandler(setValue, validateByName);
// or validate on blur
const handleBlur = useSettersAsEventHandler(validateByName);
```

## Performance
**react-uniformed** supports uncontrolled inputs that uses React refs to synchronize the state of the input in the DOM and the state of the form in the Virtual DOM.  The uncontrolled input allows us to avoid expensive React renders on keyup or change.
```javascript
import {useSettersAsRefEventHandler} from "react-uniformed";

// useSettersAsRefEventHandler defaults to an on change event
const changeRef = useSettersAsRefEventHandler(setValue);

// name attribute is still required as the changeRef calls setValue(name, value) on change
<input name="name" ref={changeRef} />
```

`useSettersAsRefEventHandler` is generally only needed for larger forms or larger React VDOMs. In addition to the `useSettersAsRefEventHandler`, **react-uniformed** also supports validation maps. Validation maps allows you to only validate the input that changed using `validateByName`. There are several ways to accomplish this...

```javascript
const {validateByName, errors} = useForm({
    validators: {
        // validators must return empty string for valid value
        name: (value) => value ? "" : "email is required",
    },
});

// useConstraints supports mixing validators and constraints
const validators = useConstraints({
    name: (value) => "name still won't be valid",
    email: { required: true },
});

// when used with useSettersAsEventHandler the validator
// will call the validation that matches the current input element's name
const handleBlur = useSettersAsEventHandler(validateByName);
```
If you prefer to validate in one function, then you can do that as well
```javascript
const {
    // note: validateByName will call the validate function on each call
    // but the error will be the one with the corresponding name
    validateByName,
    // validate is available with both a validation map and a validation function
    validate,
} = useForm({
    validators(values) {
        const errors = {name: "name will never be valid", email: ""};
        if (!values.email) {
            errors.email = "email is required";
        }
        return errors;
    },
});
```
## More Hooks
It should be noted that `useForm` is just one layer of abstraction used to simplify the form building process. If you need more granular control and orchestration of your form, then you should avoid using `useForm` in favor of other form hooks like `useFields`, `useTouch`, `useValidation`, and `useSubmission`. The following is a basic implementation of `useForm` that you can use to compose your forms.
```javascript
import {useCallback} from "react";
import {
    useFields, useTouch, useValidation, useHandlers, useSubmission
} from "react-uniformed";

function useForm() {
    // tracks the input values
    const { values, setValue, resetValues } = useFields();

    // tracks the touch state of inputs
    const { touches, touchField, resetTouches } = useTouch();

    // handles validation
    const { validateByName, validate, errors, resetErrors } = useValidation({
        name: () => "",
    });

    // composes a "form reset" function
    const reset = useHandlers(resetValues, resetErrors, resetTouches);

    // creates a validation handler that binds the values
    const validator = useCallback(() => validate(values), [values, validate]);

    // useSubmission doesn't concern it self with the values of the form,
    // so we must bind the onSubmit handler and the validator with the values
    const onSubmit = useCallback(() => console.log(values), [values]);

    // Guards against submissions until all values are valid
    const { submit } = useSubmission({ onSubmit, validator });
}
```