[react-uniformed](../README.md) › ["normalizeNestedObjects"](_normalizenestedobjects_.md)

# Module: "normalizeNestedObjects"

## Index

### Functions

* [normalizeNestedObjects](_normalizenestedobjects_.md#normalizenestedobjects)

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
