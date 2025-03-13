import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,
  rules: {
    'react/no-nested-components': 'off',
    'node/prefer-global/process': 'off',
    'unused-imports/no-unused-vars': 'off',
  },
})
