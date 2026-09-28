// ESLint flat config — correctness only, no formatting (docs/architecture.md A10).
// The sim rules turn AGENTS.md's golden rules into build failures: no DOM, no hidden time or
// chance, and no engine-approximated math in src/sim (replays must be bit-exact across engines).
import js from '@eslint/js';
import globals from 'globals';

const detmath = 'use sim/detmath.js — engine-approximated math forks server replays (AGENTS.md rule 1)';

export default [
  { ignores: ['**/node_modules/**', 'src/vendor/**', 'tools/actor-lab/models/**', 'tools/actor-lab/out/**', 'dist/**', 'docs/**'] },
  js.configs.recommended,
  {
    languageOptions: { ecmaVersion: 2024, sourceType: 'module', globals: { ...globals.browser, ...globals.node } },
    rules: {
      'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none', varsIgnorePattern: '^_' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-constant-condition': ['error', { checkLoops: false }],
    },
  },
  {
    files: ['src/sim/**/*.js'],
    languageOptions: { globals: { ...globals.es2021 } },          // no window / document / performance here
    rules: {
      'no-restricted-globals': ['error', { name: 'Date', message: 'no clock in the sim' }, { name: 'performance', message: 'no clock in the sim' },
        { name: 'setTimeout', message: 'no timers in the sim' }, { name: 'setInterval', message: 'no timers in the sim' }],
      'no-restricted-properties': ['error',
        { object: 'Math', property: 'random', message: 'use a seeded stream (rng.js)' },
        ...['sin', 'cos', 'tan', 'atan', 'atan2', 'asin', 'acos', 'exp', 'log', 'pow', 'hypot', 'cbrt', 'sinh', 'cosh', 'tanh', 'expm1', 'log1p', 'log2', 'log10']
          .map((property) => ({ object: 'Math', property, message: detmath }))],
      'no-restricted-syntax': ['error', { selector: "BinaryExpression[operator='**']", message: detmath },
        { selector: "AssignmentExpression[operator='**=']", message: detmath }],
    },
  },
  {
    files: ['src/sim/detmath.js'],                              // the one place allowed to reason about Math internals
    rules: { 'no-restricted-properties': 'off' },
  },
];
