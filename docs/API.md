## Functions

<dl>
<dt><a href="#useConstraints">useConstraints(rules)</a> ⇒</dt>
<dd><p>A declarative way of validating inputs based upon HTML 5 constraints</p>
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
   <input name="user[0]" value="John">
   // field value
   {user: ["John"]}

   // jsx
   <input name="user[0][name]" value="John">
   // field value
   {user: [{
       name: "John"
   }]}

   <input name="user['string keys with spaces']"
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
   normalizeNestedObjects,
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
