[react-uniformed](../README.md) › ["useHandlers"](_usehandlers_.md)

# Module: "useHandlers"

## Index

### Type aliases

* [eventLikeHandlers](_usehandlers_.md#eventlikehandlers)
* [keyValueEvent](_usehandlers_.md#keyvalueevent)
* [reactOrNativeEvent](_usehandlers_.md#reactornativeevent)

### Functions

* [useHandlers](_usehandlers_.md#usehandlers)

## Type aliases

###  eventLikeHandlers

Ƭ **eventLikeHandlers**: *Handler‹string | EventTarget | null, [keyValueEvent](_usehandlers_.md#keyvalueevent)‹string›, void›*

___

###  keyValueEvent

Ƭ **keyValueEvent**: *[string, T, EventTarget | null]*

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
