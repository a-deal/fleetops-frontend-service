module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/**/__tests__/unit/**/*.test.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
      },
      transform: {
        '^.+\\.tsx?$': ['ts-jest', {
          tsconfig: '<rootDir>/tsconfig.test.json'
        }]
      }
    },
    {
      displayName: 'performance',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/**/__tests__/performance/**/*.test.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
      },
      transform: {
        '^.+\\.tsx?$': ['ts-jest', {
          tsconfig: '<rootDir>/tsconfig.test.json',
          isolatedModules: true // Faster for perf tests
        }]
      }
    }
  ],
  collectCoverageFrom: [
    'lib/telemetry/**/*.ts',
    '!lib/telemetry/**/*.d.ts',
    '!lib/telemetry/**/__tests__/**'
  ]
};