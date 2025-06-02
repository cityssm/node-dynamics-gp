import eslintConfigCityssm, {
  type Config,
  tseslint
} from 'eslint-config-cityssm'

const config = tseslint.config(eslintConfigCityssm, {
  files: ['**/*.ts'],
  rules: {
    '@cspell/spellchecker': 'off'
  }
}) as Config

export default config
