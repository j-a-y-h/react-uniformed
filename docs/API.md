## Functions

<dl>
<dt><a href="#useConstraints">useConstraints(rules)</a> ⇒</dt>
<dd><p>A declarative way of validating inputs based upon HTML 5 constraints</p>
</dd>
<dt><a href="#useForm">useForm(props)</a> ⇒ <code>UseFormsHook</code></dt>
<dd><p>A hook for managing form states.</p>
</dd>
<dt><a href="#useFunctionStats">useFunctionStats(fnc)</a> ⇒ <code>UseFunctionStats.&lt;T, K&gt;</code></dt>
<dd><p>Keeps track of certain statistics on a function. Eg: if the function
is invoking and how many times the function was called.</p>
</dd>
<dt><a href="#getInputValue">getInputValue(input)</a> ⇒</dt>
<dd><p>Gets the value for the specified input.</p>
</dd>
<dt><a href="#useValidateAsSetter">useValidateAsSetter(validate, values)</a> ⇒ <code>eventLikeHandlers</code></dt>
<dd><p>Creates a function that accepts a name and value as parameters.
When the returned function is invoked, it will call the specified
validate function with the specified values merged in with the name
and value passed to the invoked function.</p>
</dd>
<dt><a href="#normalizeNestedObjects">normalizeNestedObjects()</a> ⇒ <code>NormalizerHandler</code></dt>
<dd><p>Used to add nested object support to useFields or useForms. This
function supports nesting with brackets. E.g. referencing an
array value indexed at 0 <code>arrayName[0]</code>; referencing an object
value indexed at country <code>locations[country]</code>.</p>
</dd>
<dt><a href="#useNormalizers">useNormalizers(normalizers)</a> ⇒ <code>NormalizerHandler</code></dt>
<dd><p>Creates a single normalizer function from the specified list of normalizers.
note: order matters when passing normalizers. This means that the results or value
of the first normalizer is passed to the next normalizer.</p>
</dd>
<dt><a href="#useSettersAsRefEventHandler">useSettersAsRefEventHandler(args)</a> ⇒ <code>Ref</code></dt>
<dd><p>A hook that adds support for uncontrolled inputs using
React refs. The React ref is used to synchronize the state of the input in the DOM
and the state of the form in the Virtual DOM.
This hook is generally only needed for larger forms or larger React Virtual DOM.</p>
</dd>
<dt><a href="#useSubmission">useSubmission(param)</a> ⇒ <code>Object</code></dt>
<dd><p>Handles the form submission. Runs validation before calling the <code>onSubmit</code> function
if a validator was passed in.  If no validator was passed in, then the <code>onSubmit</code> function
will be invoked.  The validator function must set the state on disabled to true, if there
were errors. Disabled will prevent this hook from calling the <code>onSubmit</code> function.</p>
<p>Below is a flow diagram for this hook</p>
<pre><code>               submit(Event)
                    |
  (no) - (validator is a function?) - (yes)
   |                                    |
 onSubmit(Event)                   validator()
                                        |
                      (no) - (disabled set to `false`?) - (yes)
                                                            |
                                                       onSubmit(Event)</code></pre></dd>
<dt><a href="#useValidation">useValidation(validator)</a> ⇒</dt>
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
<a name="useForm"></a>

## useForm(props) ⇒ <code>UseFormsHook</code>
A hook for managing form states.

**Kind**: global function
**Returns**: <code>UseFormsHook</code> - the APIs used to manage the state of a function.
**See**

