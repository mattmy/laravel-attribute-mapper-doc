# API 參考

使用 `Mattmy\FillMap\AttributeMapper` 開始映射。`Mattmy\FillMap\MappingSource` 代表已擷取的輸入。`Mattmy\FillMap\InputKeyStyle` 提供 `Exact`、`Camel`、`Snake`、`Pascal` 和 `Kebab` 等[命名規則](mapping-input.md)。

## 擷取輸入並指定 Model

| 簽章 | 結果 |
| --- | --- |
| `AttributeMapper::from(array\|FormRequest $input): MappingSource` | 擷取應用程式準備好的陣列或 Form Request 的驗證結果。 |
| `AttributeMapper::fromRequestInput(Request $request, array $keys): MappingSource` | 擷取已解析的請求主體中，指定且存在的頂層鍵。`$keys` 是非空字串組成的清單。 |
| `MappingSource::forModel(string\|Model $model): AttributeMapper` | 對指定的 Eloquent Model 實例或可無參數建立的 Model 類別開始映射。 |

另見[選擇來源與映射輸入](mapping-input.md)。

## 設定映射鏈

每個方法都回傳套用該項設定的新 `AttributeMapper`。

| 簽章 | 用途 |
| --- | --- |
| `inputKeys(InputKeyStyle $style): self` | 指定鏈的命名規則。 |
| `aliases(array $aliases): self` | [為指定屬性設定來源鍵](mapping-input.md#設定別名)。每條鏈一次提供所有別名。 |
| `merge(array $attributes): self` | 以 Model 屬性名稱為鍵，補入或覆寫屬性值。 |
| `setId(mixed $value = null, mixed $attribute = 'id'): self` | 補入正整數 ID，省略值或傳入 `null` 時補入整數零。 |
| `setUuid(mixed $value = null, mixed $attribute = 'uuid'): self` | 補入 UUID 字串，接受合法字串或 `UuidInterface`，省略值或傳入 `null` 時由 Laravel 產生。 |
| `only(mixed $attributes): self` | 只保留指定的 Model 屬性。 |
| `except(mixed $attributes): self` | 排除指定的 Model 屬性。 |
| `withoutBlank(mixed $attributes = null): self` | 從指定的屬性移除空值。省略引數或傳入 `null` 時檢查所有屬性。 |

可用引數型別、覆寫規則及篩選行為請見[產生輸出](building-output.md)。

## 取得輸出

| 簽章 | 結果 |
| --- | --- |
| `toArray(): array` | 以 Model 屬性名稱為鍵的 `array<string, mixed>`。 |
| `collect(): Collection` | 包含相同屬性的 `Illuminate\Support\Collection<string, mixed>`。 |
| `toModel(): Model` | 傳入類別時回傳填好的新 Model，傳入實例時更新並回傳該實例。 |

`InvalidArgumentException`、Laravel 錯誤和 `attribute-mapper-config` 發布標籤請見[設定與錯誤處理](configuration-and-errors.md)。
