module.exports = {
  // Point to apps/debug for now since it has the only jest.config.js
  projects: [
    '<rootDir>/apps/debug',
  ],
  
  // Future: Enable automatic discovery when packages have jest configs
  // projects: [
  //   '<rootDir>/apps/*/jest.config.js',
  //   '<rootDir>/packages/*/jest.config.js',
  // ],
  
  // Global settings that apply to all projects unless overridden
  coverageDirectory: '<rootDir>/coverage',
  // collectCoverageFrom: [
  //   '**/*.{ts,tsx}',
  //   '!**/*.d.ts',
  //   '!**/node_modules/**',
  //   '!**/.next/**',
  //   '!**/dist/**',
  //   '!**/coverage/**',
  // ],
};