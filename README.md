# react-uniformed / **Declarative React Forms**

**react-uniformed** is a feather weight library that allows for the creation of declarative React forms using hooks.


At first glance one may mistaken **react-uniformed** for one of the MANY React form libraries. However, as you dive deeper you will find features from this library that allows you to simplify the complexity of your forms while maintaining a performance edge on all of the popular React form libraries.

## Install

NPM
```shell
npm install react-uniformed
```
Yarn
```shell
yarn add react-uniformed
```

## Getting Started
The following demonstrates the basic use of **react-uniformed**

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
        <input name="email"
            value={values.email}
            onChange={handleChange}
        />
        <input type="submit" />
    </form>
  );
```

## Form Validation
Add validation to your form by setting the `validators` property in `useForm` and start validation by calling `validateByName` or `validate`. Then read the validation state from the `errors` object.
```javascript
import {useForm, useSettersAsEventHandler, useConstraints} from "react-uniformed";

// Use HTML5 style validation
const validator = useConstraints({
    name: { required: true, minLength: 1, maxLength: 55 },
    // email types are validated using HTML standard regex
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
    validators: validator,
    onSubmit: data => console.log(JSON.stringify(data)),
});
// validate on change with the following code
// const handleChange = useSettersAsEventHandler(setValue, validateByName);
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

`useSettersAsRefEventHandler` is generally only needed for larger forms or larger React trees. In addition to the `useSettersAsRefEventHandler`, **react-uniformed** as supports validation maps. Validation maps allows you to only validate the input that changed using `validateByName`. There is several ways to accomplish this...

```javascript
const {validateByName, errors} = useForm({
    validators: {
        // name won't be valid because validators must return empty string for valid values
        name: (value) => "name will never be valid",
        email: (value) => value ? "" : "email is required"
    },
});
// or as observed above, using useConstraints hook
const validator = useConstraints({
    name: (value) => "name still won't be valid",
    email: { required: true }
})
// when used with useSettersAsEventHandler the validator
// will call the validation that matches the current input element's name
const handleBlur = useSettersAsEventHandler(validateByName);
```
If you prefer to validate in one function, then you can do that as well
```javascript
const {
    // validateByName will call the validate function on each call
    // but the error will be the one with the corresponding name
    validateByName,
    // validate is available with both a validation map and a validation function
    validate,
} = useForm({
    validators: (values) => {
        const errors = {name: "name will never be valid", email: ""};
        if (!values.email) {
            errors.email = "email is required"
        }
        return errors;
    },
});
```
## Build Forms Without `useForm`
It should be noted that `useForm` is just one layer of abstraction used to simplify the form building process. If you need more granular control and orchestration of your form then you should avoid using `useForm`. The following is basic implementation of `useForm`
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
    const { validateByName, validate, errors, resetErrors } = useValidation(validators);
    // composes a "form reset" function
    const reset = useHandlers(resetValues, resetErrors, resetTouches);
    // creates a validation handler that binds the values
    const validator = useCallback(() => validate(values), [values, validate]);
    // useSubmission doesn't concern it self with the values of the form,
    // so we must bind the onSubmit handler and the validator with the values
    const handleSubmit = useCallback(() => console.log(values), [values]);
    // handles the submission of the form by guarding submission until all values are valid
    const { isSubmitting, submit, submitCount } = useSubmission({
        onSubmit: handleSubmit,
        validator: submissionValidator,
    });
}
```

**react-uniformed** was built from the ground up. Meaning, `useForm` was an abstraction that was created after defining all of the building blocks need for a React form.  This design allows you to break out of the abstracted layer and compose your own layer of abstraction that better suits your use case.