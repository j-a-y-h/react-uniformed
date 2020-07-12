[react-uniformed](../README.md) › ["useConstraints/types"](_useconstraints_types_.md)

# Module: "useConstraints/types"

## Index

### Interfaces

- [Constraints](../interfaces/_useconstraints_types_.constraints.md)
- [SyncedConstraint](../interfaces/_useconstraints_types_.syncedconstraint.md)

### Type aliases

- [ConstraintValidators](_useconstraints_types_.md#constraintvalidators)
- [RequiredConstraint](_useconstraints_types_.md#requiredconstraint)
- [constraintValues](_useconstraints_types_.md#constraintvalues)
- [supportedConstraints](_useconstraints_types_.md#supportedconstraints)
- [supportedTypes](_useconstraints_types_.md#supportedtypes)

### Variables

- [supportedProperties](_useconstraints_types_.md#const-supportedproperties)
- [supportedTypesSet](_useconstraints_types_.md#const-supportedtypesset)

### Object literals

- [defaultMessage](_useconstraints_types_.md#const-defaultmessage)

## Type aliases

### ConstraintValidators

Ƭ **ConstraintValidators**: _Values‹[Constraints](../interfaces/_useconstraints_types_.constraints.md) | [Validator](../interfaces/_usevalidation_types_.validator.md)›_

---

### RequiredConstraint

Ƭ **RequiredConstraint**: _object_

#### Type declaration:

---

### constraintValues

Ƭ **constraintValues**: _boolean | number | RegExp | string | Date_

---

### supportedConstraints

Ƭ **supportedConstraints**: _keyof Constraints_

---

### supportedTypes

Ƭ **supportedTypes**: _"email" | "text" | "url" | "number" | "date"_

## Variables

### `Const` supportedProperties

• **supportedProperties**: _[supportedConstraints](_useconstraints_types_.md#supportedconstraints)[]_ = [
'required',
'type',
'pattern',
'maxLength',
'minLength',
'max',
'min',
]

---

### `Const` supportedTypesSet

• **supportedTypesSet**: _Set‹"number" | "email" | "text" | "url" | "date"›_ = new Set<supportedTypes>([
'text',
'email',
'url',
'number',
'date',
])

## Object literals

### `Const` defaultMessage

### ▪ **defaultMessage**: _object_

### max

• **max**: _string_ = "The value is too large."

### maxLength

• **maxLength**: _string_ = "The number of characters is too long."

### min

• **min**: _string_ = "The value is too small."

### minLength

• **minLength**: _string_ = "The number of characters is too short."

### pattern

• **pattern**: _string_ = "The value must match the pattern."

### required

• **required**: _string_ = "There must be a value (if set)."

### type

• **type**: _string_ = "The value must match the type."
