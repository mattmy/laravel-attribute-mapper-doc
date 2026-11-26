# 產生輸出

呼叫 `forModel()` 後，可以補值、篩選屬性或取得結果。每次設定都會回傳一條新鏈，可各自套用不同設定。若兩條鏈使用同一個 Model 實例，`toModel()` 會更新該實例。

## 補入應用程式提供的屬性

```php
use Mattmy\FillMap\AttributeMapper;
use Mattmy\FillMap\InputKeyStyle;

// $appointment 是將 end_time 列為可填屬性的 Eloquent Model。
// $actorId 是應用程式選定且已授權使用的正整數。
$attributes = AttributeMapper::from(['endTime' => '2026-12-01'])
    ->forModel($appointment)
    ->inputKeys(InputKeyStyle::Camel)
    ->setId($actorId, 'updated_by')
    ->merge(['status' => 'scheduled'])
    ->toArray();
```

結果包含 `end_time`、`updated_by` 和 `status`，即使 `updated_by` 和 `status` 不在可填清單內。透過 `merge()`、`setId()` 或 `setUuid()` 為同一屬性補值多次時，以最後一次為準。

| 方法 | 可用值及預設行為 |
| --- | --- |
| `merge($attributes)` | 傳入以 Model 屬性名稱為鍵的陣列。補入的值會覆寫來源映射的結果。 |
| `setId($value, $attribute)` | 預設寫入 `id`。省略值或傳入 `null` 時補入整數 `0`。明確給值時須為 PHP 正整數。數字字串、浮點數、布林值及明確傳入的 `0` 都不合法。 |
| `setUuid($value, $attribute)` | 預設寫入 `uuid`。省略值或傳入 `null` 時，會立即用 Laravel 的產生器建立 UUID。合法 UUID 字串會原樣保留，`Ramsey\Uuid\UuidInterface` 會轉成字串。同一條鏈每次輸出都會沿用這個值。 |

`setId()` 和 `setUuid()` 都可用 `attribute` 指定要補值的屬性。例如，`setUuid(attribute: 'external_uuid')` 會產生 UUID 並補到 `external_uuid`。補值時請只使用[應用程式已授權的屬性與值](performance-and-safety.md#請求資料與授權)。

## 選取屬性與移除空值

篩選時請填寫 Model 屬性名稱，大小寫須一致。套件完成映射與補值後，會先套用 `only()` 和 `except()`，再執行 `withoutBlank()`。同時列在 `only()` 和 `except()` 的屬性會被排除。

| 方法 | 結果 |
| --- | --- |
| `only($attributes)` | 只保留指定屬性。重複呼叫取交集。傳空清單會得到空結果。 |
| `except($attributes)` | 排除指定屬性。重複呼叫會累積排除的名稱。傳空清單不會排除欄位。 |
| `withoutBlank($attributes = null)` | 移除 Laravel 視為空的值。省略引數或傳入 `null` 時檢查所有屬性。空清單會停用此篩選，重複呼叫時以最後一次設定的範圍為準。 |

三種方法都接受單一名稱或名稱清單。`only()` 只保留結果中符合名稱的屬性。`except()` 和 `withoutBlank()` 會略過結果中沒有的名稱。

`withoutBlank()` 用 Laravel 的 `blank()` 移除 `null`、空字串、只有空白的字串及空陣列，並保留 `0`、`'0'` 和 `false`。若要用 `null` 清空 `end_time`，可略過 `withoutBlank()`，或只篩選其他欄位。例如 `withoutBlank('notes')` 會移除空白備註，並保留明確傳入的 `end_time => null`。

## 取得結果

| 方法 | 回傳內容 |
| --- | --- |
| `toArray()` | 以 Model 屬性名稱為鍵的陣列，保留 Eloquent 套用 cast 或 mutator 前的映射值。 |
| `collect()` | 包含相同欄位和值的 Laravel Collection。可用 `all()` 取得原始項目。 |
| `toModel()` | 已填入結果的 Model。目標為類別時，每次呼叫都會建立新實例。目標為實例時，填入後會回傳同一個實例。 |

每次輸出都以 Model 當下的 `getFillable()` 清單為準。傳入類別時，`toArray()` 和 `collect()` 也會建立實例來讀取這份清單。結果依可填清單排列，重複名稱取第一次出現的位置。清單外的屬性接在後面，依第一次補入的順序排列。

`toModel()` 用 Eloquent 的 `fill()` 填入可填屬性，清單外補值則用 `setAttribute()`。Eloquent 仍依批次賦值規則處理 `fill()`，cast 和 mutator 也照常運作。

省略的屬性會保留原值或 Model 預設值。新增資料時，資料庫預設值適用於未寫入的欄位。呼叫 `save()` 才會寫入資料庫。另見[錯誤回報時機](configuration-and-errors.md#錯誤回報時機)。
