# Getting started

Laravel Attribute Mapper maps validated Form Request fields to an Eloquent model's fillable attributes. Use the mapped attributes to create a record or update only the fields submitted.

## Requirements

| Laravel | Composer compatibility | PHP versions in the CI matrix |
| --- | --- | --- |
| 12.x | PHP 8.2 or later in the 8.x series | 8.2, 8.3, 8.4, 8.5 |
| 13.x | PHP 8.3 or later in the 8.x series | 8.3, 8.4, 8.5 |

## Installation

Run this from your Laravel project root.

```sh
composer require mattmy/laravel-attribute-mapper
```

## Configuration

You can use the package as soon as it’s installed. By default, `Exact` matches input keys to identical model attribute names. Use `inputKeys()` to change the style for one mapping, or [publish the configuration](configuration-and-errors.md) to set your app’s default.

## Quick start

Create this Form Request in `app/Http/Requests/MappingExampleRequest.php`.

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MappingExampleRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'startTime' => ['sometimes', 'date'],
            'endTime' => ['sometimes', 'nullable', 'date'],
        ];
    }
}
```

Add this preview route to `routes/web.php`.

```php
use App\Http\Requests\MappingExampleRequest;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Route;
use Mattmy\FillMap\AttributeMapper;
use Mattmy\FillMap\InputKeyStyle;

Route::get('/mapping-example', static function (MappingExampleRequest $request): array {
    $model = new class() extends Model
    {
        protected $fillable = ['start_time', 'end_time'];
    };

    return AttributeMapper::from($request)
        ->forModel($model)
        ->inputKeys(InputKeyStyle::Camel)
        ->toArray();
});
```

Visit `/mapping-example?startTime=2026-12-01&endTime=2026-12-02` to get `{"start_time":"2026-12-01","end_time":"2026-12-02"}`.

## Next steps

- [Choose a source and map its keys](mapping-input.md).
- [Add attributes, filter the result, and fill a model](building-output.md).
- [Set an application default and handle errors](configuration-and-errors.md).
- [Check performance and request data limits](performance-and-safety.md).
- [Look up methods and return types](api-reference.md).
