module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsConfig: 'tsconfig.test.json',
    }
  },
  testMatch: [
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testPathIgnorePatterns: [],
  coveragePathIgnorePatterns: [
    '/__tests__/',
    '/bin/'
  ],
  collectCoverageFrom: [
    'src/**/*.ts'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}
