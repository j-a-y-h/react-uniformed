[react-uniformed](../README.md) › ["useHandlers"](_usehandlers_.md)

# Module: "useHandlers"

## Index

### Type aliases

* [eventLikeHandlers](_usehandlers_.md#eventlikehandlers)
* [reactOrNativeEvent](_usehandlers_.md#reactornativeevent)

### Functions

* [useHandlers](_usehandlers_.md#usehandlers)
* [useSettersAsEventHandler](_usehandlers_.md#usesettersaseventhandler)
* [useValidateAsSetter](_usehandlers_.md#usevalidateassetter)

## Type aliases

###  eventLikeHandlers

Ƭ **eventLikeHandlers**: *Handler‹string | EventTarget | null, keyValueEvent‹string›, void›*

___

###  reactOrNativeEvent

Ƭ **reactOrNativeEvent**: *SyntheticEvent | Event*

## Functions

###  useHandlers

▸ **useHandlers**<**T**, **K**>(...`handlers`: Handler‹T, K, void›[]): *Handler‹T, K, void›*

Consolidates the specified list of functions into one function. This is useful
for calling a list of functions with similar parameters. A great use case is creating
a reset form function from a list of reset functions (see example below). In fact, the
`reset` function from [useForm](_useform_.md#useform) is created using this function.

**`example`** 
```javascript
// create a reset form function by merging reset functions from other form hooks.
const reset = useHandlers(resetValues, resetErrors, resetTouches);
```

**Type parameters:**

▪ **T**

▪ **K**: *T[]*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...handlers` | Handler‹T, K, void›[] | the list of specified functions |

**Returns:** *Handler‹T, K, void›*

A single function.  When this function is invoked, it will call each specified
function in the order it was passed to this hook with the same arguments from the invocation.

___

###  useSettersAsEventHandler

▸ **useSettersAsEventHandler**(...`handlers`: [eventLikeHandlers](_usehandlers_.md#eventlikehandlers)[]): *ReactOrNativeEventListener*

Converts a list of setters to a single event handler.  Setters are functions
that takes a specified name as the first parameter and a specified value as
the second param. Note that this hook is built on top of [useHandlers](_usehandlers_.md#usehandlers).

**`example`** <caption>Create an onChange event handler</caption>
```javascript
// set values and touches on change
const handleChange = useSettersAsEventHandler(setValue, touchField);

// set values and touches on change as well as validate
const handleChange = useSettersAsEventHandler(setValue, touchField, validateByName);

<input
  name="username"
  value={values.username}
  onChange={handleChange}
/>
```

**`example`** <caption>Creating an onBlur event handler</caption>
```javascript
// set values and touches on change
const handleChange = useSettersAsEventHandler(setValue, touchField);

// validation may be expensive so validate on blur.
const handleBlur = useSettersAsEventHandler(validateByName);

<input
  name="username"
  value={values.username}
  onChange={handleChange}
  onBlur={handleBlur}
/>
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...handlers` | [eventLikeHandlers](_usehandlers_.md#eventlikehandlers)[] | A list of setters that will be used in an event handler |

**Returns:** *ReactOrNativeEventListener*

An event handler that can be used in events like onChange or onBlur.  In order
for this hook to call each setter with a name and value param, the inputs that this
is used on must have a name attribute that maps to the specified.

___

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
See [useSettersAsEventHandler](_usehandlers_.md#usesettersaseventhandler)<br>
See [useSettersAsRefEventHandler](_usesettersasrefeventhandler_.md#usesettersasrefeventhandler)
