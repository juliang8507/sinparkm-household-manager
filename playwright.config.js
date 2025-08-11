/**
 * Playwright Configuration for 감자토끼 가계부 Visual Testing
 * Cross-browser configuration with Korean locale support
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Test directory
  testDir: './tests/visual',
  
  // Global test timeout
  timeout: 60 * 1000,
  expect: {
    // Visual comparison threshold
    threshold: 0.1,
    // Screenshot animation handling
    animations: 'disabled',
  },
  
  // Fail the build on CI if tests fail
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Reporter configuration
  reporter: [
    ['html', { 
      outputFolder: 'tests/reports/playwright-report',
      open: process.env.CI ? 'never' : 'on-failure'
    }],
    ['json', { outputFile: 'tests/reports/test-results.json' }],
    ['junit', { outputFile: 'tests/reports/junit.xml' }]
  ],
  
  // Global setup and teardown
  globalSetup: require.resolve('./tests/setup/global-setup.js'),
  globalTeardown: require.resolve('./tests/setup/global-teardown.js'),
  
  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Korean locale settings
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
    
    // Font settings for Korean text
    extraHTTPHeaders: {
      'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8'
    }
  },
  
  // Configure projects for different browsers
  projects: [
    // Desktop Chromium
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1
      },
    },
    
    // Desktop Firefox  
    {
      name: 'firefox-desktop',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1
      },
    },
    
    // Desktop Safari (WebKit)
    {
      name: 'webkit-desktop',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1
      },
    },
    
    // Mobile Chrome
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
        viewport: { width: 393, height: 851 },
        deviceScaleFactor: 3
      },
    },
    
    // Mobile Safari
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'],
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3
      },
    },
    
    // Tablet
    {
      name: 'tablet',
      use: { 
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 1366 },
        deviceScaleFactor: 2
      },
    }
  ],
  
  // Development server configuration
  webServer: process.env.CI ? undefined : {
    command: 'npm start',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI
  },
  
  // Output directory for test results
  outputDir: 'tests/screenshots/current',
  
  // Test result directory
  fullyParallel: true,
  
  // Maximum number of worker processes
  workers: process.env.CI ? 2 : undefined
});