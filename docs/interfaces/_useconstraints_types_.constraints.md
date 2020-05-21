[react-uniformed](../README.md) › ["useConstraints/types"](../modules/_useconstraints_types_.md) › [Constraints](_useconstraints_types_.constraints.md)

# Interface: Constraints

## Hierarchy

* **Constraints**

## Index

### Properties

* [max](_useconstraints_types_.constraints.md#optional-readonly-max)
* [maxLength](_useconstraints_types_.constraints.md#optional-readonly-maxlength)
* [min](_useconstraints_types_.constraints.md#optional-readonly-min)
* [minLength](_useconstraints_types_.constraints.md#optional-readonly-minlength)
* [pattern](_useconstraints_types_.constraints.md#optional-readonly-pattern)
* [required](_useconstraints_types_.constraints.md#optional-readonly-required)
* [type](_useconstraints_types_.constraints.md#optional-readonly-type)

## Properties

### `Optional` `Readonly` max

• **max**? : *number | string | [number | string, string]*

A max boundary used for type numbers

___

### `Optional` `Readonly` maxLength

• **maxLength**? : *number | [number, string]*

A maxLength used for non number values

___

### `Optional` `Readonly` min

• **min**? : *number | string | [number | string, string]*

A min boundary used for type numbers

___

### `Optional` `Readonly` minLength

• **minLength**? : *number | [number, string]*

A minLength used for non number values

___

### `Optional` `Readonly` pattern

• **pattern**? : *RegExp | [RegExp, string]*

A RegExp pattern used for validation

___

### `Optional` `Readonly` required

• **required**? : *boolean | string | [boolean, string]*

Determines if the field is required

**`defaultvalue`** false

___

### `Optional` `Readonly` type

• **type**? : *[supportedTypes](../modules/_useconstraints_types_.md#supportedtypes) | [string, string]*

The type of input.
currently supported values are **text**, **email**, **url**.
email and url types are validated using the appropriate regex

**`defaultvalue`** text
