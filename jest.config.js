/**
 * Jest Configuration for 감자토끼 가계부
 * Comprehensive testing setup with Puppeteer, accessibility, and visual regression
 */

module.exports = {
  // Environment
  testEnvironment: 'node',
  
  // Test directories
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.spec.js'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.js'],
  
  // Global setup and teardown
  globalSetup: '<rootDir>/tests/setup/global-setup.js',
  globalTeardown: '<rootDir>/tests/setup/global-teardown.js',
  
  // Coverage configuration
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/**/*.min.js',
    '!node_modules/**',
    '!tests/**'
  ],
  
  coverageDirectory: 'coverage',
  
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary'
  ],
  
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Test timeout (increased for visual tests)
  testTimeout: 30000,
  
  // Verbose output
  verbose: true,
  
  // Transform configuration
  transform: {},
  
  // Module file extensions
  moduleFileExtensions: ['js', 'json', 'html', 'css'],
  
  // Test projects for different test types
  projects: [
    {
      displayName: 'visual-regression',
      testMatch: ['<rootDir>/tests/visual/**/*.test.js'],
      testEnvironment: 'node'
    },
    {
      displayName: 'accessibility',
      testMatch: ['<rootDir>/tests/accessibility/**/*.test.js'],
      testEnvironment: 'node'
    },
    {
      displayName: 'keyboard-navigation',
      testMatch: ['<rootDir>/tests/keyboard/**/*.test.js'],
      testEnvironment: 'node'
    },
    {
      displayName: 'theme-testing',
      testMatch: ['<rootDir>/tests/themes/**/*.test.js'],
      testEnvironment: 'node'
    },
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit/**/*.test.js'],
      testEnvironment: 'jsdom'
    }
  ],
  
  // Reporter configuration
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicDir: './coverage',
        filename: 'test-report.html',
        expand: true,
        hideIcon: false
      }
    ]
  ]
};