# Performance and safety

## Batch mapping

Mapping time grows with the number of rows, fillable fields, and the size of the selected body values. Mapping itself makes no database or network requests. Include your model's constructor, casts, mutators, and any database writes when measuring the operation.

For large jobs, measure with your actual model and typical inputs. Process one batch at a time and release its results to keep memory use down.

## Request data and authorization

- Use a validated Form Request or an application-prepared array for ordinary writes.
- `fromRequestInput()` checks the structure of selected values. Your app handles authorization and rules such as date formats, field lengths, and allowed ranges.
- Set a request body size limit before parsing. The mapper has no size or depth limit, so bound the selected data before mapping, including fields added by middleware or a Form Request.
- Pass only attribute names and values your app has authorized to `merge()`, `setId()`, and `setUuid()`. These methods can write outside the fillable list.
- Mapped values can include confidential or personal information. Return, log, or save only the values the operation requires.

See [Choosing an input source](mapping-input.md) and [Building the output](building-output.md).
