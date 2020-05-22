[react-uniformed](../README.md) › ["useSubmission/types"](../modules/_usesubmission_types_.md) › [UseSubmissionProps](_usesubmission_types_.usesubmissionprops.md)

# Interface: UseSubmissionProps

## Hierarchy

* **UseSubmissionProps**

## Index

### Properties

* [disabled](_usesubmission_types_.usesubmissionprops.md#optional-readonly-disabled)
* [onSubmit](_usesubmission_types_.usesubmissionprops.md#readonly-onsubmit)
* [values](_usesubmission_types_.usesubmissionprops.md#optional-readonly-values)

### Methods

* [reset](_usesubmission_types_.usesubmissionprops.md#optional-reset)
* [setError](_usesubmission_types_.usesubmissionprops.md#optional-seterror)
* [validator](_usesubmission_types_.usesubmissionprops.md#optional-validator)

## Properties

### `Optional` `Readonly` disabled

• **disabled**? : *undefined | false | true*

Determines if submission should be disabled. Generally,
you want to disable if there are errors.

___

### `Readonly` onSubmit

• **onSubmit**: *[SubmissionHandler](_usesubmission_types_.submissionhandler.md)*

___

### `Optional` `Readonly` values

• **values**? : *[Fields](../modules/_usefields_.md#fields)*

## Methods

### `Optional` reset

▸ **reset**(`event?`: SyntheticEvent): *void*

**Parameters:**

Name | Type |
------ | ------ |
`event?` | SyntheticEvent |

**Returns:** *void*

___

### `Optional` setError

▸ **setError**(`name`: string, `error`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`error` | string |

**Returns:** *void*

___

### `Optional` validator

▸ **validator**(): *Promise‹void› | void*

**Returns:** *Promise‹void› | void*
