# Laravel Attribute Mapper 文件

[English](README.md)

從[開始使用](docs/zh-TW/guide/getting-started.md)或 [API 參考](docs/zh-TW/guide/api-reference.md)查詢 `mattmy/laravel-attribute-mapper` 的用法。原始碼位於[套件儲存庫](https://github.com/mattmy/laravel-attribute-mapper)。

## 本機開發

請使用 Node.js 24 以上版本。

```sh
npm ci
npm run docs:dev
```

## 正式建置

```sh
npm run docs:build
npm run docs:preview
```

GitHub Pages 建置會使用 GitHub 提供的網站網址設定路徑前綴並產生網站地圖。在本機可把完整網站網址設為 `DOCS_URL`，重現相同的路徑配置。建置結果位於 `docs/.vitepress/dist`。
