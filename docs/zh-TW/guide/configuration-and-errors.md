# 設定與錯誤處理

要調整應用程式預設的命名規則，請先發布設定檔。

```sh
php artisan vendor:publish --tag=attribute-mapper-config
```

編輯 `config/attribute-mapper.php`。

```php
<?php

declare(strict_types=1);

use Mattmy\FillMap\InputKeyStyle;

return [
    'input_key_style' => InputKeyStyle::Camel,
];
```

| 設定鍵 | 預設值 | 可用值 |
| --- | --- | --- |
| `attribute-mapper.input_key_style` | `InputKeyStyle::Exact` | `InputKeyStyle` 的列舉成員，或不分大小寫的名稱字串，例如 `'camel'` 或 `'Camel'`。 |

單一映射鏈可用 `inputKeys()` 覆寫預設值。`fromRequestInput()` 仍須列出請求主體的實際欄位名稱。若有使用設定快取，修改後請重新執行 `php artisan config:cache`。

## 合法欄位名稱

名稱須為非空字串，且用作 PHP 陣列鍵時仍為字串。`''`、整數 `1` 和字串 `'1'` 都不合法。`'1.5'`、`'end-time'`、`'profile.name'` 及 `'options->enabled'` 都是合法名稱，會依字面比對。

此規則適用於頂層輸入鍵、入選的請求主體欄位、可填清單、別名兩端、篩選名稱及補值欄位名稱。名稱清單須使用從零開始的連續整數索引。巢狀值可以有整數鍵。

## 錯誤回報時機

| 時機 | 拋出 `InvalidArgumentException` 的情況 |
| --- | --- |
| 擷取來源時 | 輸入鍵或請求主體選欄清單格式錯誤，或入選欄位含不支援的結構。 |
| 指定 Model 或設定映射鏈時 | Model 類別無效、欄位名稱或清單格式錯誤、別名目標重複、第二次呼叫 `aliases()`，或提供無效的 ID 或 UUID。先前傳入空的別名對照也算一次設定。 |
| 呼叫 `toArray()`、`collect()` 或 `toModel()` 時 | 映射鏈使用的預設值無效、可填清單含無效名稱、別名目標不在可填清單，或兩個屬性對應到同一個來源鍵。即使來源未提供該鍵，或屬性會被篩選掉，也會檢查。 |

`toModel()` 會先檢查映射，再填入屬性。Laravel 驗證與授權、Model 建構，以及 Eloquent 的錯誤（例如 `MassAssignmentException`）都保留原本的例外類型。若 cast 或 mutator 在填入中途拋出例外，既有 Model 已填入的屬性可能會保留新值。

可用方法及參數請見 [API 參考](api-reference.md)。
