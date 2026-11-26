# API reference

`Mattmy\FillMap\AttributeMapper` captures input and configures mappings. `Mattmy\FillMap\MappingSource` holds the input you can map to a model with `forModel()`. See the `Exact`, `Camel`, `Snake`, `Pascal`, and `Kebab` [naming rules](mapping-input.md#match-model-attributes-to-source-keys) in `Mattmy\FillMap\InputKeyStyle`.

## Capture input and choose a model

| Signature | Result |
| --- | --- |
| `AttributeMapper::from(array\|FormRequest $input): MappingSource` | Captures prepared attributes or a Form Request's validated data. |
| `AttributeMapper::fromRequestInput(Request $request, array $keys): MappingSource` | Captures the named top-level fields present in the parsed body. Pass a list of non-empty strings matching the body keys exactly. [Body field example](mapping-input.md#select-fields-from-the-request-body) |
| `MappingSource::forModel(string\|Model $model): AttributeMapper` | Starts a mapping for an Eloquent model instance or a class constructible without arguments. |

See [Choose a source](mapping-input.md#choose-a-source).

## Configure a mapping

Each method returns a new `AttributeMapper` with the updated settings.

| Signature | Effect |
| --- | --- |
| `inputKeys(InputKeyStyle $style): self` | Selects the naming style for the chain. |
| `aliases(array $aliases): self` | Sets source keys for specific attributes. Pass all aliases at once. [Alias example](mapping-input.md#set-aliases) |
| `merge(array $attributes): self` | Adds or overwrites attributes with an application-provided map of model attribute names to values. |
| `setId(mixed $value = null, mixed $attribute = 'id'): self` | Adds a positive integer ID, or integer zero if the value is omitted or `null`. |
| `setUuid(mixed $value = null, mixed $attribute = 'uuid'): self` | Adds a UUID string from a valid string, a `UuidInterface`, or Laravel's UUID generator when the value is omitted or `null`. |
| `only(mixed $attributes): self` | Keeps the named model attributes. |
| `except(mixed $attributes): self` | Excludes the named model attributes. |
| `withoutBlank(mixed $attributes = null): self` | Removes blank values from the named attributes, or from all attributes when omitted or `null`. |

See [Add application-provided attributes](building-output.md#add-application-provided-attributes) and [Select attributes and remove blank values](building-output.md#select-attributes-and-remove-blank-values) for accepted values and examples.

## Get the output

| Signature | Result |
| --- | --- |
| `toArray(): array` | An `array<string, mixed>` of model attribute names and values. |
| `collect(): Collection` | An `Illuminate\Support\Collection<string, mixed>` of the same attributes. |
| `toModel(): Model` | Returns a new filled model for a class target, or updates and returns the model instance you supplied. |

See [When errors surface](configuration-and-errors.md#when-errors-surface) for exceptions and [Configuration and errors](configuration-and-errors.md) for the naming default and publish command.
