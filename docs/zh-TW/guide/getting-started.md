# 開始使用

Laravel Attribute Mapper 會把 Form Request 驗證過的欄位對應到 Eloquent Model 的可填屬性。你可以用映射結果建立資料，或只更新有傳入的欄位。

## 系統需求

| Laravel | Composer 宣告相容版本 | CI 矩陣的 PHP 版本 |
| --- | --- | --- |
| 12.x | PHP 8.x 系列的 8.2 以上版本 | 8.2、8.3、8.4、8.5 |
| 13.x | PHP 8.x 系列的 8.3 以上版本 | 8.3、8.4、8.5 |

## 安裝

在 Laravel 專案根目錄執行以下指令。

```sh
composer require mattmy/laravel-attribute-mapper
```

## 設定

安裝後就能直接使用。預設的 `Exact` 會比對同名欄位。用 `inputKeys()` 可指定單次映射的命名規則。要改應用程式的預設規則，可先[發布設定檔](configuration-and-errors.md)。

## 快速開始

在 `app/Http/Requests/MappingExampleRequest.php` 建立這個 Form Request。

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

將下方預覽路由加入 `routes/web.php`。

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

開啟 `/mapping-example?startTime=2026-12-01&endTime=2026-12-02`，就會收到 `{"start_time":"2026-12-01","end_time":"2026-12-02"}`。

## 下一步

- [選擇來源並映射欄位](mapping-input.md)。
- [補入屬性、篩選結果與填入 Model](building-output.md)。
- [設定應用程式預設值及處理錯誤](configuration-and-errors.md)。
- [查看效能與請求資料的限制](performance-and-safety.md)。
- [查詢方法與回傳型別](api-reference.md)。
