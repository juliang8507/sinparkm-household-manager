/**
 * Visual Regression Tests for 감자토끼 가계부
 * Theme-aware screenshot generation and comparison
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs').promises;
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

puppeteer.use(StealthPlugin());

describe('Visual Regression Testing', () => {
  let browser;
  let page;
  
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: process.env.CI ? 'new' : false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--font-family=Kanit,"Malgun Gothic",Dotum,AppleGothic,sans-serif'
      ]
    });
  });
  
  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });
  
  beforeEach(async () => {
    page = await browser.newPage();
    
    // Set Korean fonts and wait for loading
    await page.evaluateOnNewDocument(() => {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    });
  });
  
  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });
  
  const themes = ['light', 'dark', 'hc'];
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'desktop', width: 1280, height: 720 }
  ];
  const pages = [
    { name: 'home', path: '/index.html' },
    { name: 'transaction-form', path: '/transaction-form.html' },
    { name: 'transaction-history', path: '/transaction-history.html' },
    { name: 'meal-planning', path: '/meal-planning.html' }
  ];
  
  /**
   * Compare screenshots and generate diff
   */
  async function compareScreenshots(testName) {
    const baselinePath = path.join(__dirname, '../screenshots/baseline', `${testName}.png`);
    const currentPath = path.join(__dirname, '../screenshots/current', `${testName}.png`);
    const diffPath = path.join(__dirname, '../screenshots/diffs', `${testName}.png`);
    
    try {
      // Check if baseline exists
      await fs.access(baselinePath);
      
      // Read images
      const baselineBuffer = await fs.readFile(baselinePath);
      const currentBuffer = await fs.readFile(currentPath);
      
      const baseline = PNG.sync.read(baselineBuffer);
      const current = PNG.sync.read(currentBuffer);
      
      // Ensure same dimensions
      if (baseline.width !== current.width || baseline.height !== current.height) {
        throw new Error(`Image dimensions don't match: baseline(${baseline.width}x${baseline.height}) vs current(${current.width}x${current.height})`);
      }
      
      const diff = new PNG({ width: baseline.width, height: baseline.height });
      
      const numDiffPixels = pixelmatch(
        baseline.data,
        current.data,
        diff.data,
        baseline.width,
        baseline.height,
        {
          threshold: 0.1,
          includeAA: false
        }
      );
      
      const diffPercentage = (numDiffPixels / (baseline.width * baseline.height)) * 100;
      
      if (diffPercentage > 0.1) {
        // Save diff image
        await fs.writeFile(diffPath, PNG.sync.write(diff));
        throw new Error(`Visual difference detected: ${diffPercentage.toFixed(2)}% (${numDiffPixels} pixels)`);
      }
      
      return { diffPercentage, numDiffPixels };
      
    } catch (error) {
      if (error.code === 'ENOENT') {
        // No baseline exists, copy current as baseline
        await fs.copyFile(currentPath, baselinePath);
        console.log(`📸 Created new baseline: ${testName}.png`);
        return { isNewBaseline: true };
      }
      throw error;
    }
  }
  
  // Generate tests for all combinations
  themes.forEach(theme => {
    viewports.forEach(viewport => {
      pages.forEach(testPage => {
        
        test(`Visual Regression - ${testPage.name} - ${theme} theme - ${viewport.name}`, async () => {
          // Set viewport
          await page.setViewport({
            width: viewport.width,
            height: viewport.height,
            deviceScaleFactor: 1
          });
          
          // Navigate to page
          await page.goto(`${global.TEST_CONFIG.baseURL}${testPage.path}`, {
            waitUntil: 'networkidle0'
          });
          
          // Set theme
          await global.testUtils.setTheme(page, theme);
          
          // Wait for fonts and animations
          await global.testUtils.waitForFonts(page);
          await page.waitForTimeout(1000);
          
          // Hide dynamic content that changes between runs
          await page.evaluate(() => {
            // Hide timestamps, random values, etc.
            const dynamicElements = document.querySelectorAll('[data-testid="timestamp"], .loading-spinner, .animation-element');
            dynamicElements.forEach(el => el.style.visibility = 'hidden');
            
            // Stabilize animations
            document.querySelectorAll('*').forEach(el => {
              el.style.animationDuration = '0s';
              el.style.animationDelay = '0s';
              el.style.transitionDuration = '0s';
              el.style.transitionDelay = '0s';
            });
          });
          
          // Take screenshot
          const testName = `${testPage.name}_${theme}_${viewport.name}`;
          await global.testUtils.takeScreenshot(page, testName, { fullPage: true });
          
          // Compare with baseline
          const result = await compareScreenshots(testName);
          
          if (!result.isNewBaseline && result.diffPercentage > 0.1) {
            throw new Error(`Visual regression detected: ${result.diffPercentage}% difference`);
          }
        });
        
      });
    });
  });
  
  // Test theme transitions
  test('Visual Regression - Theme Transitions', async () => {
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(`${global.TEST_CONFIG.baseURL}/index.html`, { waitUntil: 'networkidle0' });
    
    // Test theme switching animations
    for (const theme of themes) {
      await global.testUtils.setTheme(page, theme);
      
      // Wait for theme transition
      await page.waitForTimeout(500);
      
      // Verify theme is applied correctly
      const appliedTheme = await page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme');
      });
      
      expect(appliedTheme).toBe(theme);
      
      // Take screenshot after theme change
      const testName = `theme_transition_${theme}`;
      await global.testUtils.takeScreenshot(page, testName);
      
      const result = await compareScreenshots(testName);
      if (!result.isNewBaseline && result.diffPercentage > 0.1) {
        throw new Error(`Theme transition regression for ${theme}: ${result.diffPercentage}% difference`);
      }
    }
  });
  
  // Test responsive behavior
  test('Visual Regression - Responsive Layout', async () => {
    const responsiveViewports = [
      { name: 'mobile-portrait', width: 375, height: 667 },
      { name: 'mobile-landscape', width: 667, height: 375 },
      { name: 'tablet-portrait', width: 768, height: 1024 },
      { name: 'tablet-landscape', width: 1024, height: 768 },
      { name: 'desktop', width: 1280, height: 720 },
      { name: 'desktop-large', width: 1920, height: 1080 }
    ];
    
    await page.goto(`${global.TEST_CONFIG.baseURL}/index.html`, { waitUntil: 'networkidle0' });
    await global.testUtils.setTheme(page, 'light');
    
    for (const viewport of responsiveViewports) {
      await page.setViewport({
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1
      });
      
      // Wait for layout reflow
      await page.waitForTimeout(300);
      
      // Hide dynamic elements
      await page.evaluate(() => {
        const dynamicElements = document.querySelectorAll('[data-testid="timestamp"]');
        dynamicElements.forEach(el => el.style.visibility = 'hidden');
      });
      
      const testName = `responsive_${viewport.name}`;
      await global.testUtils.takeScreenshot(page, testName, { fullPage: true });
      
      const result = await compareScreenshots(testName);
      if (!result.isNewBaseline && result.diffPercentage > 0.5) {
        throw new Error(`Responsive regression at ${viewport.name}: ${result.diffPercentage}% difference`);
      }
    }
  });
  
  // Test interactive states
  test('Visual Regression - Interactive States', async () => {
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(`${global.TEST_CONFIG.baseURL}/transaction-form.html`, { waitUntil: 'networkidle0' });
    await global.testUtils.setTheme(page, 'light');
    
    const interactiveTests = [
      {
        name: 'form_empty',
        action: () => page.waitForTimeout(100)
      },
      {
        name: 'form_filled',
        action: async () => {
          await page.type('#amount', '50000');
          await page.type('#description', '월급');
          await page.select('#category', 'income');
        }
      },
      {
        name: 'form_validation',
        action: async () => {
          await page.click('#amount');
          await page.keyboard.press('Tab');
          await page.waitForTimeout(300);
        }
      }
    ];
    
    for (const test of interactiveTests) {
      await test.action();
      await page.waitForTimeout(300);
      
      const testName = `interactive_${test.name}`;
      await global.testUtils.takeScreenshot(page, testName);
      
      const result = await compareScreenshots(testName);
      if (!result.isNewBaseline && result.diffPercentage > 0.1) {
        throw new Error(`Interactive state regression for ${test.name}: ${result.diffPercentage}% difference`);
      }
    }
  });
  
});