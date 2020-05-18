[react-uniformed](../README.md) › ["useForm"](_useform_.md)

# Module: "useForm"

## Index

### Interfaces

* [UseFormsHook](../interfaces/_useform_.useformshook.md)

### Functions

* [useForm](_useform_.md#useform)

## Functions

###  useForm

▸ **useForm**(`__namedParameters`: object): *[UseFormsHook](../interfaces/_useform_.useformshook.md)*

A hook that allows you to declaratively manage a form.<br>

See [useTouch](_usetouch_.md#usetouch)<br/>
See [useFields](_usefields_.md#usefields)<br/>
See [useValidation](_usevalidation_.md#usevalidation)<br/>
See [useSubmission](_usesubmission_.md#usesubmission)<br/>
See [useConstraints](_useconstraints_.md#useconstraints) <br/>
See [useValidateAsSetter](_usehandlers_.md#usevalidateassetter)<br/>
See [useSettersAsEventHandler](_usehandlers_.md#usesettersaseventhandler)<br/>
See [useSettersAsRefEventHandler](_usesettersasrefeventhandler_.md#usesettersasrefeventhandler)

**`example`** <caption>Basic example</caption>
```javascript
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

**`example`** <caption>Using `validate` in change events</caption>
```javascript
const { submit, setValue, validate, values } = useForm({
  onSubmit: data => alert(JSON.stringify(data))
});
// Warning: validating all inputs on change could lead to performance issues,
// especially if you have a big form or complex validation logic.
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

**`example`** <caption>Setting feedback on submit, see [useSubmission](_usesubmission_.md#usesubmission)</caption>

**`example`** <caption>Validation errors from the server, see [useSubmission](_usesubmission_.md#usesubmission)</caption>

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Description |
------ | ------ | ------ |
`constraints` | Values‹[Validator](../interfaces/_usevalidation_.validator.md) &#124; Constraints› &#124; [SyncedConstraint](../interfaces/_useconstraints_.syncedconstraint.md) | Passed directly to [useConstraints](_useconstraints_.md#useconstraints). Note that you can only use one validator at a time. For instance, if you pass in a value to `validators`, then the `constraints` prop will be ignored in favor of `validators`. |
`initialValues` | undefined &#124; object | passed as the first argument to [useFields](_usefields_.md#usefields). |
`normalizer` | undefined &#124; [NormalizerHandler](../interfaces/_usefields_.normalizerhandler.md) | passed as the second argument to [useFields](_usefields_.md#usefields). See [useNormalizers](_usenormalizers_.md#usenormalizers) for more details. |
`onSubmit` | [SubmissionHandler](../interfaces/_usesubmission_.submissionhandler.md) | passed directly to [useSubmission](_usesubmission_.md#usesubmission). |
`validators` | Values‹[Validator](../interfaces/_usevalidation_.validator.md)› &#124; [SingleValidator](../interfaces/_usevalidation_.singlevalidator.md)‹undefined &#124; null &#124; string &#124; number &#124; false &#124; true &#124; any[] &#124; object› | passed directly to [useValidation](_usevalidation_.md#usevalidation). |

**Returns:** *[UseFormsHook](../interfaces/_useform_.useformshook.md)*

the APIs used to manage the state of a function.