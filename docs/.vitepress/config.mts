import { defineConfig } from 'vitepress'

const repositoryUrl = 'https://github.com/mattmy/laravel-attribute-mapper'
const docsUrl = process.env.DOCS_URL
const base = docsUrl ? new URL(docsUrl).pathname.replace(/\/?$/, '/') : '/'

const pages = [
  { slug: 'getting-started', en: 'Getting started', zh: '開始使用' },
  { slug: 'mapping-input', en: 'Mapping input', zh: '映射輸入' },
  { slug: 'building-output', en: 'Building the output', zh: '產生輸出' },
  { slug: 'configuration-and-errors', en: 'Configuration and errors', zh: '設定與錯誤處理' },
  { slug: 'performance-and-safety', en: 'Performance and safety', zh: '效能與安全' },
  { slug: 'api-reference', en: 'API reference', zh: 'API 參考' },
]

export default defineConfig({
  title: 'Laravel Attribute Mapper',
  description: 'Map Laravel input to fillable Eloquent attributes',
  base,
  cleanUrls: true,
  lastUpdated: true,
  ...(docsUrl ? { sitemap: { hostname: docsUrl } } : {}),
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Documentation', link: '/guide/getting-started' },
        ],
        sidebar: {
          '/guide/': [
            { text: 'Documentation', items: pages.map(({ en, slug }) => ({ text: en, link: `/guide/${slug}` })) },
          ],
        },
        outline: { level: [2, 3], label: 'On this page' },
      },
    },
    'zh-TW': {
      label: '繁體中文',
      lang: 'zh-TW',
      link: '/zh-TW/',
      description: '將 Laravel 輸入對應到 Eloquent 的可填屬性',
      themeConfig: {
        nav: [
          { text: '首頁', link: '/zh-TW/' },
          { text: '文件', link: '/zh-TW/guide/getting-started' },
        ],
        sidebar: {
          '/zh-TW/guide/': [
            { text: '文件', items: pages.map(({ zh, slug }) => ({ text: zh, link: `/zh-TW/guide/${slug}` })) },
          ],
        },
        outline: { level: [2, 3], label: '本頁內容' },
        lastUpdated: { text: '最後更新' },
      },
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: repositoryUrl }],
  },
})
