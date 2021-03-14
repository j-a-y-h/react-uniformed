[react-uniformed](../README.md) › ["useSettersAsEventHandler"](_usesettersaseventhandler_.md)

# Module: "useSettersAsEventHandler"

## Index

### Interfaces

- [ReactOrNativeEventListener](../interfaces/_usesettersaseventhandler_.reactornativeeventlistener.md)

### Functions

- [useSettersAsEventHandler](_usesettersaseventhandler_.md#usesettersaseventhandler)

## Functions

### useSettersAsEventHandler

▸ **useSettersAsEventHandler**(...`handlers`: [eventLikeHandlers](_usehandlers_.md#eventlikehandlers)[]): _[ReactOrNativeEventListener](../interfaces/_usesettersaseventhandler_.reactornativeeventlistener.md)_

Converts a list of setters to a single event handler. Setters are functions
that takes a specified name as the first parameter and a specified value as
the second param. Note that this hook is built on top of [useHandlers](_usehandlers_.md#usehandlers).

**`example`** <caption>Create an onChange event handler</caption>

```javascript
// set values and touches on change
const handleChange = useSettersAsEventHandler(setValue, touchField);

// set values and touches on change as well as validate
const handleChange = useSettersAsEventHandler(setValue, touchField, validateByName);

<input name='username' value={values.username} onChange={handleChange} />;
```

**`example`** <caption>Creating an onBlur event handler</caption>

```javascript
// set values and touches on change
const handleChange = useSettersAsEventHandler(setValue, touchField);

// validation may be expensive so validate on blur.
const handleBlur = useSettersAsEventHandler(validateByName);

<input name='username' value={values.username} onChange={handleChange} onBlur={handleBlur} />;
```

**Parameters:**

| Name          | Type                                                      | Description                                             |
| ------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| `...handlers` | [eventLikeHandlers](_usehandlers_.md#eventlikehandlers)[] | A list of setters that will be used in an event handler |

**Returns:** _[ReactOrNativeEventListener](../interfaces/_usesettersaseventhandler_.reactornativeeventlistener.md)_

An event handler that can be used in events like onChange or onBlur. In order
for this hook to call each setter with a name and value param, the inputs that this
is used on must have a name attribute that maps to the specified.
