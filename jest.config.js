/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/*.(spec|test).(js|ts)'],
  transform: {
    '^.*\\.(tsx?|js)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!\\.pnpm/)(?!(@arcgis|@esri|@stencil|@popperjs)/)'
  ],
  moduleFileExtensions: ['json', 'js', 'jsx', 'ts', 'tsx'],
  extensionsToTreatAsEsm: ['.ts'],
  collectCoverageFrom: ['**/*.{js|ts}', '!**/node_modules/**', '!**/vendor/**'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
}
