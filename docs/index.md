---
layout: home
hero:
  name: Laravel Attribute Mapper
  text: Fill Eloquent models from Laravel requests
  tagline: Map request fields to fillable attributes by naming convention and spend less time writing field mappings for creates and updates.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: API reference
      link: /guide/api-reference
features:
  - title: Set an alias for a field
    details: If your request uses expiresAt and your model uses end_time, set an alias to match them.
  - title: Update only what was sent
    details: Leave a field out to keep its current value, or send null to clear it if the field allows it.
  - title: Use your preferred request field style
    details: Prefer camelCase? Choose that style to map endTime in the request body to end_time. You can also use snake_case, PascalCase, kebab-case, or exact matches.
---
