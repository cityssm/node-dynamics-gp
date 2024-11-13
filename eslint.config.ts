import eslintConfigCityssm, {
  type Config,
  tseslint
} from 'eslint-config-cityssm'

const config = tseslint.config(...eslintConfigCityssm, {
  rules: {
    '@cspell/spellchecker': 'off'
  }
}) as Config

export default config
