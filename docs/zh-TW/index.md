---
layout: home
hero:
  name: Laravel Attribute Mapper
  text: 快速將 Request 資料帶入 Eloquent Model
  tagline: 把驗證過的欄位轉成可填屬性陣列，用來新增或更新資料。
  actions:
    - theme: brand
      text: 開始使用
      link: /zh-TW/guide/getting-started
    - theme: alt
      text: API 參考
      link: /zh-TW/guide/api-reference
features:
  - title: 依命名規則對應欄位
    details: 可直接比對同名欄位，也支援小駝峰、底線、大駝峰與連字號命名。
  - title: 為個別欄位設定別名
    details: 可指定某個 Model 屬性要從哪個請求欄位取值。
  - title: 只更新有傳的欄位
    details: 省略欄位會保留原值。欄位允許 null 時，傳入 null 就能清空。
---
