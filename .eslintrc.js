module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: [
      'eslint:recommended', // Base set of rules recommended by ESLint
      'plugin:prettier/recommended', // Integrates ESLint with Prettier for code formatting
    ],
    parserOptions: {
      ecmaVersion: 12, // Allows for the parsing of modern ECMAScript features
      sourceType: 'module', // Allows for the use of imports
    },
    rules: {
      'no-unused-vars': 'warn', // Warns about variables that are declared but not used
      'no-console': 'off', // Allows the use of console statements
      'eqeqeq': ['error', 'always'], // Enforces the use of === and !== over == and !=
      'curly': 'error', // Requires the use of curly braces for all control statements
      'no-var': 'error', // Requires let or const instead of var
      'prefer-const': 'error', // Suggests using const for variables that are never reassigned
      'arrow-body-style': ['error', 'as-needed'], // Requires braces around arrow function bodies when necessary
      'no-implicit-coercion': 'error', // Disallows shorthand type conversions
      'no-return-await': 'error', // Disallows unnecessary return await
      'no-trailing-spaces': 'error', // Disallows trailing whitespace at the end of lines
      'eol-last': ['error', 'always'], // Ensures files end with a newline
    },
  };
  