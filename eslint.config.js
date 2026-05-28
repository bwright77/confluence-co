import tseslint from 'typescript-eslint'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import globals from 'globals'

// Focused on accessibility: jsx-a11y recommended rules over the React app.
// Type-checking stays in `tsc --noEmit` (see the `lint` script).
export default tseslint.config(
  { ignores: ['dist'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [jsxA11y.flatConfigs.recommended],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: globals.browser,
    },
  },
)
