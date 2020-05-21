[react-uniformed](../README.md) › ["useConstraints/types"](_useconstraints_types_.md)

# Module: "useConstraints/types"

## Index

### Interfaces

* [Constraints](../interfaces/_useconstraints_types_.constraints.md)
* [SyncedConstraint](../interfaces/_useconstraints_types_.syncedconstraint.md)

### Type aliases

* [ConstraintValidators](_useconstraints_types_.md#constraintvalidators)
* [RequiredConstraint](_useconstraints_types_.md#requiredconstraint)
* [constraintValues](_useconstraints_types_.md#constraintvalues)
* [supportedConstraints](_useconstraints_types_.md#supportedconstraints)
* [supportedTypes](_useconstraints_types_.md#supportedtypes)

### Variables

* [supportedProperties](_useconstraints_types_.md#const-supportedproperties)
* [supportedTypesSet](_useconstraints_types_.md#const-supportedtypesset)

### Object literals

* [defaultMessage](_useconstraints_types_.md#const-defaultmessage)

## Type aliases

###  ConstraintValidators

Ƭ **ConstraintValidators**: *Values‹[Constraints](../interfaces/_useconstraints_types_.constraints.md) | [Validator](../interfaces/_usevalidation_.validator.md)›*

___

###  RequiredConstraint

Ƭ **RequiredConstraint**: *object*

#### Type declaration:

___

###  constraintValues

Ƭ **constraintValues**: *boolean | number | RegExp | string | Date*

___

###  supportedConstraints

Ƭ **supportedConstraints**: *keyof Constraints*

___

###  supportedTypes

Ƭ **supportedTypes**: *"email" | "text" | "url" | "number" | "date"*

## Variables

### `Const` supportedProperties

• **supportedProperties**: *[supportedConstraints](_useconstraints_types_.md#supportedconstraints)[]* = [
  'required',
  'type',
  'pattern',
  'maxLength',
  'minLength',
  'max',
  'min',
]

___

### `Const` supportedTypesSet

• **supportedTypesSet**: *Set‹"number" | "email" | "text" | "url" | "date"›* = new Set<supportedTypes>(['text', 'email', 'url', 'number', 'date'])

## Object literals

### `Const` defaultMessage

### ▪ **defaultMessage**: *object*

###  max

• **max**: *string* = "The value is too large."

###  maxLength

• **maxLength**: *string* = "The number of characters is too long."

###  min

• **min**: *string* = "The value is too small."

###  minLength

• **minLength**: *string* = "The number of characters is too short."

###  pattern

• **pattern**: *string* = "The value must match the pattern."

###  required

• **required**: *string* = "There must be a value (if set)."

###  type

• **type**: *string* = "The value must match the type."
