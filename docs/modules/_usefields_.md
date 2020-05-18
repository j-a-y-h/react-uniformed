[react-uniformed](../README.md) › ["useFields"](_usefields_.md)

# Module: "useFields"

## Index

### Interfaces

* [NormalizeSetValue](../interfaces/_usefields_.normalizesetvalue.md)
* [NormalizerHandler](../interfaces/_usefields_.normalizerhandler.md)
* [UseFieldsHook](../interfaces/_usefields_.usefieldshook.md)

### Type aliases

* [FieldValue](_usefields_.md#fieldvalue)
* [Fields](_usefields_.md#fields)
* [MutableFields](_usefields_.md#mutablefields)

### Functions

* [useFields](_usefields_.md#usefields)

## Type aliases

###  FieldValue

Ƭ **FieldValue**: *string | number | boolean | undefined | null | [MutableFields](_usefields_.md#mutablefields) | any[]*

___

###  Fields

Ƭ **Fields**: *Readonly‹[MutableFields](_usefields_.md#mutablefields)›*

___

###  MutableFields

Ƭ **MutableFields**: *Partial‹object›*

## Functions

###  useFields

▸ **useFields**(`initialValues?`: [Fields](_usefields_.md#fields), `normalizer?`: [NormalizerHandler](../interfaces/_usefields_.normalizerhandler.md)): *[UseFieldsHook](../interfaces/_usefields_.usefieldshook.md)*

A hook for managing form values.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`initialValues?` | [Fields](_usefields_.md#fields) | The initial values for the form |
`normalizer?` | [NormalizerHandler](../interfaces/_usefields_.normalizerhandler.md) | A normalizer handler that transforms the field values. See [useNormalizers](_usenormalizers_.md#usenormalizers). |

**Returns:** *[UseFieldsHook](../interfaces/_usefields_.usefieldshook.md)*

An api for setting, reading, resetting form values.
