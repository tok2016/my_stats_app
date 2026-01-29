const config = {
  singleQuote: true,
  jsxSingleQuote: true,
  semi: true,
  useTabs: false,
  tabWidth: 2,
  trailingComma: 'none',
  endOfLine: 'auto',
  experimentalOperatorPosition: 'start',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^next/(.*)$',
    '^@ts/(.*)$',
    '^@lib/(.*)$',
    '^@api/(.*)$',
    '^@store/(.*)$',
    '^@components/(.*)$',
    '^@app/(.*)$',
    '^@public/(.*)$',
    '^@styles/(.*)$',
    '^[./]'
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
};

export default config;