- [useConstraints](#useConstraints)
- [useValidation](#useValidation)
- [useSubmission](#useSubmission)
- [useFields](useFields)
- [useSettersAsEventHandler](useSettersAsEventHandler)
- [useSettersAsRefEventHandler](#useSettersAsRefEventHandler)
- [useValidateAsSetter](#useValidateAsSetter)


| Param | Type | Description |
| --- | --- | --- |
| props | <code>UseFormParameters</code> | the props api |
| props.onSubmit | <code>function</code> | a callback function for form submissions |
| props.initialValues | <code>Fields</code> | the initial form values |
| props.normalizer | <code>NormalizerHandler</code> | a handler that translates form values before setting values |
| props.validators | <code>Validators</code> \| <code>SingleValidator.&lt;FieldValue&gt;</code> | the validators used to validate values |
| props.constraints | <code>ConstraintValidators</code> \| <code>SyncedConstraint</code> | the constraints api |

**Example**
```js
const { submit, setValue, values } = useForm({
  onSubmit: data => alert(JSON.stringify(data))
});
const handleChange = useSettersAsEventHandler(setValue);

// jsx
<form onSubmit={submit}>
   <input
      name="name"
      value={values.name}
      onChange={handleChange}
   />
</form>
```
**Example**
```js
// using validate in change events

const { submit, setValue, validate, values } = useForm({
  onSubmit: data => alert(JSON.stringify(data))
});
// Although this will work, you should avoid validating all inputs on change b/c
// it may cost you in performance.
const validateAllOnChange = useValidateAsSetter(validate, values);
// this will set the value of inputs on change and validate all form inputs
const handleChange = useSettersAsEventHandler(setValue, validateAllOnChange);

// jsx
<form onSubmit={submit}>
  <input
    name="name"
    value={values.name}
    onChange={handleChange}
  />
</form>
```
<a name="useFunctionStats"></a>

## useFunctionStats(fnc) ⇒ <code>UseFunctionStats.&lt;T, K&gt;</code>
Keeps track of certain statistics on a function. Eg: if the function
is invoking and how many times the function was called.

**Kind**: global function
**Returns**: <code>UseFunctionStats.&lt;T, K&gt;</code> - Returns a object.
- `isRunning`: determines if a function was running
- `fnc`: the specified function
- `invokeCount`: the number to times the function was called

| Param | Description |
| --- | --- |
| fnc | the specified function |

<a name="getInputValue"></a>

## getInputValue(input) ⇒
Gets the value for the specified input.

**Kind**: global function
**Returns**: the value as a string

| Param | Description |
| --- | --- |
| input | the specified input |

<a name="getInputValue..ret"></a>

### getInputValue~ret
let value = "";
if (target instanceof HTMLSelectElement || target.selectedOptions) {
    const values = Array.from(target.selectedOptions).map((option) => option.value);
    value = target.multiple ? values : value[0];
} else {
    ({value} = target);
}

**Kind**: inner property of [<code>getInputValue</code>](#getInputValue)
<a name="useValidateAsSetter"></a>

## useValidateAsSetter(validate, values) ⇒ <code>eventLikeHandlers</code>
Creates a function that accepts a name and value as parameters.
When the returned function is invoked, it will call the specified
validate function with the specified values merged in with the name
and value passed to the invoked function.

**Kind**: global function
**Returns**: <code>eventLikeHandlers</code> - a function that can be invoked with a name and value.
**See**

- [useSettersAsEventHandler](useSettersAsEventHandler)
- [useSettersAsRefEventHandler](#useSettersAsRefEventHandler)


| Param | Type | Description |
| --- | --- | --- |
| validate | <code>ValidateAllHandler.&lt;FieldValue&gt;</code> | a validation function that accepts an object of values |
| values | <code>Fields</code> | a values object |

**Example**
```js
// used with useForms
const {validate, values, setValue} = useForms(...);
const validateAll = useValidateAsSetter(validate, values);
// now you can use validate with onChange events and keep the validation
// up to date.
const onChange = useSettersAsEventHandler(setValue, validateAll);
```
<a name="normalizeNestedObjects"></a>

## normalizeNestedObjects() ⇒ <code>NormalizerHandler</code>
Used to add nested object support to useFields or useForms. This
function supports nesting with brackets. E.g. referencing an
array value indexed at 0 `arrayName[0]`; referencing an object
value indexed at country `locations[country]`.

**Kind**: global function
**Returns**: <code>NormalizerHandler</code> - Returns a normalizer handler
**Example**
```js
// jsx
   <input name="users[0]" value="John">
   // field value
   {users: ["John"]}

   // jsx
   <input name="users[0][name]" value="John">
   // field value
   {users: [{
       name: "John"
   }]}

   // jsx
   <input name="user['string keys with spaces']" value="John">
   // field value
   {user: {"string keys with spaces": "John"}}
```
<a name="useNormalizers"></a>

## useNormalizers(normalizers) ⇒ <code>NormalizerHandler</code>
Creates a single normalizer function from the specified list of normalizers.
note: order matters when passing normalizers. This means that the results or value
of the first normalizer is passed to the next normalizer.

**Kind**: global function
**Returns**: <code>NormalizerHandler</code> - returns a normalizer handler

| Param | Type | Description |
| --- | --- | --- |
| normalizers | <code>Array.&lt;(NormalizerHandler\|UseNormalizersOption)&gt;</code> | if you pass a normalizer handler then it will apply to all fields. You can specify a specific list of fields by passing in |

**Example**
```js
useNormalizers(
   // apply to all fields
   normalizeNestedObjects(),
   {
     // apply to only fields ending in name (eg: firstName, lastName)
     name: /name$/i,
     normalizer: ({value}) => !value ? value : value.toUpperCase(),
   },
   {
     // apply to only the date field
     name: "date",
     normalizer: ({value}) => !value ? value : value.replace(/-/g, "/"),
   },
   {
     // apply to username or slug field
     name: ["username", "slug"],
     normalizer: ({value}) => !value ? value : value.toLowerCase(),
   }
)
```
<a name="useSettersAsRefEventHandler"></a>

## useSettersAsRefEventHandler(args) ⇒ <code>Ref</code>
A hook that adds support for uncontrolled inputs using
React refs. The React ref is used to synchronize the state of the input in the DOM
and the state of the form in the Virtual DOM.
This hook is generally only needed for larger forms or larger React Virtual DOM.

**Kind**: global function
**Returns**: <code>Ref</code> - returns a React ref function.

| Param | Type | Description |
| --- | --- | --- |
| args | <code>Array.&lt;eventLikeHandlers&gt;</code> \| <code>Array.&lt;UseEventHandlersWithRefProps&gt;</code> | a list of functions used to set a value or an object with `event`,  `handlers`, and `mountedValues` as properties. - `handlers`: a list of functinos used to set a value. - `event?`: the event to register this handler to. (defaults to `'change'`). - `mountedValues?`: used to set values on mount of the ref. |

**Example**
```js
import {useSettersAsRefEventHandler} from "react-uniformed";

// useSettersAsRefEventHandler defaults to an on change event
const changeRef = useSettersAsRefEventHandler(setValue);

// name attribute is still required as the changeRef calls setValue(name, value) on change
<input name="name" ref={changeRef} />
```
<a name="useSubmission"></a>

## useSubmission(param) ⇒ <code>Object</code>
Handles the form submission. Runs validation before calling the `onSubmit` function
if a validator was passed in.  If no validator was passed in, then the `onSubmit` function
will be invoked.  The validator function must set the state on disabled to true, if there
were errors. Disabled will prevent this hook from calling the `onSubmit` function.

Below is a flow diagram for this hook
```
               submit(Event)
                    |
  (no) - (validator is a function?) - (yes)
   |                                    |
 onSubmit(Event)                   validator()
                                        |
                      (no) - (disabled set to `false`?) - (yes)
                                                            |
                                                       onSubmit(Event)
```

**Kind**: global function
**Returns**: <code>Object</code> - returns a
handler for onSubmit events, a count of how many times submit was called, and the
state of the submission progress.
**See**: [useFunctionStats](#useFunctionStats)

| Param | Description |
| --- | --- |
| param | the props the pass in |
| param.validator | the specified validator. If your validation logic is async, then you should return a promise in your function otherwise this won't work as expected. |
| param.onSubmit | the specified onSubmit handler. If your onSubmit handler is async, then you should return a promise in your function otherwise this won't work as expected. |

**Example**
```js
// this example is if you are not using the useForm hook. Note: the useForm hook
  // handles all of this.

  const {values} = useFields();
  // bind a onSubmit handler with the current form values
  const onSubmit = useCallback(() => {
    console.log(values);
  }, [values]);
  // bind the validator with the values
  const validator = useCallback(() => {
    return {}; // this is saying there are no errors
  }, [values]);
  // create the submission handler
  const { isSubmitting, submit, submitCount } = useSubmission({
    onSubmit, validator
  });
```
<a name="useValidation"></a>

## useValidation(validator) ⇒
A hook for performing validation.

**Kind**: global function
**Returns**: returns an useValidation object

| Param | Description |
| --- | --- |
| validator | A validation map or a validation function. |

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
