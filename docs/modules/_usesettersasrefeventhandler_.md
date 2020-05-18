[react-uniformed](../README.md) › ["useSettersAsRefEventHandler"](_usesettersasrefeventhandler_.md)

# Module: "useSettersAsRefEventHandler"

## Index

### Functions

* [useSettersAsRefEventHandler](_usesettersasrefeventhandler_.md#usesettersasrefeventhandler)

## Functions

###  useSettersAsRefEventHandler

▸ **useSettersAsRefEventHandler**<**T**, **V**>(`props`: UseEventHandlersWithRefProps‹V›): *Ref‹T›*

A hook that adds support for uncontrolled inputs using
React refs. The React ref is used to synchronize the state of the input in the DOM
and the state of the form in the Virtual DOM.
This hook is generally only needed for larger forms or larger React Virtual DOM.

**Type parameters:**

▪ **T**: *HTMLElement*

▪ **V**: *[Fields](_usefields_.md#fields)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | UseEventHandlersWithRefProps‹V› |

**Returns:** *Ref‹T›*

returns a React ref function.

▸ **useSettersAsRefEventHandler**<**T**>(...`setters`: [eventLikeHandlers](_usehandlers_.md#eventlikehandlers)[]): *Ref‹T›*

A hook that adds support for uncontrolled inputs using
React refs. The React ref is used to synchronize the state of the input in the DOM
and the state of the form in the Virtual DOM.
This hook is generally only needed for larger forms or larger React Virtual DOM.

**`example`** 
```
import {useSettersAsRefEventHandler} from "react-uniformed";

// useSettersAsRefEventHandler defaults to an on change event
const changeRef = useSettersAsRefEventHandler(setValue);

// name attribute is still required as the changeRef calls setValue(name, value) on change
<input name="name" ref={changeRef} />
```

**Type parameters:**

▪ **T**: *HTMLElement*

**Parameters:**

Name | Type |
------ | ------ |
`...setters` | [eventLikeHandlers](_usehandlers_.md#eventlikehandlers)[] |

**Returns:** *Ref‹T›*

returns a React ref function.
