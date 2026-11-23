# Laravel Attribute Mapper documentation

[繁體中文](README.zh-TW.md)

Read the [getting-started guide](docs/guide/getting-started.md) or the [API reference](docs/guide/api-reference.md) for the `mattmy/laravel-attribute-mapper` package. The [package repository](https://github.com/mattmy/laravel-attribute-mapper) contains the source.

## Local development

Use Node.js 24 or later.

```sh
npm ci
npm run docs:dev
```

## Production build

```sh
npm run docs:build
npm run docs:preview
```

GitHub Pages builds use the site URL supplied by GitHub to set the URL prefix and generate a sitemap. Set `DOCS_URL` to the full site URL to reproduce that layout locally. The build output is in `docs/.vitepress/dist`.
