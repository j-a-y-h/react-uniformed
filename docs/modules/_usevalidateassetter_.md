[react-uniformed](../README.md) › ["useValidateAsSetter"](_usevalidateassetter_.md)

# Module: "useValidateAsSetter"

## Index

### Functions

* [useValidateAsSetter](_usevalidateassetter_.md#usevalidateassetter)

## Functions

###  useValidateAsSetter

▸ **useValidateAsSetter**(`validate`: [ValidateAllHandler](../interfaces/_usevalidation_.validateallhandler.md)‹[FieldValue](_usefields_.md#fieldvalue)›, `values`: [Fields](_usefields_.md#fields)): *[eventLikeHandlers](_usehandlers_.md#eventlikehandlers)*

Creates a function that accepts a name and value as parameters.
When the returned function is invoked, it will call the specified
validate function with the specified values merged in with the name
and value passed to the invoked function.

The main purpose of this hook is to use validate with `useSettersAsEventHandler` without
validation being one update behind.

**`example`** 
```javascript
// used with useForms
const {validate, values, setValue} = useForms(...);
const validateAll = useValidateAsSetter(validate, values);
// now you can use validate with onChange events and keep the validation
// in sync.
const onChange = useSettersAsEventHandler(setValue, validateAll);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`validate` | [ValidateAllHandler](../interfaces/_usevalidation_.validateallhandler.md)‹[FieldValue](_usefields_.md#fieldvalue)› | a validation function that accepts an object of values. |
`values` | [Fields](_usefields_.md#fields) | a values object. |

**Returns:** *[eventLikeHandlers](_usehandlers_.md#eventlikehandlers)*

a function that can be invoked with a name and value.<br>
See [useSettersAsEventHandler](_usesettersaseventhandler_.md#usesettersaseventhandler)<br>
See [useSettersAsRefEventHandler](_usesettersasrefeventhandler_.md#usesettersasrefeventhandler)
