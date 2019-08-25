## Functions

<dl>
<dt><a href="#useConstraints">useConstraints(rules)</a> ⇒</dt>
<dd><p>A declarative way of validating inputs based upon HTML 5 constraints</p>
</dd>
<dt><a href="#useValidation">useValidation(validator, expectedFields)</a> ⇒</dt>
<dd><p>A hook for performing validation.</p>
</dd>
</dl>

<a name="useConstraints"></a>

## useConstraints(rules) ⇒
A declarative way of validating inputs based upon HTML 5 constraints

**Kind**: global function  
**Returns**: maps the rules to an object map with the value
being a function that accepts value as the only argument.  

| Param | Description |
| --- | --- |
| rules | an object mapping that consist of HTML5ValidatorRules as value or validator function that accepts value as the only argument. |

**Example**  
```js
// BASIC
 const validator = useConstraints({
     firstName: { required: true, minLength: 5, maxLength: 6 },
     lastName: { required: true, maxLength: 100 },
     age: { type: "number", min: 18, max: 99 },
     location: { required: true, pattern: /(europe|africa)/},
     email: { required: true, type: "email" },
     website: { required: true, type: "url" }
 })
 // ADVANCED
 const validator = useConstraints({
     // use min, max on date type
     startDate: { type: "date", min: Date.now() },
     // custom message
     name: {
         required: "name is required",
         maxLength: [55, "name must be under 55 characters"]
     },
 })
 // BIND CONSTRAINTS TO VALUES
 const validator = useConstraints((values) => ({
     startDate: { type: "date", min: Date.now() },
     // ensure that the end date is always greater than the start date
     endDate: {
         type: "date",
         min: [values.startDate, "end date must be greater than start date"]
     },
 }))
 // note: if you are using the constraints with the useForm hook
 // then you can bind the validator with the values so that the handler
 // can be used with events
 const handleBlur = useValidationWithValues(validator, values);
```
<a name="useValidation"></a>

## useValidation(validator, expectedFields) ⇒
A hook for performing validation.

**Kind**: global function  
**Returns**: returns an useValidation object  

| Param | Description |
| --- | --- |
| validator | A validation map or a validation function. |
| expectedFields | Define the fields required for validation. This is useful if you want certain fields to always be validated (ie required fields). If you are using a validation map, then this value will default to the keys of the validation map. |

**Example**  
```js
// validate using validation maps
const {validateByName, errors} = useValidation({
    name: (value) => value ? "" : "name is required!",
    email: (value) => value ? "" : "email is required!"
});

// "email is required!"
await validateByName("email", "");
// {email: "email is required!"}
console.log(errors);

// validate with one validation function
const {errors, validate} = useValidation((values) => {
    const errors = {name: "", email: ""};
    if (!values.name) {
        errors.name = "name is required!";
    }
    if (!values.email) {
        errors.email = "email is required!";
    }
    return errors;
});

// {name: "", email: "email is required!"}
await validate({name: "John"});
// {name: "", email: "email is required!"}
console.log(errors);
```
