---
layout: home
hero:
  name: Laravel Attribute Mapper
  text: 快速將 Request 資料帶入 Eloquent Model
  tagline: 依命名規則把請求欄位對應到可填屬性，減少建立與更新資料時逐欄手寫對照。
  actions:
    - theme: brand
      text: 開始使用
      link: /zh-TW/guide/getting-started
    - theme: alt
      text: API 參考
      link: /zh-TW/guide/api-reference
features:
  - title: 個別欄位可以設別名
    details: 如果請求欄位叫 expiresAt，Model 欄位叫 end_time，設個別名就能對上。
  - title: 只更新有傳的欄位
    details: 沒傳的欄位會保留原值。欄位允許空值時，傳入 null 就能清空。
  - title: 請求欄位用你習慣的命名
    details: 習慣用小駝峰（camelCase）？選這個風格，就能把請求主體的 endTime 對應到 end_time。也支援底線、大駝峰、連字號和同名比對。
---
