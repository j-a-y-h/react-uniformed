[react-uniformed](../README.md) › ["useTouch"](_usetouch_.md)

# Module: "useTouch"

## Index

### Interfaces

* [TouchFieldHandler](../interfaces/_usetouch_.touchfieldhandler.md)
* [TouchHandler](../interfaces/_usetouch_.touchhandler.md)
* [UseTouchHook](../interfaces/_usetouch_.usetouchhook.md)

### Type aliases

* [Touches](_usetouch_.md#touches)

### Functions

* [useTouch](_usetouch_.md#usetouch)

## Type aliases

###  Touches

Ƭ **Touches**: *Values‹boolean›*

## Functions

###  useTouch

▸ **useTouch**(): *[UseTouchHook](../interfaces/_usetouch_.usetouchhook.md)*

Tracks touches within a form.

**`example`** <caption>Basic example</caption>
```javascript
import React from 'react';
import {useTouch} from "react-uniformed";

const {touches, setTouch, resetTouches, touchField, setTouches, isDirty} = useTouch();

// set touch to true for an input
touchField('name');
// set the touch state to false for an input
setTouch('name', false);
// set the touch state for multiple inputs (used by useForm is about to be submitted)
setTouches({
  name: true,
  email: true,
});

// check the touch state for inputs
if (touches.name || touches.email)
  console.log("You touched the email and name field");

// check if any of the fields have been touched (works well when you are validating
// all inputs and want to only enable submitting after the user touches the form
// and resolves all errors)
if (isDirty && !hasError)
  console.log("submitting the for is now enabled");

// Use the resetTouches function when you want to reset the touch state.
resetTouches();
// resetTouches is used by useForm with other reset functions
const reset = useHandlers(resetValues, resetErrors, resetTouches);
```

**`example`** <caption>In JSX. _Note that [useForm](_useform_.md#useform) provides a less verbose api by wrapping useFields and useTouch_</caption>
```javascript
import React from 'react';
import {useTouch, useFields, useHandlers, useSettersAsEventHandler} from "react-uniformed";

const {values, setValue, resetValues} = useFields();
const {resetTouches, touchField, isDirty} = useTouch();

const handleChange = useSettersAsEventHandler(setValue, touchField);
const handleReset = useHandlers(resetValues, resetTouches);
return (
  <form>
     <label>Name:</label>
     <input name="name" value={values.name} onChange={handleChange} />

     <button onClick={handleReset}>Reset</button>
     <button disabled={!isDirty}>Submit</button>
  </form>
)
```

**Returns:** *[UseTouchHook](../interfaces/_usetouch_.usetouchhook.md)*
