[react-uniformed](../README.md) › ["useValidation/types"](../modules/_usevalidation_types_.md) › [UseValidatorHookPartial](_usevalidation_types_.usevalidatorhookpartial.md)

# Interface: UseValidatorHookPartial <**T, K**>

## Type parameters

▪ **T**

▪ **K**

## Hierarchy

* **UseValidatorHookPartial**

## Index

### Properties

* [errors](_usevalidation_types_.usevalidatorhookpartial.md#readonly-errors)
* [hasErrors](_usevalidation_types_.usevalidatorhookpartial.md#readonly-haserrors)
* [resetErrors](_usevalidation_types_.usevalidatorhookpartial.md#readonly-reseterrors)
* [setError](_usevalidation_types_.usevalidatorhookpartial.md#readonly-seterror)
* [validate](_usevalidation_types_.usevalidatorhookpartial.md#readonly-validate)
* [validateByName](_usevalidation_types_.usevalidatorhookpartial.md#readonly-validatebyname)

## Properties

### `Readonly` errors

• **errors**: *PartialValues‹K, [validErrorValues](../modules/_useerrors_.md#validerrorvalues)›*

___

### `Readonly` hasErrors

• **hasErrors**: *boolean*

___

### `Readonly` resetErrors

• **resetErrors**: *function*

#### Type declaration:

▸ (): *void*

___

### `Readonly` setError

• **setError**: *[ErrorHandler](_useerrors_.errorhandler.md)‹keyof K›*

___

### `Readonly` validate

• **validate**: *[ValidateAllHandler](_usevalidation_types_.validateallhandler.md)‹T, PartialValues‹K, T››*

___

### `Readonly` validateByName

• **validateByName**: *[ValidateHandler](_usevalidation_types_.validatehandler.md)‹T, keyof K›*
