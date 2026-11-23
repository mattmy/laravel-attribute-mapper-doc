# API reference

Use `Mattmy\FillMap\AttributeMapper` to start a mapping. `Mattmy\FillMap\MappingSource` represents the input captured for mapping. `Mattmy\FillMap\InputKeyStyle` supplies the `Exact`, `Camel`, `Snake`, `Pascal`, and `Kebab` [naming rules](mapping-input.md#match-model-attributes-to-source-keys).

## Capture input and choose a model

| Signature | Result |
| --- | --- |
| `AttributeMapper::from(array\|FormRequest $input): MappingSource` | Captures prepared attributes or a Form Request's validated data. |
| `AttributeMapper::fromRequestInput(Request $request, array $keys): MappingSource` | Captures the named top-level keys present in the parsed body. `$keys` is a list of non-empty strings. |
| `MappingSource::forModel(string\|Model $model): AttributeMapper` | Starts a mapping for an Eloquent model instance or a class constructible without arguments. |

See [Choosing and mapping input](mapping-input.md).

## Configure a mapping

Each method returns an `AttributeMapper` with that branch's settings.

| Signature | Effect |
| --- | --- |
| `inputKeys(InputKeyStyle $style): self` | Selects the naming style for the chain. |
| `aliases(array $aliases): self` | [Set source keys for specific attributes](mapping-input.md#set-aliases). Pass all aliases at once. |
| `merge(array $attributes): self` | Adds or overwrites attributes with an application-provided map of model attribute names to values. |
| `setId(mixed $value = null, mixed $attribute = 'id'): self` | Adds a positive integer ID, or integer zero if the value is omitted or `null`. |
| `setUuid(mixed $value = null, mixed $attribute = 'uuid'): self` | Adds a UUID string from a valid string, a `UuidInterface`, or Laravel's UUID generator when the value is omitted or `null`. |
| `only(mixed $attributes): self` | Keeps the named model attributes. |
| `except(mixed $attributes): self` | Excludes the named model attributes. |
| `withoutBlank(mixed $attributes = null): self` | Removes blank values from the named attributes, or from all attributes when omitted or `null`. |

See [Building the output](building-output.md) for valid argument types, overwrite rules, and filter behavior.

## Get the output

| Signature | Result |
| --- | --- |
| `toArray(): array` | An `array<string, mixed>` of model attribute names and values. |
| `collect(): Collection` | An `Illuminate\Support\Collection<string, mixed>` of the same attributes. |
| `toModel(): Model` | Returns a new filled model for a class target, or updates and returns the model instance you supplied. |

See [Configuration and errors](configuration-and-errors.md) for `InvalidArgumentException`, Laravel errors, and the `attribute-mapper-config` publish tag.
