# 映射輸入

`from()` 和 `fromRequestInput()` 在呼叫時就會取值，並回傳 `MappingSource`。用 `forModel()` 傳入 Eloquent Model 實例，或可不帶參數建立的 Model 類別。同一份來源可對應到不同的 Model。

## 選擇來源

| 來源 | 可映射的內容 |
| --- | --- |
| `AttributeMapper::from($array)` | 以頂層輸入欄位名稱為鍵的陣列，例如 `$request->validate($rules)` 的結果。 |
| `AttributeMapper::from($formRequest)` | Laravel `FormRequest` 的 `validated()` 結果。Laravel 會在控制器執行前處理驗證與授權。 |
| `AttributeMapper::fromRequestInput($request, $keys)` | Laravel 已解析的 JSON 或表單請求主體中，指定的頂層欄位。 |

## 傳入 Model 類別來建立新資料

建立新預約時，可以直接傳入 `Appointment::class`。下例的 `$request` 是已通過驗證的 Form Request，欄位名稱是 `endTime`，而 `Appointment` 將 `end_time` 列為可填屬性。

```php
use App\Models\Appointment;
use Mattmy\FillMap\AttributeMapper;
use Mattmy\FillMap\InputKeyStyle;

$appointment = AttributeMapper::from($request)
    ->forModel(Appointment::class)
    ->inputKeys(InputKeyStyle::Camel)
    ->toModel();
```

`toModel()` 會回傳新的 `Appointment` 實例。有傳入 `endTime` 時，就會填上 `end_time`。準備好新增資料時，再呼叫 `$appointment->save()`。

## 使用驗證結果更新資料

在這個控制器範例中，`$request` 是已通過驗證的 Form Request，`endTime` 使用 `['sometimes', 'nullable', 'date']` 規則。既有的 `$appointment` Model 將 `end_time` 列為可填屬性。

```php
use Mattmy\FillMap\AttributeMapper;
use Mattmy\FillMap\InputKeyStyle;

$updated = AttributeMapper::from($request)
    ->forModel($appointment)
    ->inputKeys(InputKeyStyle::Camel)
    ->toModel();
```

省略 `endTime` 會保留原值，傳入 `{"endTime": null}` 則會清空。呼叫 `$updated->save()` 寫入資料庫。

## 選取請求主體欄位

列出應用程式允許從未驗證的請求主體讀取的欄位。若 `$request` 的主體包含 `{"endTime": "2026-12-01"}`，且 `$appointment` 將 `end_time` 列為可填屬性，下例會回傳 `['end_time' => '2026-12-01']`。

```php
use Mattmy\FillMap\AttributeMapper;
use Mattmy\FillMap\InputKeyStyle;

$attributes = AttributeMapper::fromRequestInput($request, ['endTime'])
    ->forModel($appointment)
    ->inputKeys(InputKeyStyle::Camel)
    ->toArray();
```

- 請使用實際欄位名稱，並注意大小寫。空清單不會選取任何欄位，重複名稱只會取一次。
- 套件從 Laravel 已解析的 JSON 或表單主體取值，包含已合併進主體的欄位。若欄位只出現在查詢字串、路由參數、Cookie、標頭或上傳檔案中，就會略過。若 Laravel 將格式錯誤的 JSON 解析為空主體，選取結果也是空的。
- 可選取 `null`、布林、整數、浮點數、字串，或由這些值組成的有限巢狀陣列。巢狀鍵會原樣保留。入選值若含物件、資源或循環陣列，即使後續會排除，也會在選取時報錯。
- `fromRequestInput()` 複製選取的值，切斷頂層與巢狀 PHP 參照。`from()` 和 `merge()` 會保留這兩種參照，建立映射鏈後若修改被參照的變數，後續輸出會反映新值。

若要合併驗證結果與請求主體欄位，先把選取的主體欄位映射成屬性，再用 `merge()` 補入驗證結果的映射鏈。同一屬性以補入的值為準。另見[請求資料與授權](performance-and-safety.md#請求資料與授權)。

## 對應 Model 屬性與來源鍵

Model 的 `getFillable()` 決定哪些屬性能從來源映射或設為別名目標。即使關閉 Eloquent 的批次賦值保護，也以這份清單為準。可填清單為空時，仍可[明確補入屬性](building-output.md)。

| `InputKeyStyle` | `end_time` 的來源鍵 | `displayName` 的來源鍵 |
| --- | --- | --- |
| `Exact`（預設） | `end_time` | `displayName` |
| `Camel` | `endTime` | `displayName` |
| `Snake` | `end_time` | `display_name` |
| `Pascal` | `EndTime` | `DisplayName` |
| `Kebab` | `end-time` | `display-name` |

來源鍵會精確比對，包含大小寫和點號。若可填屬性是 `options->enabled` 這類 JSON 路徑，可用 `Exact` 比對完整鍵，或設定別名。

別名優先，其次是最後一次 `inputKeys()` 設定，最後才用[應用程式預設規則](configuration-and-errors.md)。若兩個屬性對應到同一個來源鍵，請更換命名規則，或替其中一個屬性設定不同的別名。若命名規則產生空字串或整數鍵，請用合法的別名指定來源鍵。

命名轉換依實際安裝的 Laravel 版本而定。若來源鍵必須跨版本一致，請用 `Exact` 或設定別名。

套件會略過沒傳的鍵，保留明確傳入的 `null`、`false`、`0`、`''` 和 `[]`。需要移除空值時，可用[輸出篩選](building-output.md)。

### 設定別名

用 `aliases()` 傳入 **輸入鍵 → Model 屬性** 的對照。這個範例的 Form Request 驗證 `startTime` 和 `expiresAt`，而 `$appointment` 將 `start_time` 和 `end_time` 列為可填屬性。

```php
use Mattmy\FillMap\AttributeMapper;
use Mattmy\FillMap\InputKeyStyle;

$attributes = AttributeMapper::from($request)
    ->forModel($appointment)
    ->inputKeys(InputKeyStyle::Camel)
    ->aliases(['expiresAt' => 'end_time'])
    ->toArray();
```

驗證結果包含 `startTime` 和 `expiresAt` 時，`startTime` 依小駝峰規則對應到 `start_time`，`expiresAt` 則依別名對應到 `end_time`。若漏傳 `expiresAt`，即使有 `endTime`，結果也會略過 `end_time`。

每條鏈一次提供所有別名。要使用另一組別名時，從尚未設定別名的鏈建立分支。

另見[合法欄位名稱與錯誤](configuration-and-errors.md)和 [API 參考](api-reference.md)。
