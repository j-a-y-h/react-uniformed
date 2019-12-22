## Functions

<dl>
<dt><a href="#useConstraints">useConstraints(rules)</a> ⇒</dt>
<dd><p>A declarative way of validating inputs based upon HTML 5 constraints</p>
</dd>
<dt><a href="#useValidateAsSetter">useValidateAsSetter(validate, values)</a> ⇒</dt>
<dd><p>Creates a function that accepts a name and value as parameters.
When the returned function is invoked, it will call the specified
validate function with the specified values merged in with the name
and value passed to the invoked function.</p>
<dt><a href="#useInvokeCount">useInvokeCount(fnc)</a> ⇒ <code>Array.&lt;function(), number&gt;</code></dt>
<dd><p>Counts the number of times the specified function is invoked.</p>
</dd>
<dt><a href="#useInvoking">useInvoking(fnc)</a> ⇒ <code>Array.&lt;function(), boolean&gt;</code></dt>
<dd><p>Determines if the specified function is being called. This function
is only useful for async functions.</p>
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
<dt><a href="#useSubmission">useSubmission(param)</a> ⇒ <code>Object</code></dt>
<dd><p>Handles the form submission. Calls the specified validator and only
calls the onSubmit function if the validator returns error free.</p>
</dd>
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
<a name="useValidateAsSetter"></a>

## useValidateAsSetter(validate, values) ⇒
Creates a function that accepts a name and value as parameters.
When the returned function is invoked, it will call the specified
validate function with the specified values merged in with the name
and value passed to the invoked function.

**Kind**: global function
**Returns**: a function that can be invoked with a name and value.

| Param | Description |
| --- | --- |
| validate | a validation function that accepts an object of values |
| values | a values object |

**Example**
```js
// used with useForms
const {validate, values, setValue} = useForms(...);
const validateAll = useValidateAsSetter(validate, values);
// now you can use validate with onChange events and keep the validation
// up to date.
const onChange = useSettersAsEventHandler(setValue, validateAll);
```
<a name="useInvokeCount"></a>

## useInvokeCount(fnc) ⇒ <code>Array.&lt;function(), number&gt;</code>
Counts the number of times the specified function is invoked.

**Kind**: global function
**Returns**: <code>Array.&lt;function(), number&gt;</code> - an array where the first index is a function and
the second index is the number of times the function was called.

| Param | Description |
| --- | --- |
| fnc | the specified function |

<a name="useInvoking"></a>

## useInvoking(fnc) ⇒ <code>Array.&lt;function(), boolean&gt;</code>
Determines if the specified function is being called. This function
is only useful for async functions.

**Kind**: global function
**Returns**: <code>Array.&lt;function(), boolean&gt;</code> - an array where the first index is a function and
the second index is the state of the invocation for the function.

| Param | Description |
| --- | --- |
| fnc | the specified function |

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
<a name="useSubmission"></a>

## useSubmission(param) ⇒ <code>Object</code>
Handles the form submission. Calls the specified validator and only
calls the onSubmit function if the validator returns error free.

**Kind**: global function
**Returns**: <code>Object</code> - returns a
handler for onSubmit events, a count of how many times submit was called, and the
state of the submission progress.

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
