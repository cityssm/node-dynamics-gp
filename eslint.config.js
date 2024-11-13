import eslintConfigCityssm, { tseslint } from 'eslint-config-cityssm';
const config = tseslint.config(...eslintConfigCityssm, {
    rules: {
        '@cspell/spellchecker': 'off'
    }
});
export default config;
