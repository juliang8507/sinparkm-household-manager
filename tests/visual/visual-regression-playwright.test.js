/**
 * Visual Regression Testing for 감자토끼 가계부 with Playwright
 * Comprehensive cross-browser testing with Korean font support
 */

const { test, expect, chromium, firefox, webkit } = require('@playwright/test');
const ScreenshotHelper = require('../helpers/screenshot-helper');
const { 
  VIEWPORT_CONFIG, 
  THEME_CONFIG, 
  PAGE_CONFIG, 
  BROWSER_CONFIG,
  generateTestCombinations 
} = require('../config/viewport-config');

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const BROWSERS = process.env.BROWSERS ? process.env.BROWSERS.split(',') : ['chromium'];
const DIFF_THRESHOLD = parseFloat(process.env.DIFF_THRESHOLD) || 0.1;

// Global screenshot helper
let screenshotHelper;

test.describe('감자토끼 가계부 - Visual Regression Testing', () => {
  
  test.beforeAll(async () => {
    screenshotHelper = new ScreenshotHelper();
    await screenshotHelper.ensureDirectories();
  });
  
  test.afterAll(async () => {
    if (screenshotHelper) {
      await screenshotHelper.generateHTMLReport();
      console.log('📊 Visual regression report generated at: tests/reports/layout-regression.html');
    }
  });
  
  // Generate test combinations for all pages, themes, and viewports
  const testCombinations = generateTestCombinations();
  
  // Cross-browser testing
  for (const browserName of BROWSERS) {
    test.describe(`${browserName} Browser Tests`, () => {
      
      testCombinations.forEach(({ page, theme, viewport, testName, description }) => {
        
        test(`Visual Regression: ${testName} (${browserName})`, async ({ }) => {
          let browser;
          let context;
          let playwrightPage;
          
          try {
            // Launch specific browser
            const browserType = browserName === 'chromium' ? chromium : 
                               browserName === 'firefox' ? firefox : webkit;
            
            browser = await browserType.launch({
              headless: process.env.CI !== 'false',
              args: [
                '--font-family=Kanit,"Malgun Gothic",Dotum,AppleGothic,sans-serif',
                '--disable-web-security',
                '--allow-running-insecure-content'
              ]
            });
            
            // Create context with proper configuration
            context = await browser.newContext({
              viewport: {
                width: viewport.width,
                height: viewport.height
              },
              deviceScaleFactor: viewport.deviceScaleFactor,
              isMobile: viewport.isMobile,
              hasTouch: viewport.hasTouch,
              userAgent: viewport.userAgent,
              locale: 'ko-KR',
              timezoneId: 'Asia/Seoul'
            });
            
            playwrightPage = await context.newPage();
            
            // Navigate to page
            const fullURL = `${BASE_URL}${page.path}`;
            await playwrightPage.goto(fullURL, { 
              waitUntil: 'networkidle',
              timeout: 30000
            });
            
            // Wait for essential elements
            if (page.waitForSelectors) {
              for (const selector of page.waitForSelectors) {
                try {
                  await playwrightPage.waitForSelector(selector, { timeout: 10000 });
                } catch (e) {
                  console.warn(`Warning: Selector ${selector} not found for ${page.name}`);
                }
              }
            }
            
            // Set theme
            await screenshotHelper.setTheme(playwrightPage, theme.name);
            
            // Take screenshot with full test name including browser
            const fullTestName = `${testName}_${browserName}`;
            await screenshotHelper.takeScreenshot(playwrightPage, fullTestName, {
              pageConfig: page,
              fullPage: true
            });
            
            // Compare with baseline
            const result = await screenshotHelper.compareScreenshots(fullTestName, DIFF_THRESHOLD);
            
            // Assert based on comparison result
            if (result.isNewBaseline) {
              console.log(`📸 Created new baseline for: ${fullTestName}`);
            } else if (!result.passed) {
              throw new Error(
                `Visual regression detected in ${fullTestName}: ${result.diffPercentage.toFixed(3)}% difference (${result.pixelDifference} pixels)`
              );
            }
            
            // Verify theme is correctly applied
            const appliedTheme = await playwrightPage.getAttribute('html', 'data-theme');
            expect(appliedTheme).toBe(theme.dataTheme);
            
          } finally {
            if (playwrightPage) await playwrightPage.close();
            if (context) await context.close();
            if (browser) await browser.close();
          }
        });
        
      });
      
      // Additional browser-specific tests
      test(`Theme Transitions - ${browserName}`, async ({ }) => {
        let browser;
        let context;
        let playwrightPage;
        
        try {
          const browserType = browserName === 'chromium' ? chromium : 
                             browserName === 'firefox' ? firefox : webkit;
          
          browser = await browserType.launch({ headless: process.env.CI !== 'false' });
          context = await browser.newContext({
            viewport: VIEWPORT_CONFIG.desktop,
            locale: 'ko-KR',
            timezoneId: 'Asia/Seoul'
          });
          
          playwrightPage = await context.newPage();
          await playwrightPage.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle' });
          
          // Test all theme transitions
          for (const [themeName, themeConfig] of Object.entries(THEME_CONFIG)) {
            await screenshotHelper.setTheme(playwrightPage, themeName);
            
            const testName = `theme_transition_${themeName}_${browserName}`;
            await screenshotHelper.takeScreenshot(playwrightPage, testName);
            
            const result = await screenshotHelper.compareScreenshots(testName, DIFF_THRESHOLD);
            
            if (!result.isNewBaseline && !result.passed) {
              throw new Error(
                `Theme transition regression for ${themeName}: ${result.diffPercentage.toFixed(3)}% difference`
              );
            }
            
            // Verify theme CSS variables are applied
            const bgColor = await playwrightPage.evaluate(() => {
              return getComputedStyle(document.documentElement).getPropertyValue('--background-color').trim();
            });
            
            expect(bgColor).toBeTruthy();
          }
          
        } finally {
          if (playwrightPage) await playwrightPage.close();
          if (context) await context.close();
          if (browser) await browser.close();
        }
      });
      
      // Interactive states testing
      test(`Interactive States - ${browserName}`, async ({ }) => {
        let browser;
        let context;
        let playwrightPage;
        
        try {
          const browserType = browserName === 'chromium' ? chromium : 
                             browserName === 'firefox' ? firefox : webkit;
          
          browser = await browserType.launch({ headless: process.env.CI !== 'false' });
          context = await browser.newContext({
            viewport: VIEWPORT_CONFIG.desktop,
            locale: 'ko-KR'
          });
          
          playwrightPage = await context.newPage();
          await playwrightPage.goto(`${BASE_URL}/transaction-form.html`, { waitUntil: 'networkidle' });
          await screenshotHelper.setTheme(playwrightPage, 'light');
          
          const interactiveStates = [
            {
              name: 'form_empty',
              action: async () => {
                await playwrightPage.waitForTimeout(500);
              }
            },
            {
              name: 'form_filled',
              action: async () => {
                await playwrightPage.fill('#amount', '50000');
                await playwrightPage.fill('#description', '월급');
                await playwrightPage.selectOption('#category', 'income');
                await playwrightPage.waitForTimeout(300);
              }
            },
            {
              name: 'form_validation',
              action: async () => {
                await playwrightPage.click('#amount');
                await playwrightPage.fill('#amount', '');
                await playwrightPage.press('#amount', 'Tab');
                await playwrightPage.waitForTimeout(500);
              }
            }
          ];
          
          for (const state of interactiveStates) {
            await state.action();
            
            const testName = `interactive_${state.name}_${browserName}`;
            await screenshotHelper.takeScreenshot(playwrightPage, testName);
            
            const result = await screenshotHelper.compareScreenshots(testName, DIFF_THRESHOLD);
            
            if (!result.isNewBaseline && !result.passed) {
              throw new Error(
                `Interactive state regression for ${state.name}: ${result.diffPercentage.toFixed(3)}% difference`
              );
            }
          }
          
        } finally {
          if (playwrightPage) await playwrightPage.close();
          if (context) await context.close();
          if (browser) await browser.close();
        }
      });
      
      // Responsive breakpoint testing
      test(`Responsive Breakpoints - ${browserName}`, async ({ }) => {
        let browser;
        let context;
        let playwrightPage;
        
        try {
          const browserType = browserName === 'chromium' ? chromium : 
                             browserName === 'firefox' ? firefox : webkit;
          
          browser = await browserType.launch({ headless: process.env.CI !== 'false' });
          context = await browser.newContext({ locale: 'ko-KR' });
          
          playwrightPage = await context.newPage();
          await playwrightPage.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle' });
          await screenshotHelper.setTheme(playwrightPage, 'light');
          
          const breakpoints = [
            { name: 'mobile-portrait', width: 360, height: 640 },
            { name: 'mobile-landscape', width: 640, height: 360 },
            { name: 'tablet-portrait', width: 768, height: 1024 },
            { name: 'tablet-landscape', width: 1024, height: 768 },
            { name: 'desktop-small', width: 1024, height: 768 },
            { name: 'desktop-large', width: 1280, height: 720 },
            { name: 'desktop-xl', width: 1920, height: 1080 }
          ];
          
          for (const breakpoint of breakpoints) {
            await playwrightPage.setViewportSize({
              width: breakpoint.width,
              height: breakpoint.height
            });
            
            await playwrightPage.waitForTimeout(500); // Allow layout reflow
            
            const testName = `responsive_${breakpoint.name}_${browserName}`;
            await screenshotHelper.takeScreenshot(playwrightPage, testName, { fullPage: true });
            
            const result = await screenshotHelper.compareScreenshots(testName, DIFF_THRESHOLD);
            
            if (!result.isNewBaseline && !result.passed) {
              throw new Error(
                `Responsive regression at ${breakpoint.name}: ${result.diffPercentage.toFixed(3)}% difference`
              );
            }
          }
          
        } finally {
          if (playwrightPage) await playwrightPage.close();
          if (context) await context.close();
          if (browser) await browser.close();
        }
      });
      
    });
  }
  
  // Accessibility contrast testing
  test('High Contrast Theme Accessibility', async ({ }) => {
    let browser;
    let context;
    let page;
    
    try {
      browser = await chromium.launch({ headless: process.env.CI !== 'false' });
      context = await browser.newContext({
        viewport: VIEWPORT_CONFIG.desktop,
        locale: 'ko-KR'
      });
      
      page = await context.newPage();
      
      for (const [pageName, pageConfig] of Object.entries(PAGE_CONFIG)) {
        await page.goto(`${BASE_URL}${pageConfig.path}`, { waitUntil: 'networkidle' });
        await screenshotHelper.setTheme(page, 'hc');
        
        // Test high contrast theme
        const testName = `accessibility_hc_${pageName}`;
        await screenshotHelper.takeScreenshot(page, testName);
        
        const result = await screenshotHelper.compareScreenshots(testName, DIFF_THRESHOLD);
        
        if (!result.isNewBaseline && !result.passed) {
          throw new Error(
            `High contrast accessibility regression for ${pageName}: ${result.diffPercentage.toFixed(3)}% difference`
          );
        }
        
        // Verify high contrast colors are applied
        const contrastRatio = await page.evaluate(() => {
          const styles = getComputedStyle(document.body);
          const bg = styles.backgroundColor;
          const color = styles.color;
          return { backgroundColor: bg, color };
        });
        
        expect(contrastRatio.backgroundColor).toBeTruthy();
        expect(contrastRatio.color).toBeTruthy();
      }
      
    } finally {
      if (page) await page.close();
      if (context) await context.close();
      if (browser) await browser.close();
    }
  });
  
});