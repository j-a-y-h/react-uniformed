## react-uniformed
**Declarative React Forms**

----

**react-uniformed** is a micro library that allows for the creation of declarative forms.

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
```javascript
import {useForm, useSettersAsEventHandler} from "react-uniformed";

// useForm holds the state of the form (ie touches, values, errors)
const { setValue, values, submit } = useForm({
    onSubmit: data => {
        console.log(JSON.stringify(data));
    },
});
// compose your event handlers using useSettersAsEventHandler
const handleChange = useSettersAsEventHandler(setValue);
return (
    {/* the submit function is only called after the form passes validation */}
    <form onSubmit={submit}>
        <div>
            <label>Name</label>
            <input
                name="name"
                {/* this is a common controlled input example */}
                value={values.name}
                onChange={handleChange}
            />
        </div>
        <div>
            <label>Email</label>
            <input
                name="email"
                value={values.email}
                onChange={handleChange}
            />
        </div>
        <input type="submit" />
    </form>
  );
```

## Form Validation

```javascript
import {useForm, useSettersAsEventHandler, useConstraints} from "react-uniformed";

// Use HTML5 style validation
const validator = useConstraints({
    name: { required: true, minLength: 1, maxLength: 55 },
    // email types are validated using HTML standard regex
    email: { required: true, type: "email" },
    // like email types, url types are validated using HTML standard regex
    website: { type: "url" },
    date: {
        // set the error message for required by using a non empty string
        required: "Date is required",
        type: "date",
        // set the error message and constraint using an array
        min: [Date.now(), "Date must be today or later"]
    }
});
const { setValue, validateByName, values, submit } = useForm({
    validators: validator,
    onSubmit: data => {
        console.log(JSON.stringify(data));
    },
});
const handleChange = useSettersAsEventHandler(setValue);
// validate on change with the following code
// const handleChange = useSettersAsEventHandler(setValue, validateByName);
const handleBlur = useSettersAsEventHandler(validateByName);
return (
    <form onSubmit={submit}>
        <div>
            <label>Name</label>
            <input
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
            />
        </div>
        <div>
            <label>Email</label>
            <input
                name="email"
                value={values.email}
                onChange={handleChange}
            />
        </div>
        <input type="submit" />
    </form>
  );
```

## Performance
**react-uniformed** supports an uncontrolled input api that uses React refs.  The source of truth for the form values is still hosted at the form level.
```javascript
import {useSettersAsRefEventHandler} from "react-uniformed";

// useSettersAsRefEventHandler defaults to an on change event
const changeRef = useSettersAsRefEventHandler(setValue);

{/* name attribute is still required as the changeRef calls the setValue(name: string, value: any) function */}
<input name="name" ref={changeRef} />
```

`useSettersAsRefEventHandler` is generally only need for larger forms or larger DOM trees. In addition to the ref api, **react-uniformed** as supports validation maps. Validation maps allows you to only validate the input that changed using `validateByName`. There is several ways to accomplish this...

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
```
