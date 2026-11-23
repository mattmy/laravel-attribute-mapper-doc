# Mapping input

Call `forModel()` on a `MappingSource` to choose an Eloquent model instance or a class you can create without arguments. You can reuse the same source with different models.

## Choose a source

| Source | What you can map |
| --- | --- |
| `AttributeMapper::from($array)` | An array keyed by top-level input names, such as the result of `$request->validate($rules)`. |
| `AttributeMapper::from($formRequest)` | The result of `validated()` from a Laravel `FormRequest`. Laravel handles validation and authorization before your controller runs. |
| `AttributeMapper::fromRequestInput($request, $keys)` | The actual top-level keys you list, read from Laravel's current parsed JSON or form body. |

## Create a model from its class

Pass `Appointment::class` directly when creating a new appointment. Here, `$request` is a validated Form Request with an `endTime` field, and `Appointment` lists `end_time` as fillable.

```php
use App\Models\Appointment;
use Mattmy\FillMap\AttributeMapper;
use Mattmy\FillMap\InputKeyStyle;

$appointment = AttributeMapper::from($request)
    ->forModel(Appointment::class)
    ->inputKeys(InputKeyStyle::Camel)
    ->toModel();
```

`toModel()` returns a new `Appointment` with `end_time` filled when `endTime` was submitted. Call `$appointment->save()` when you want to insert it.

## Update from validated input

In this controller example, `$request` is a validated Form Request with `['sometimes', 'nullable', 'date']` for `endTime`. The existing `$appointment` model lists `end_time` as fillable.

```php
use Mattmy\FillMap\AttributeMapper;
use Mattmy\FillMap\InputKeyStyle;

$updated = AttributeMapper::from($request)
    ->forModel($appointment)
    ->inputKeys(InputKeyStyle::Camel)
    ->toModel();
```

Omit `endTime` to keep the existing value, or send `{"endTime": null}` to clear it. Call `$updated->save()` to write the change.

## Select fields from the request body

If your application accepts selected unvalidated body fields, list the keys to read. With `{"endTime": "2026-12-01"}` in the body, this example returns `['end_time' => '2026-12-01']`.

```php
use Mattmy\FillMap\AttributeMapper;
use Mattmy\FillMap\InputKeyStyle;

$attributes = AttributeMapper::fromRequestInput($request, ['endTime'])
    ->forModel($appointment)
    ->inputKeys(InputKeyStyle::Camel)
    ->toArray();
```

- Use exact, case-sensitive body keys. An empty list selects nothing. Duplicate names select each field once.
- The mapper reads Laravel's parsed JSON or form body, including fields already merged into it. A key found only in the query string, route parameters, cookies, headers, or uploaded files is skipped. If Laravel turns malformed JSON into an empty body, the selection is empty too.
- Selected values may be `null`, booleans, integers, floats, strings, or finite nested arrays of those values. Nested keys are preserved. Objects, resources, and circular arrays raise an error at selection, even for fields you later filter out.
- If a selected value contains PHP references, later changes to the referenced variables do not affect the result. Prepared arrays, validated data, and `merge()` retain PHP's usual nested-reference behavior.

To combine validated data with selected body fields, map the body fields first, then pass their mapped attributes to `merge()` on the validated mapping. The merged value wins if both sources target the same attribute. See [Request data limits and authorization](performance-and-safety.md#request-data-and-authorization).

## Match model attributes to source keys

The model's `getFillable()` list limits which attributes you can map or target with an alias, even when Eloquent is unguarded. With an empty fillable list, you can still [add attributes explicitly](building-output.md).

| `InputKeyStyle` | Source key for `end_time` | Source key for `displayName` |
| --- | --- | --- |
| `Exact` (default) | `end_time` | `displayName` |
| `Camel` | `endTime` | `displayName` |
| `Snake` | `end_time` | `display_name` |
| `Pascal` | `EndTime` | `DisplayName` |
| `Kebab` | `end-time` | `display-name` |

Source keys match exactly, including case and dots. For a fillable JSON path such as `options->enabled`, use the full key with `Exact` or set an alias.

The order is alias, last `inputKeys()` call, then the [application default](configuration-and-errors.md). If two attributes resolve to the same source key, change the style or give one a different alias. A derived key that is empty or becomes an integer in PHP cannot match an input field. Use a valid alias for that attribute.

Naming conversions follow the installed Laravel version. Use `Exact` or an alias when a source key must stay the same across versions.

The mapper skips missing keys and keeps explicit values such as `null`, `false`, `0`, `''`, and `[]`. Use [output filters](building-output.md) to remove blank values.

### Set aliases

Use `aliases()` to set the source key for a particular attribute. The map is **input key → model attribute**. For example, your Form Request validates `expiresAt`, and `$appointment` allows `start_time` and `end_time` in its fillable list.

```php
use Mattmy\FillMap\AttributeMapper;
use Mattmy\FillMap\InputKeyStyle;

$attributes = AttributeMapper::from($request)
    ->forModel($appointment)
    ->inputKeys(InputKeyStyle::Camel)
    ->aliases(['expiresAt' => 'end_time'])
    ->toArray();
```

If the validated input contains `startTime` and `expiresAt`, the naming style maps `startTime` to `start_time`, and the alias maps `expiresAt` to `end_time`. If `expiresAt` is missing, the result omits `end_time` even when `endTime` is present.

Pass all aliases in one call per chain. To use a different set, branch from a chain before setting aliases.

See [valid field names and errors](configuration-and-errors.md) and the [API reference](api-reference.md).
