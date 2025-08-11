/**
 * Jest Setup Configuration for 감자토끼 가계부
 * Test utilities and global configurations
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { AxePuppeteer } = require('@axe-core/puppeteer');

// Add stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

// Global test configuration
global.TEST_CONFIG = {
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  timeout: 30000,
  
  // Viewport configurations
  viewports: {
    mobile: { width: 375, height: 667, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    tablet: { width: 768, height: 1024, deviceScaleFactor: 2, isMobile: false, hasTouch: true },
    desktop: { width: 1280, height: 720, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
    desktopLarge: { width: 1920, height: 1080, deviceScaleFactor: 1, isMobile: false, hasTouch: false }
  },
  
  // Theme configurations
  themes: {
    light: { name: 'light', dataTheme: 'light', themeColor: '#1FC7D4' },
    dark: { name: 'dark', dataTheme: 'dark', themeColor: '#33E1ED' },
    hc: { name: 'hc', dataTheme: 'hc', themeColor: '#0066CC' }
  },
  
  // Test pages
  pages: {
    home: { path: '/index.html', title: '홈 - 감자토끼 가계부' },
    transactionForm: { path: '/transaction-form.html', title: '거래 등록 - 감자토끼 가계부' },
    transactionHistory: { path: '/transaction-history.html', title: '거래 내역 - 감자토끼 가계부' },
    mealPlanning: { path: '/meal-planning.html', title: '식단 계획 - 감자토끼 가계부' }
  }
};

// Global utilities
global.testUtils = {
  /**
   * Wait for theme to be applied
   */
  waitForTheme: async (page, theme) => {
    await page.waitForFunction(
      (expectedTheme) => {
        const appliedTheme = document.documentElement.getAttribute('data-theme');
        return appliedTheme === expectedTheme;
      },
      {},
      theme
    );
  },
  
  /**
   * Set theme via localStorage and reload
   */
  setTheme: async (page, theme) => {
    await page.evaluate((themeName) => {
      localStorage.setItem('potato-rabbit-theme', themeName);
    }, theme);
    await page.reload({ waitUntil: 'networkidle0' });
    await global.testUtils.waitForTheme(page, theme === 'system' ? 'light' : theme);
  },
  
  /**
   * Wait for Korean fonts to load
   */
  waitForFonts: async (page) => {
    await page.waitForFunction(() => {
      return document.fonts.ready;
    });
    // Additional wait for Korean fonts
    await page.waitForTimeout(1000);
  },
  
  /**
   * Take screenshot with Korean font support
   */
  takeScreenshot: async (page, name, options = {}) => {
    await global.testUtils.waitForFonts(page);
    
    const defaultOptions = {
      fullPage: true,
      type: 'png',
      ...options
    };
    
    return await page.screenshot({
      path: `tests/screenshots/current/${name}.png`,
      ...defaultOptions
    });
  },
  
  /**
   * Run accessibility audit
   */
  runA11yAudit: async (page, context = {}) => {
    const results = await new AxePuppeteer(page).analyze();
    
    return {
      violations: results.violations,
      passes: results.passes,
      incomplete: results.incomplete,
      inapplicable: results.inapplicable,
      context
    };
  },
  
  /**
   * Test keyboard navigation
   */
  testKeyboardNavigation: async (page, steps) => {
    const results = [];
    
    for (const step of steps) {
      await page.keyboard.press(step.key);
      await page.waitForTimeout(100);
      
      const focusedElement = await page.evaluate(() => {
        const focused = document.activeElement;
        return {
          tagName: focused.tagName,
          className: focused.className,
          id: focused.id,
          ariaLabel: focused.getAttribute('aria-label'),
          text: focused.textContent?.trim().substring(0, 50)
        };
      });
      
      results.push({
        step: step.step,
        key: step.key,
        expectedFocus: step.expectedFocus,
        actualFocus: focusedElement,
        passed: step.validate ? step.validate(focusedElement) : true
      });
    }
    
    return results;
  }
};

// Extend Jest matchers
expect.extend({
  toBeAccessible(received) {
    const pass = received.violations.length === 0;
    
    if (pass) {
      return {
        message: () => `expected page to have accessibility violations, but found none`,
        pass: true
      };
    } else {
      const violationMessages = received.violations.map(
        violation => `${violation.id}: ${violation.description} (${violation.nodes.length} elements)`
      ).join('\n');
      
      return {
        message: () => `expected page to be accessible, but found violations:\n${violationMessages}`,
        pass: false
      };
    }
  },
  
  toHaveContrastRatio(received, expected) {
    const pass = received >= expected;
    
    return {
      message: () => 
        pass 
          ? `expected contrast ratio ${received} not to be at least ${expected}`
          : `expected contrast ratio ${received} to be at least ${expected}`,
      pass
    };
  }
});

// Increase timeout for Puppeteer operations
jest.setTimeout(60000);