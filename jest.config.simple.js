/**
 * Simple Jest Configuration for 감자토끼 가계부 E2E Tests
 */

module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  testTimeout: 30000,
  verbose: true,
  transform: {},
  moduleFileExtensions: ['js', 'json'],
  reporters: ['default']
};