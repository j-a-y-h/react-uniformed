[react-uniformed](../README.md) › ["useFields"](_usefields_.md)

# Module: "useFields"

## Index

### Interfaces

- [NormalizeSetValue](../interfaces/_usefields_.normalizesetvalue.md)
- [NormalizerHandler](../interfaces/_usefields_.normalizerhandler.md)
- [UseFieldsHook](../interfaces/_usefields_.usefieldshook.md)

### Type aliases

- [FieldValue](_usefields_.md#fieldvalue)
- [Fields](_usefields_.md#fields)
- [MutableFields](_usefields_.md#mutablefields)

### Functions

- [useFields](_usefields_.md#usefields)

## Type aliases

### FieldValue

Ƭ **FieldValue**: _any_

---

### Fields

Ƭ **Fields**: _Readonly‹[MutableFields](_usefields_.md#mutablefields)›_

---

### MutableFields

Ƭ **MutableFields**: _Partial‹object›_

## Functions

### useFields

▸ **useFields**(`initialValues?`: [Fields](_usefields_.md#fields), `normalizer?`: [NormalizerHandler](../interfaces/_usefields_.normalizerhandler.md)): _[UseFieldsHook](../interfaces/_usefields_.usefieldshook.md)_

A hook for managing form values.

**Parameters:**

| Name             | Type                                                                | Description                                                                                                      |
| ---------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `initialValues?` | [Fields](_usefields_.md#fields)                                     | The initial values for the form                                                                                  |
| `normalizer?`    | [NormalizerHandler](../interfaces/_usefields_.normalizerhandler.md) | A normalizer handler that transforms the field values. See [useNormalizers](_usenormalizers_.md#usenormalizers). |

**Returns:** _[UseFieldsHook](../interfaces/_usefields_.usefieldshook.md)_

An api for setting, reading, resetting form values.
