import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['browser'] },
  {
    files: ['**/*.{js}'],        // Corrected file matching pattern
    languageOptions: {
      ecmaVersion: 2020,              // ECMAScript 2020 compatibility
      globals: {
        ...globals.browser,           // Includes browser globals like `window`, `document`, etc.
        ...globals.node,              // This line adds Node.js globals like 'require'
        cordova: 'readonly'           // Include `cordova` as a global to avoid ESLint errors for Cordova API usage
      },
      parserOptions: {
        ecmaVersion: 'latest',       // Use the latest ECMAScript version for flexibility
        ecmaFeatures: { jsx: true }, // JSX support if needed
        sourceType: 'module',        // Modules allow `import`/`export` syntax
      },
    },
    rules: {
      ...js.configs.recommended.rules,  // Include recommended rules for general JS best practices

      // Additional custom rules (if needed) go here
      'no-console': 'warn',  // Example: Warn on `console.log` statements
      'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }]
    },
  },
];
