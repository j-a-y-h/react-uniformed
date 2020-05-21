[react-uniformed](../README.md) › ["useNormalizers"](_usenormalizers_.md)

# Module: "useNormalizers"

## Index

### Type aliases

* [UseNormalizersOption](_usenormalizers_.md#usenormalizersoption)

### Functions

* [useNormalizers](_usenormalizers_.md#usenormalizers)

## Type aliases

###  UseNormalizersOption

Ƭ **UseNormalizersOption**: *Readonly‹object›*

## Functions

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
