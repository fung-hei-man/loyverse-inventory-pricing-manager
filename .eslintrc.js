module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/vue3-recommended', '@vue/standard'],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'comma-dangle': ['off'],
    semi: ['warn', 'never'],
    'no-trailing-spaces': [
      'error',
      {
        ignoreComments: true,
        skipBlankLines: true,
      }],
    'space-before-function-paren': ['error', 'never'],
    'padded-blocks': ['off'],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 5
        }
      }
    ],
    'vue/html-quotes': ['error', 'single'],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always'
        }
      }
    ],
    'vue/attribute-hyphenation': ['off'],
    'vue/multi-word-component-names': ['off'],
    'vue/no-reserved-component-names': ['off'],
    'vue/singleline-html-element-content-newline': ['error', {
      ignoreWhenNoAttributes: true,
      ignoreWhenEmpty: true,
      ignores: ['pre', 'textarea', 'p', 'span', 'label', 'a']
    }],
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true
      }
    }
  ]
}
