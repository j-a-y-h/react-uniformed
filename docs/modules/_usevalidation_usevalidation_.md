[react-uniformed](../README.md) › ["useValidation"](_usevalidation_usevalidation_.md)

# Module: "useValidation"

## Index

### Functions

* [useValidation](_usevalidation_usevalidation_.md#usevalidation)

## Functions

###  useValidation

▸ **useValidation**(`validator`: [SingleValidator](../interfaces/_usevalidation_types_.singlevalidator.md)‹[FieldValue](_usefields_.md#fieldvalue)›): *[UseValidatorHook](../interfaces/_usevalidation_types_.usevalidatorhook.md)‹[FieldValue](_usefields_.md#fieldvalue)›*

A hook for performing validation.

See [useErrors](_useerrors_.md#useerrors).

**`example`**

```javascript
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

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`validator` | [SingleValidator](../interfaces/_usevalidation_types_.singlevalidator.md)‹[FieldValue](_usefields_.md#fieldvalue)› | A validation map or a validation function. |

**Returns:** *[UseValidatorHook](../interfaces/_usevalidation_types_.usevalidatorhook.md)‹[FieldValue](_usefields_.md#fieldvalue)›*

returns an [UseValidatorHook](../interfaces/_usevalidation_types_.usevalidatorhook.md) or [UseValidatorHookPartial](../interfaces/_usevalidation_types_.usevalidatorhookpartial.md) object.

▸ **useValidation**<**T**>(`validator`: T): *[UseValidatorHookPartial](../interfaces/_usevalidation_types_.usevalidatorhookpartial.md)‹[FieldValue](_usefields_.md#fieldvalue), T›*

A hook for performing validation.

See [useErrors](_useerrors_.md#useerrors).

**`example`**

```javascript
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

**Type parameters:**

▪ **T**: *[Validators](_usevalidation_types_.md#validators)*

**Parameters:**

Name | Type |
------ | ------ |
`validator` | T |

**Returns:** *[UseValidatorHookPartial](../interfaces/_usevalidation_types_.usevalidatorhookpartial.md)‹[FieldValue](_usefields_.md#fieldvalue), T›*

returns an [UseValidatorHook](../interfaces/_usevalidation_types_.usevalidatorhook.md) or [UseValidatorHookPartial](../interfaces/_usevalidation_types_.usevalidatorhookpartial.md) object.

▸ **useValidation**<**T**>(`validator`: T | [SingleValidator](../interfaces/_usevalidation_types_.singlevalidator.md)‹[FieldValue](_usefields_.md#fieldvalue)›): *[UseValidatorHookPartial](../interfaces/_usevalidation_types_.usevalidatorhookpartial.md)‹[FieldValue](_usefields_.md#fieldvalue), T› | [UseValidatorHook](../interfaces/_usevalidation_types_.usevalidatorhook.md)‹[FieldValue](_usefields_.md#fieldvalue)›*

A hook for performing validation.

See [useErrors](_useerrors_.md#useerrors).

**`example`**

```javascript
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

**Type parameters:**

▪ **T**: *[Validators](_usevalidation_types_.md#validators)*

**Parameters:**

Name | Type |
------ | ------ |
`validator` | T &#124; [SingleValidator](../interfaces/_usevalidation_types_.singlevalidator.md)‹[FieldValue](_usefields_.md#fieldvalue)› |

**Returns:** *[UseValidatorHookPartial](../interfaces/_usevalidation_types_.usevalidatorhookpartial.md)‹[FieldValue](_usefields_.md#fieldvalue), T› | [UseValidatorHook](../interfaces/_usevalidation_types_.usevalidatorhook.md)‹[FieldValue](_usefields_.md#fieldvalue)›*

returns an [UseValidatorHook](../interfaces/_usevalidation_types_.usevalidatorhook.md) or [UseValidatorHookPartial](../interfaces/_usevalidation_types_.usevalidatorhookpartial.md) object.
