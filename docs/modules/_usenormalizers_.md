[react-uniformed](../README.md) › ["useNormalizers"](_usenormalizers_.md)

# Module: "useNormalizers"

## Index

### Type aliases

* [UseNormalizersOption](_usenormalizers_.md#usenormalizersoption)

### Functions

* [normalizeNestedObjects](_usenormalizers_.md#normalizenestedobjects)
* [useNormalizers](_usenormalizers_.md#usenormalizers)

## Type aliases

###  UseNormalizersOption

Ƭ **UseNormalizersOption**: *Readonly‹object›*

## Functions

###  normalizeNestedObjects

▸ **normalizeNestedObjects**(): *[NormalizerHandler](../interfaces/_usefields_.normalizerhandler.md)*

Used to add nested object support to useFields or useForms. Nested objects
must use bracket notation. E.g. referencing an
array value indexed at `0` would look like this `arrayName[0]`; referencing an object
value that is keyed by `'country'` would look like this `locations[country]`.

**`example`** <caption>Basic mapping</caption>
```javascript
   // jsx
   <input name="users[0]" value="John">
   // field value
   {users: ["John"]}

   // jsx
   <input name="users[0][name]" value="John">
   // field value
   {users: [{
       name: "John"
   }]}

   // jsx
   <input name="user['string keys with spaces']" value="John">
   // field value
   {user: {"string keys with spaces": "John"}}
```

**`example`** <caption>Usage with [useForm](_useform_.md#useform) and [useFields](_usefields_.md#usefields)</caption>
```javascript
const {values} = useFields(
  {}, // initialValues must come first
  normalizeNestedObjects()
);

const {values} = useForm({
  normalizer: normalizeNestedObjects()
});
```

**Returns:** *[NormalizerHandler](../interfaces/_usefields_.normalizerhandler.md)*

Returns a normalizer handler

___

###  useNormalizers

▸ **useNormalizers**(...`normalizers`: [NormalizerHandler](../interfaces/_usefields_.normalizerhandler.md) | object[]): *[NormalizerHandler](../interfaces/_usefields_.normalizerhandler.md)*

Creates a single normalizer function from the specified list of normalizers.
note: order matters when passing normalizers. This means that the results or value
of the first normalizer is passed to the next normalizer.

**`example`** 
```javascript
const normalizer = useNormalizers(
   // apply to all fields
   normalizeNestedObjects(),
   {
     // apply to only fields ending in name (eg: firstName, lastName)
     name: /name$/i,
     normalizer: ({value}) => !value ? value : value.toUpperCase(),
   },
   {
     // apply to only the date field
     name: "date",
     normalizer: ({value}) => !value ? value : value.replace(/-/g, "/"),
   },
   {
     // apply to username or slug field
     name: ["username", /^slug$/],
     normalizer: ({value}) => !value ? value : value.toLowerCase(),
   }
)
```

**`example`** <caption>Usage with [useForm](_useform_.md#useform) and [useFields](_usefields_.md#usefields)</caption>
```javascript
const normalizer = useNormalizers({
  name: /name$/i,
  normalizer: ({value}) => !value ? value : value.toUpperCase()
});

const {values} = useFields(
  {}, // initialValues must come first
  normalizer
);

const {values} = useForm({ normalizer });
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...normalizers` | [NormalizerHandler](../interfaces/_usefields_.normalizerhandler.md) &#124; object[] | if you pass a normalizer handler then it will apply to all fields. You can specify a specific list of fields by passing in a [UseNormalizersOption](_usenormalizers_.md#usenormalizersoption) |

**Returns:** *[NormalizerHandler](../interfaces/_usefields_.normalizerhandler.md)*

returns a normalizer handler
