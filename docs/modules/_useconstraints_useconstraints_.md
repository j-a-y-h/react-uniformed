[react-uniformed](../README.md) › ["useConstraints"](_useconstraints_useconstraints_.md)

# Module: "useConstraints"

## Index

### Functions

* [useConstraints](_useconstraints_useconstraints_.md#useconstraints)

## Functions

###  useConstraints

▸ **useConstraints**<**T**>(`rules`: T): *ConstantValues‹T, [Validator](../interfaces/_usevalidation_.validator.md)›*

A declarative way of validating inputs based upon HTML 5 constraints.

**`example`** <caption>Basic</caption>
```javascript
 const validator = useConstraints({
     firstName: { required: true, minLength: 5, maxLength: 6 },
     lastName: { required: true, maxLength: 100 },
     age: { type: "number", min: 18, max: 99 },
     location: { required: true, pattern: /(europe|africa)/},
     email: { required: true, type: "email" },
     website: { required: true, type: "url" }
 });
 // note that empty string means the value is valid.
 validator.firstName("Johny") === "";
```

**`example`** <caption>Displaying custom messages on error.</caption>
```javascript
 const validator = useConstraints({
     // use min, max on date type
     startDate: { type: "date", min: Date.now() },
     // custom message
     name: {
         required: "name is required",
         maxLength: [55, "name must be under 55 characters"]
     },
 })
```

**`example`** <caption>Usage with [useForm](_useform_.md#useform)</caption>
```javascript
 useForm({
   constraints: {
     location: { required: true, pattern: /(europe|africa)/},
     email: { required: true, type: "email" },
   },
 })
```

**Type parameters:**

▪ **T**: *[ConstraintValidators](_useconstraints_types_.md#constraintvalidators)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`rules` | T | an object map that consist of [Constraints](../interfaces/_useconstraints_types_.constraints.md) or [Validator](../interfaces/_usevalidation_.validator.md) as values. |

**Returns:** *ConstantValues‹T, [Validator](../interfaces/_usevalidation_.validator.md)›*

maps the rules to an object map where the value is a function. Each function
accepts only one argument that is the value to validate when invoked.

▸ **useConstraints**(`syncedConstraint`: [SyncedConstraint](../interfaces/_useconstraints_types_.syncedconstraint.md)): *[SingleValidator](../interfaces/_usevalidation_.singlevalidator.md)‹[FieldValue](_usefields_.md#fieldvalue)›*

A declarative way of creating validation logic that is dependent on other values.

**`example`** <caption>Binding constraints to values.</caption>
```javascript
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

**`example`** <caption>Usage with [useForm](_useform_.md#useform)</caption>

```javascript
 useForm({
   constraints(values) {
     startDate: { type: "date", min: Date.now() },
     // ensure that the end date is always greater than the start date
     endDate: {
         type: "date",
         min: [values.startDate, "end date must be greater than start date"]
     },
   }
 });
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`syncedConstraint` | [SyncedConstraint](../interfaces/_useconstraints_types_.syncedconstraint.md) | A validator function that accepts a value map as the only argument. The return value of the specified function must be of type [ConstraintValidators](_useconstraints_types_.md#constraintvalidators). |

**Returns:** *[SingleValidator](../interfaces/_usevalidation_.singlevalidator.md)‹[FieldValue](_usefields_.md#fieldvalue)›*

A validation function similar to the `validate` function from [useValidation](_usevalidation_.md#usevalidation).

▸ **useConstraints**<**T**>(`rules`: [SyncedConstraint](../interfaces/_useconstraints_types_.syncedconstraint.md) | T): *ConstantValues‹T, [Validator](../interfaces/_usevalidation_.validator.md)› | [SingleValidator](../interfaces/_usevalidation_.singlevalidator.md)‹[FieldValue](_usefields_.md#fieldvalue)›*

A declarative way of validating inputs based upon HTML 5 constraints.

**Type parameters:**

▪ **T**: *[ConstraintValidators](_useconstraints_types_.md#constraintvalidators)*

**Parameters:**

Name | Type |
------ | ------ |
`rules` | [SyncedConstraint](../interfaces/_useconstraints_types_.syncedconstraint.md) &#124; T |

**Returns:** *ConstantValues‹T, [Validator](../interfaces/_usevalidation_.validator.md)› | [SingleValidator](../interfaces/_usevalidation_.singlevalidator.md)‹[FieldValue](_usefields_.md#fieldvalue)›*

If you are using this outside of [useForm](_useform_.md#useform),
then it is recommended that you use this with [useValidation](_usevalidation_.md#usevalidation).
