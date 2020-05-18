[react-uniformed](../README.md) › ["useForm"](../modules/_useform_.md) › [UseFormsHook](_useform_.useformshook.md)

# Interface: UseFormsHook

## Hierarchy

* **UseFormsHook**

## Index

### Properties

* [errors](_useform_.useformshook.md#readonly-errors)
* [hasErrors](_useform_.useformshook.md#readonly-haserrors)
* [isDirty](_useform_.useformshook.md#readonly-isdirty)
* [isSubmitting](_useform_.useformshook.md#readonly-issubmitting)
* [reset](_useform_.useformshook.md#readonly-reset)
* [setError](_useform_.useformshook.md#readonly-seterror)
* [setTouch](_useform_.useformshook.md#readonly-settouch)
* [setValue](_useform_.useformshook.md#readonly-setvalue)
* [submit](_useform_.useformshook.md#readonly-submit)
* [submitCount](_useform_.useformshook.md#readonly-submitcount)
* [submitFeedback](_useform_.useformshook.md#readonly-submitfeedback)
* [touchField](_useform_.useformshook.md#readonly-touchfield)
* [touches](_useform_.useformshook.md#readonly-touches)
* [validate](_useform_.useformshook.md#readonly-validate)
* [validateByName](_useform_.useformshook.md#readonly-validatebyname)
* [values](_useform_.useformshook.md#readonly-values)

## Properties

### `Readonly` errors

• **errors**: *[Errors](../modules/_useerrors_.md#errors) | PartialValues‹[Errors](../modules/_useerrors_.md#errors), [validErrorValues](../modules/_useerrors_.md#validerrorvalues)›*

___

### `Readonly` hasErrors

• **hasErrors**: *boolean*

___

### `Readonly` isDirty

• **isDirty**: *boolean*

___

### `Readonly` isSubmitting

• **isSubmitting**: *boolean*

___

### `Readonly` reset

• **reset**: *function*

#### Type declaration:

▸ (`event?`: SyntheticEvent): *void*

**Parameters:**

Name | Type |
------ | ------ |
`event?` | SyntheticEvent |

___

### `Readonly` setError

• **setError**: *[ErrorHandler](_useerrors_.errorhandler.md)*

___

### `Readonly` setTouch

• **setTouch**: *[TouchHandler](_usetouch_.touchhandler.md)*

___

### `Readonly` setValue

• **setValue**: *SetValueCallback‹[FieldValue](../modules/_usefields_.md#fieldvalue)›*

___

### `Readonly` submit

• **submit**: *[SubmitHandler](_usesubmission_.submithandler.md)*

___

### `Readonly` submitCount

• **submitCount**: *number*

___

### `Readonly` submitFeedback

• **submitFeedback**: *[SubmitFeedback](../modules/_usesubmission_.md#submitfeedback)*

___

### `Readonly` touchField

• **touchField**: *[TouchFieldHandler](_usetouch_.touchfieldhandler.md)*

___

### `Readonly` touches

• **touches**: *[Touches](../modules/_usetouch_.md#touches)*

___

### `Readonly` validate

• **validate**: *[ValidateAllHandler](_usevalidation_.validateallhandler.md)‹[FieldValue](../modules/_usefields_.md#fieldvalue)›*

___

### `Readonly` validateByName

• **validateByName**: *[ValidateHandler](_usevalidation_.validatehandler.md)‹[FieldValue](../modules/_usefields_.md#fieldvalue)›*

___

### `Readonly` values

• **values**: *[Fields](../modules/_usefields_.md#fields)*
