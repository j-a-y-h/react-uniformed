[react-uniformed](../README.md) › ["useTouch"](../modules/_usetouch_.md) › [UseTouchHook](_usetouch_.usetouchhook.md)

# Interface: UseTouchHook

## Hierarchy

* **UseTouchHook**

## Index

### Properties

* [isDirty](_usetouch_.usetouchhook.md#readonly-isdirty)
* [resetTouches](_usetouch_.usetouchhook.md#readonly-resettouches)
* [setTouch](_usetouch_.usetouchhook.md#readonly-settouch)
* [setTouches](_usetouch_.usetouchhook.md#readonly-settouches)
* [touchField](_usetouch_.usetouchhook.md#readonly-touchfield)
* [touches](_usetouch_.usetouchhook.md#readonly-touches)

## Properties

### `Readonly` isDirty

• **isDirty**: *boolean*

Set to true if any field is touched.

___

### `Readonly` resetTouches

• **resetTouches**: *function*

Sets all touch state to false.

#### Type declaration:

▸ (): *void*

___

### `Readonly` setTouch

• **setTouch**: *[TouchHandler](_usetouch_.touchhandler.md)*

Sets the touch state for the specified input to the specified touched value.

___

### `Readonly` setTouches

• **setTouches**: *function*

Replaces the touch state object with the specified touches object map.

#### Type declaration:

▸ (`touches`: [Touches](../modules/_usetouch_.md#touches)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`touches` | [Touches](../modules/_usetouch_.md#touches) |

___

### `Readonly` touchField

• **touchField**: *[TouchFieldHandler](_usetouch_.touchfieldhandler.md)*

Sets the specified input's touch state to true.

___

### `Readonly` touches

• **touches**: *[Touches](../modules/_usetouch_.md#touches)*

An object map that contains the touch state of an input.
The key is used to indentify the input -- generally this is the input name.
The value is a boolean that determines if the node is touched or not.
