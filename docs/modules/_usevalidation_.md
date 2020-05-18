[react-uniformed](../README.md) › ["useValidation"](_usevalidation_.md)

# Module: "useValidation"

## Index

### Interfaces

* [SingleValidator](../interfaces/_usevalidation_.singlevalidator.md)
* [ValidateAllHandler](../interfaces/_usevalidation_.validateallhandler.md)
* [ValidateHandler](../interfaces/_usevalidation_.validatehandler.md)
* [Validator](../interfaces/_usevalidation_.validator.md)

### Type aliases

* [Validators](_usevalidation_.md#validators)

### Functions

* [useValidation](_usevalidation_.md#usevalidation)
* [validateValidators](_usevalidation_.md#validatevalidators)

## Type aliases

###  Validators

Ƭ **Validators**: *Values‹[Validator](../interfaces/_usevalidation_.validator.md)›*

## Functions

###  useValidation

▸ **useValidation**(`validator`: [SingleValidator](../interfaces/_usevalidation_.singlevalidator.md)‹[FieldValue](_usefields_.md#fieldvalue)›): *UseValidatorHook‹[FieldValue](_usefields_.md#fieldvalue)›*

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
`validator` | [SingleValidator](../interfaces/_usevalidation_.singlevalidator.md)‹[FieldValue](_usefields_.md#fieldvalue)› | A validation map or a validation function. |

**Returns:** *UseValidatorHook‹[FieldValue](_usefields_.md#fieldvalue)›*

returns an {@link UseValidatorHook} or {@link UseValidatorHookPartial} object.

▸ **useValidation**<**T**>(`validator`: T): *UseValidatorHookPartial‹[FieldValue](_usefields_.md#fieldvalue), T›*

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

▪ **T**: *[Validators](_usevalidation_.md#validators)*

**Parameters:**

Name | Type |
------ | ------ |
`validator` | T |

**Returns:** *UseValidatorHookPartial‹[FieldValue](_usefields_.md#fieldvalue), T›*

returns an {@link UseValidatorHook} or {@link UseValidatorHookPartial} object.

▸ **useValidation**<**T**>(`validator`: T | [SingleValidator](../interfaces/_usevalidation_.singlevalidator.md)‹[FieldValue](_usefields_.md#fieldvalue)›): *UseValidatorHookPartial‹[FieldValue](_usefields_.md#fieldvalue), T› | UseValidatorHook‹[FieldValue](_usefields_.md#fieldvalue)›*

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

▪ **T**: *[Validators](_usevalidation_.md#validators)*

**Parameters:**

Name | Type |
------ | ------ |
`validator` | T &#124; [SingleValidator](../interfaces/_usevalidation_.singlevalidator.md)‹[FieldValue](_usefields_.md#fieldvalue)› |

**Returns:** *UseValidatorHookPartial‹[FieldValue](_usefields_.md#fieldvalue), T› | UseValidatorHook‹[FieldValue](_usefields_.md#fieldvalue)›*

returns an {@link UseValidatorHook} or {@link UseValidatorHookPartial} object.

___

###  validateValidators

▸ **validateValidators**(`names`: string[], `validators`: [Validators](_usevalidation_.md#validators), `values`: [Fields](_usefields_.md#fields)): *Promise‹[Errors](_useerrors_.md#errors)›*

**Parameters:**

Name | Type |
------ | ------ |
`names` | string[] |
`validators` | [Validators](_usevalidation_.md#validators) |
`values` | [Fields](_usefields_.md#fields) |

**Returns:** *Promise‹[Errors](_useerrors_.md#errors)›*
