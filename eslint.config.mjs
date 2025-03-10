import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,
  rules: { 'react/no-nested-components': 'off' },
  ignorePatterns: [
    '.vscode/settings.json', // 忽略 dist 文件夹
  ],
})
