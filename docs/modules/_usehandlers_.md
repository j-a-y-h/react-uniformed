[react-uniformed](../README.md) › ["useHandlers"](_usehandlers_.md)

# Module: "useHandlers"

## Index

### Type aliases

- [eventLikeHandlers](_usehandlers_.md#eventlikehandlers)
- [keyValueEvent](_usehandlers_.md#keyvalueevent)
- [reactOrNativeEvent](_usehandlers_.md#reactornativeevent)

### Functions

- [useHandlers](_usehandlers_.md#usehandlers)

## Type aliases

### eventLikeHandlers

Ƭ **eventLikeHandlers**: _Handler‹string | EventTarget | null, [keyValueEvent](_usehandlers_.md#keyvalueevent)‹string›, void›_

---

### keyValueEvent

Ƭ **keyValueEvent**: _[string, T, EventTarget | null]_

---

### reactOrNativeEvent

Ƭ **reactOrNativeEvent**: _SyntheticEvent | Event_

## Functions

### useHandlers

▸ **useHandlers**<**T**, **K**, **R**, **Return**>(...`handlers`: Handler‹T, K, R›[]): _Handler‹T, K, Return›_

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

▪ **K**: _T[]_

▪ **R**: _Promise‹void› | void_

▪ **Return**

**Parameters:**

| Name          | Type               | Description                      |
| ------------- | ------------------ | -------------------------------- |
| `...handlers` | Handler‹T, K, R›[] | the list of specified functions. |

**Returns:** _Handler‹T, K, Return›_

A single function. When this function is invoked, it will call each specified
function in the order it was passed to this hook with the same arguments from the invocation.
If one of the specified handlers returns a promise, then this function will also return a promise.
