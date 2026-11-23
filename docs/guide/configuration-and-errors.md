# Configuration and errors

Publish the configuration to change your application's default naming style.

```sh
php artisan vendor:publish --tag=attribute-mapper-config
```

Edit `config/attribute-mapper.php`:

```php
<?php

declare(strict_types=1);

use Mattmy\FillMap\InputKeyStyle;

return [
    'input_key_style' => InputKeyStyle::Camel,
];
```

| Config key | Default | Accepted values |
| --- | --- | --- |
| `attribute-mapper.input_key_style` | `InputKeyStyle::Exact` | An `InputKeyStyle` case or its case-insensitive name, such as `'camel'` or `'Camel'`. |

Use `inputKeys()` to override the default for one chain. `fromRequestInput()` still takes the exact names in the request body. If you cache config, run `php artisan config:cache` after editing the file.

## Valid field names

Use non-empty strings that stay strings when used as PHP array keys. `''`, integer `1`, and the string `'1'` are invalid. Names such as `'1.5'`, `'end-time'`, `'profile.name'`, and `'options->enabled'` are valid and matched literally.

This rule applies to top-level input keys, the selected body keys, fillable attributes, both sides of an alias, filter names, and names used by addition methods. A list of names must have consecutive numeric indexes starting at zero. Nested value keys may include integers.

## When errors surface

| When | What raises `InvalidArgumentException` |
| --- | --- |
| At input selection | Invalid input keys, an invalid list of body keys, or a selected body value with an unsupported structure. |
| When choosing the model or configuring the chain | An invalid model class, invalid names or list formats, duplicate alias targets, a second call to `aliases()` even after an empty alias map, or an invalid ID or UUID. |
| When calling `toArray()`, `collect()`, or `toModel()` | An invalid default that the chain uses, invalid fillable names, alias targets outside the fillable list, or two attributes resolving to the same source key. These checks apply even when a source key is missing or its attribute will be filtered out. |

`toModel()` checks the mapping before assigning attributes. Laravel validation and authorization errors, model constructor errors, and Eloquent errors such as `MassAssignmentException` keep their original exception types. If a cast or mutator throws during assignment, attributes already set on an existing model may keep their new values.

See the [API reference](api-reference.md) for the available methods and parameters.
