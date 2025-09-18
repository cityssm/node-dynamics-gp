import eslintConfigCityssm, { defineConfig } from 'eslint-config-cityssm'

const config = defineConfig(eslintConfigCityssm, {
  files: ['**/*.ts'],
  rules: {
    '@cspell/spellchecker': 'off'
  }
})

export default config
