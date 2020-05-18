# react-uniformed - **Declarative React forms using hooks**

<div align="center"><p align="center">

[![travis](https://travis-ci.com/j-a-y-h/react-uniformed.svg?branch=develop)](https://travis-ci.com/j-a-y-h/react-uniformed.svg?branch=develop)
[![Downloads](https://img.shields.io/npm/dt/react-uniformed.svg?style=flat)](https://img.shields.io/npm/dt/react-uniformed.svg?style=flat)
[![Coverage Status](https://coveralls.io/repos/github/j-a-y-h/react-uniformed/badge.svg?branch=develop)](https://coveralls.io/github/j-a-y-h/react-uniformed?branch=develop)
[![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)
[![npm](https://badgen.net/bundlephobia/minzip/react-uniformed)](https://badgen.net/bundlephobia/minzip/react-uniformed)

</p></div>

**react-uniformed** allows you to create declarative React forms using only React Hooks.  The simplicity of this library removes the pain of remembering another complex React library, allowing you to focus on your app's business logic. We built this library with exceptional performance so that you can maintain a great user experience regardless of your application's scale - [try the performance story](https://github.com/j-a-y-h/react-uniformed/blob/develop/stories).

*You don't have to learn a new framework with a massive API in order to do forms, <u>just use **react-uniformed**</u>*

##### Overview
* ‍️💆🏾‍♂️ Simple API
* 🙅🏻‍♀️ Zero dependencies
* 📜 HTML standard validation
* 🚀 Controlled & Uncontrolled inputs support

##### Documentation
* [API Reference](https://github.com/j-a-y-h/react-uniformed/blob/develop/docs/README.md)
* [Quick Start](#quick-start)
* [Validation](#validation)
* [Performance](#performance)

##### Examples
* [codesandbox.io](https://codesandbox.io/s/react-uniformed-nwj10)
* [Storybook](https://github.com/j-a-y-h/react-uniformed/blob/develop/stories)
* [Code Examples](https://github.com/j-a-y-h/react-uniformed/blob/develop/examples/)


## Install

NPM
```shell
npm install --save react-uniformed
```
Yarn
```shell
yarn add react-uniformed
```

## Quick Start
```javascript
import React from "react";
import {useForm, useSettersAsEventHandler} from "react-uniformed";

// useForm holds the state of the form (ie touches, values, errors)
const { setValue, values, submit } = useForm({
  onSubmit: data => console.log(JSON.stringify(data)),
});

// compose your event handlers using useSettersAsEventHandler
const handleChange = useSettersAsEventHandler(setValue);

// jsx
<form onSubmit={submit}>
  <label>Name</label>
  <input name="name" value={values.name} onChange={handleChange}/>

  <label>Email</label>
  <input name="email" value={values.email} onChange={handleChange} />

  <button>Submit</button>
</form>
```

## Validation
Add validation to your form by setting the `validators` property in `useForm` and start validation by calling `validateByName` or `validate`. Then read the validation state from the `errors` object.
```javascript
import {useForm, useSettersAsEventHandler} from "react-uniformed";

const { setValue, validateByName, errors } = useForm({
  // Declarative HTML5 style form validation
  constraints: {
    name: { required: true, minLength: 1, maxLength: 55 },
    // email & url types are validated using HTML standard regex
    email: { type: "email" },
    date: {
      // set the error message for required by using a non empty string
      required: "Date is required",
      type: "date",
      // set the error message and constraint using an array
      min: [Date.now(), "Date must be today or later"]
    }
  },
  // the onSubmit function is only called after the form passes validation.
  onSubmit: data => console.log(JSON.stringify(data)),
});

// No configs for when to validate the form because useSettersAsEventHandler
// allows you to configure your event handlers how ever you want to.

// validate on change
// const handleChange = useSettersAsEventHandler(setValue, validateByName);
// validate on blur
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
    // validators must return empty string for valid values
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
  // but the error will be the one with the corresponding name.
  validateByName,
  validate, // validate all values
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

function useForm({onSubmit, validators, constraints}) {
  // tracks the input values
  const { values, setValue, resetValues } = useFields();

  // tracks the touch state of inputs
  const { touches, touchField, resetTouches, isDirty } = useTouch();

  // handles validation
  const {
    validateByName,
    validate,
    errors,
    resetErrors,
    hasErrors,
  } = useValidation(validators || constraints); // this is not the real implementation

  // composes a "form reset" function
  const reset = useHandlers(resetValues, resetErrors, resetTouches);

  // creates a validation handler that binds the values
  const validator = useCallback(() => validate(values), [values, validate]);

  // Guards against submissions until all values are valid
  const { submit } = useSubmission({ onSubmit, validator, values, reset, disabled: hasErrors });
}
```