# Building the output

After `forModel()`, you can add values, filter attributes, or get the result. Each configuration method returns a new chain with its own settings. If two chains use the same model instance, `toModel()` updates that shared instance.

## Add application-provided attributes

```php
use Mattmy\FillMap\AttributeMapper;
use Mattmy\FillMap\InputKeyStyle;

// $appointment is an Eloquent model with end_time in its fillable list.
// $actorId is a positive integer selected and authorized by your application.
$attributes = AttributeMapper::from(['endTime' => '2026-12-01'])
    ->forModel($appointment)
    ->inputKeys(InputKeyStyle::Camel)
    ->setId($actorId, 'updated_by')
    ->merge(['status' => 'scheduled'])
    ->toArray();
```

The result includes `end_time`, `updated_by`, and `status`. You can add attributes outside the fillable list. If you add the same attribute more than once, its last value wins.

| Method | Values and defaults |
| --- | --- |
| `merge($attributes)` | Takes an array keyed by model attribute name. Added values override mapped input. |
| `setId($value, $attribute)` | Defaults to the `id` attribute. Omit the value or pass `null` to add integer `0`. An explicit value must be a positive PHP integer. Numeric strings, floats, booleans, and explicit `0` are invalid. |
| `setUuid($value, $attribute)` | Defaults to `uuid`. Omit the value or pass `null` to use Laravel's UUID generator. A valid UUID string stays as given, and a `Ramsey\Uuid\UuidInterface` becomes a string. The same chain reuses its UUID. |

The `attribute` argument sets the destination for `setId()` and `setUuid()`. For example, `setUuid(attribute: 'external_uuid')` generates a UUID for `external_uuid`. Add only [attributes and values your app has authorized](performance-and-safety.md#request-data-and-authorization).

## Select attributes and remove blank values

Use exact model attribute names in filters. After mapping and adding values, the mapper applies `only()` and `except()` before `withoutBlank()`. An attribute listed in both `only()` and `except()` is excluded.

| Method | Result |
| --- | --- |
| `only($attributes)` | Keeps the named attributes. Repeated calls keep their intersection. An empty list keeps nothing. |
| `except($attributes)` | Removes the named attributes. Repeated calls accumulate exclusions. An empty list excludes nothing. |
| `withoutBlank($attributes = null)` | Removes values Laravel treats as blank. Omit the argument or pass `null` to check all attributes. An empty list disables this filter. The last call sets its scope. |

Each method accepts one name or a list of names. `withoutBlank()` follows Laravel's `blank()` helper. It removes `null`, empty or whitespace-only strings, and empty arrays, and keeps `0`, `'0'`, and `false`. To clear an attribute with `null`, leave it out of the `withoutBlank()` scope.

## Get the result

| Method | What you get |
| --- | --- |
| `toArray()` | An array keyed by model attribute name, preserving the mapped values before Eloquent applies casts or mutators. |
| `collect()` | A Laravel Collection of those same keys and values. Use `all()` to retrieve the original items. |
| `toModel()` | A model filled with the result. A class target gives you a new instance on every call. An instance target is updated and returned. |

Every output uses the model's current `getFillable()` list. If you pass a class, `toArray()` and `collect()` also create an instance to read that list. Results follow fillable order, using the first occurrence of each name. Additions outside the list follow in the order you first added them.

`toModel()` uses Eloquent's `fill()` for fillable attributes and `setAttribute()` for additions outside the list. Eloquent still applies its mass-assignment rules to `fill()` and handles casts and mutators as usual.

Omitted attributes keep existing values or model defaults. Database defaults apply to columns omitted from an insert. Call `save()` to write the model. See [when errors surface](configuration-and-errors.md#when-errors-surface).
