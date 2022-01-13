const pkg = require('../../package')

module.exports = {
  head: [
    ['link', {
      rel: 'icon',
      href: ''
    }],
    ['meta', { name: 'theme-color', content: '#E24C32' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
    ['meta', {
      name: 'viewport',
      content: 'width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no'
    }],
  ],
  title: pkg.name,
  description: pkg.description,
  dest: 'dist',
  themeConfig: {
    repo: 'https://github.com/ulivz/copy',
    // defaults to false, set to true to enable
    editLinks: true,
    // custom text for edit link. Defaults to "Edit this page"
    editLinkText: '帮助我们改进文档!',
    // if your docs are not at the root of the repo:
    docsDir: 'docs',
    sidebarDepth: 3,
  },
  markdown: {
    extractHeaders: ['h2', 'h3', 'h4']
  },
  plugins: [
    ['@vuepress/plugin-medium-zoom', {
      selector: '.theme-default-content img'
    }],
    ['@vuepress/plugin-search', {
      searchMaxSuggestions: 10
    }],
    ['container', {
      type: 'upgrade',
      before: info => `<UpgradePath title="${info}">`,
      after: '</UpgradePath>',
    }],
    ['container', {
      type: 'tree',
      before: '<pre class="tree-container"><code>',
      after: '</code></pre>',
    }],
  ],
  define: {
    DOCS_VERSION: pkg.docsVersion
  }
}
