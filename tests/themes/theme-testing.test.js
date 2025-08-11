/**
 * Theme Testing Suite for 감자토끼 가계부
 * Light/Dark/High Contrast theme validation across multiple viewports
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs').promises;
const path = require('path');

puppeteer.use(StealthPlugin());

describe('Theme Testing - Multi-Theme Validation', () => {
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
  });
  
  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });
  
  const themes = {
    light: {
      name: 'Light',
      value: 'light',
      expectedColors: {
        background: '#FAF9FA',
        text: '#280D5F',
        primary: '#1FC7D4'
      },
      contrastRequirement: 4.5 // WCAG AA
    },
    dark: {
      name: 'Dark',
      value: 'dark',
      expectedColors: {
        background: '#0E0E0E',
        text: '#FFFFFF',
        primary: '#33E1ED'
      },
      contrastRequirement: 4.5 // WCAG AA
    },
    hc: {
      name: 'High Contrast',
      value: 'hc',
      expectedColors: {
        background: '#FFFFFF',
        text: '#000000',
        primary: '#0066CC'
      },
      contrastRequirement: 7.0 // WCAG AAA
    }
  };
  
  const viewports = [
    { name: 'mobile', width: 375, height: 667, deviceScaleFactor: 2 },
    { name: 'tablet', width: 768, height: 1024, deviceScaleFactor: 2 },
    { name: 'desktop', width: 1280, height: 720, deviceScaleFactor: 1 },
    { name: 'desktop-large', width: 1920, height: 1080, deviceScaleFactor: 1 }
  ];
  
  const testPages = [
    { name: 'home', path: '/index.html' },
    { name: 'transaction-form', path: '/transaction-form.html' },
    { name: 'transaction-history', path: '/transaction-history.html' },
    { name: 'meal-planning', path: '/meal-planning.html' }
  ];
  
  /**
   * Get computed color values from CSS custom properties
   */
  async function getThemeColors() {
    return await page.evaluate(() => {
      const rootStyles = getComputedStyle(document.documentElement);
      
      const getColor = (property) => {
        const value = rootStyles.getPropertyValue(property).trim();
        return value || null;
      };
      
      return {
        // Background colors
        backgroundDefault: getColor('--color-background-default'),
        backgroundPaper: getColor('--color-background-paper'),
        backgroundAlternative: getColor('--color-background-alternative'),
        
        // Text colors
        textPrimary: getColor('--color-text-primary'),
        textSecondary: getColor('--color-text-secondary'),
        textDisabled: getColor('--color-text-disabled'),
        
        // Brand colors
        primary: getColor('--color-primary'),
        primaryLight: getColor('--color-primary-light'),
        primaryDark: getColor('--color-primary-dark'),
        
        // Semantic colors
        success: getColor('--color-success'),
        warning: getColor('--color-warning'),
        error: getColor('--color-error'),
        
        // Applied theme
        appliedTheme: document.documentElement.getAttribute('data-theme'),
        
        // Meta theme color
        metaThemeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute('content')
      };
    });
  }
  
  /**
   * Calculate color contrast ratio (simplified)
   */
  function calculateContrastRatio(color1, color2) {
    // This is a simplified calculation - in production, use a proper color library
    // For testing purposes, we'll return a mock calculation
    // A proper implementation would use chroma.js or similar
    
    const parseColor = (color) => {
      // Handle hex colors
      if (color.startsWith('#')) {
        const hex = color.slice(1);
        return {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16)
        };
      }
      
      // Handle rgb colors
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        return {
          r: parseInt(match[1]),
          g: parseInt(match[2]),
          b: parseInt(match[3])
        };
      }
      
      return { r: 128, g: 128, b: 128 }; // Default gray
    };
    
    const getLuminance = (color) => {
      const { r, g, b } = parseColor(color);
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }
  
  /**
   * Save theme test report
   */
  async function saveThemeReport(results, testName) {
    const reportPath = path.join(__dirname, '../reports', `theme_${testName}.json`);
    
    const report = {
      timestamp: new Date().toISOString(),
      testName,
      results,
      summary: {
        totalTests: results.length,
        passed: results.filter(r => r.passed).length,
        failed: results.filter(r => !r.passed).length,
        themes: Object.keys(themes),
        viewports: viewports.map(v => v.name)
      }
    };
    
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    return report;
  }
  
  // Test theme switching functionality
  Object.values(themes).forEach(theme => {
    test(`Theme Testing - ${theme.name} Theme Application`, async () => {
      await page.setViewport({ width: 1280, height: 720 });
      await page.goto(`${global.TEST_CONFIG.baseURL}/index.html`, { waitUntil: 'networkidle0' });
      
      // Apply theme
      await global.testUtils.setTheme(page, theme.value);
      await page.waitForTimeout(1000);
      
      // Get theme colors
      const colors = await getThemeColors();
      
      // Verify theme is applied correctly
      expect(colors.appliedTheme).toBe(theme.value);
      expect(colors.backgroundDefault).toBeTruthy();
      expect(colors.textPrimary).toBeTruthy();
      expect(colors.primary).toBeTruthy();
      
      // Verify meta theme color is updated
      expect(colors.metaThemeColor).toBeTruthy();
      
      // Check if colors are different from other themes
      if (theme.value === 'light') {
        expect(colors.backgroundDefault).not.toBe('#0E0E0E'); // Not dark theme
      } else if (theme.value === 'dark') {
        expect(colors.backgroundDefault).not.toBe('#FAF9FA'); // Not light theme
      }
      
      console.log(`✅ ${theme.name} theme applied successfully:`, {
        background: colors.backgroundDefault,
        text: colors.textPrimary,
        primary: colors.primary,
        metaColor: colors.metaThemeColor
      });
    });
  });
  
  // Test theme persistence
  test('Theme Testing - Theme Persistence', async () => {
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(`${global.TEST_CONFIG.baseURL}/index.html`, { waitUntil: 'networkidle0' });
    
    // Set dark theme
    await global.testUtils.setTheme(page, 'dark');
    await page.waitForTimeout(500);
    
    // Verify dark theme is applied
    let colors = await getThemeColors();
    expect(colors.appliedTheme).toBe('dark');
    
    // Reload page
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForTimeout(1000);
    
    // Verify theme persisted
    colors = await getThemeColors();
    expect(colors.appliedTheme).toBe('dark');
    
    // Check localStorage
    const storedTheme = await page.evaluate(() => localStorage.getItem('potato-rabbit-theme'));
    expect(storedTheme).toBe('dark');
  });
  
  // Test theme transitions
  test('Theme Testing - Theme Transition Smoothness', async () => {
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(`${global.TEST_CONFIG.baseURL}/index.html`, { waitUntil: 'networkidle0' });
    
    const transitionTests = [];
    
    for (const fromTheme of Object.values(themes)) {
      for (const toTheme of Object.values(themes)) {
        if (fromTheme.value === toTheme.value) continue;
        
        // Set initial theme
        await global.testUtils.setTheme(page, fromTheme.value);
        await page.waitForTimeout(500);
        
        // Verify initial theme
        const initialColors = await getThemeColors();
        
        // Switch to target theme
        await global.testUtils.setTheme(page, toTheme.value);
        await page.waitForTimeout(800); // Allow for transition animation
        
        // Verify final theme
        const finalColors = await getThemeColors();
        
        const transitionResult = {
          from: fromTheme.name,
          to: toTheme.name,
          initialTheme: initialColors.appliedTheme,
          finalTheme: finalColors.appliedTheme,
          passed: finalColors.appliedTheme === toTheme.value,
          colorsChanged: initialColors.backgroundDefault !== finalColors.backgroundDefault
        };
        
        transitionTests.push(transitionResult);
        
        expect(finalColors.appliedTheme).toBe(toTheme.value);
        expect(initialColors.backgroundDefault).not.toBe(finalColors.backgroundDefault);
      }
    }
    
    await saveThemeReport(transitionTests, 'theme_transitions');
    
    const failures = transitionTests.filter(t => !t.passed);
    expect(failures.length).toBe(0);
  });
  
  // Test responsive theme behavior
  viewports.forEach(viewport => {
    Object.values(themes).forEach(theme => {
      test(`Theme Testing - ${theme.name} Theme on ${viewport.name}`, async () => {
        await page.setViewport({
          width: viewport.width,
          height: viewport.height,
          deviceScaleFactor: viewport.deviceScaleFactor
        });
        
        await page.goto(`${global.TEST_CONFIG.baseURL}/index.html`, { waitUntil: 'networkidle0' });
        await global.testUtils.setTheme(page, theme.value);
        await page.waitForTimeout(1000);
        
        // Get theme colors
        const colors = await getThemeColors();
        
        // Verify theme is applied consistently across viewports
        expect(colors.appliedTheme).toBe(theme.value);
        expect(colors.backgroundDefault).toBeTruthy();
        expect(colors.textPrimary).toBeTruthy();
        
        // Check if responsive layout adjustments maintain theme integrity
        const hasResponsiveIssues = await page.evaluate(() => {
          // Check for elements with no background or transparent text
          const elements = document.querySelectorAll('*');
          let issueCount = 0;
          
          for (const el of elements) {
            const styles = getComputedStyle(el);
            if (styles.color === 'transparent' || styles.backgroundColor === 'transparent') {
              issueCount++;
            }
          }
          
          return issueCount > 10; // Allow some transparent elements
        });
        
        expect(hasResponsiveIssues).toBe(false);
        
        // Take screenshot for visual verification
        const screenshotName = `theme_${theme.value}_${viewport.name}`;
        await global.testUtils.takeScreenshot(page, screenshotName);
      });
    });
  });
  
  // Test system theme detection
  test('Theme Testing - System Theme Detection', async () => {
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(`${global.TEST_CONFIG.baseURL}/index.html`, { waitUntil: 'networkidle0' });
    
    // Test system theme preference
    await page.evaluate(() => {
      localStorage.setItem('potato-rabbit-theme', 'system');
    });
    
    // Simulate dark system preference
    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: 'dark' }
    ]);
    
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForTimeout(1000);
    
    const colors = await getThemeColors();
    
    // Should apply dark theme when system prefers dark
    expect(colors.appliedTheme).toBe('dark');
    
    // Test light system preference
    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: 'light' }
    ]);
    
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForTimeout(1000);
    
    const lightColors = await getThemeColors();
    expect(lightColors.appliedTheme).toBe('light');
  });
  
  // Test theme-specific components
  test('Theme Testing - Component Theme Integration', async () => {
    const componentTests = [];
    
    for (const testPage of testPages) {
      await page.setViewport({ width: 1280, height: 720 });
      await page.goto(`${global.TEST_CONFIG.baseURL}${testPage.path}`, { waitUntil: 'networkidle0' });
      
      for (const theme of Object.values(themes)) {
        await global.testUtils.setTheme(page, theme.value);
        await page.waitForTimeout(500);
        
        // Test component theme consistency
        const componentThemeData = await page.evaluate(() => {
          const components = [];
          
          // Check buttons
          const buttons = document.querySelectorAll('button, .btn');
          buttons.forEach((btn, index) => {
            if (index < 5) { // Check first 5 buttons
              const styles = getComputedStyle(btn);
              components.push({
                type: 'button',
                index,
                backgroundColor: styles.backgroundColor,
                color: styles.color,
                borderColor: styles.borderColor
              });
            }
          });
          
          // Check form inputs
          const inputs = document.querySelectorAll('input, select, textarea');
          inputs.forEach((input, index) => {
            if (index < 3) { // Check first 3 inputs
              const styles = getComputedStyle(input);
              components.push({
                type: 'input',
                index,
                backgroundColor: styles.backgroundColor,
                color: styles.color,
                borderColor: styles.borderColor
              });
            }
          });
          
          // Check cards/containers
          const cards = document.querySelectorAll('.card, .container, .box');
          cards.forEach((card, index) => {
            if (index < 3) { // Check first 3 cards
              const styles = getComputedStyle(card);
              components.push({
                type: 'card',
                index,
                backgroundColor: styles.backgroundColor,
                color: styles.color,
                borderColor: styles.borderColor
              });
            }
          });
          
          return components;
        });
        
        const testResult = {
          page: testPage.name,
          theme: theme.value,
          components: componentThemeData,
          passed: componentThemeData.every(comp => 
            comp.backgroundColor !== 'rgba(0, 0, 0, 0)' || comp.color !== 'rgba(0, 0, 0, 0)'
          )
        };
        
        componentTests.push(testResult);
      }
    }
    
    await saveThemeReport(componentTests, 'component_theme_integration');
    
    const failures = componentTests.filter(t => !t.passed);
    if (failures.length > 0) {
      console.log('❌ Component theme integration failures:', failures);
    }
    
    expect(failures.length).toBe(0);
  });
  
  // Test PWA theme color synchronization
  test('Theme Testing - PWA Theme Color Sync', async () => {
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(`${global.TEST_CONFIG.baseURL}/index.html`, { waitUntil: 'networkidle0' });
    
    const pwaThemeTests = [];
    
    for (const theme of Object.values(themes)) {
      await global.testUtils.setTheme(page, theme.value);
      await page.waitForTimeout(1000);
      
      const pwaData = await page.evaluate(() => {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]')?.getAttribute('content');
        const manifestLink = document.querySelector('link[rel="manifest"]')?.href;
        
        return {
          metaThemeColor,
          manifestLink,
          appliedTheme: document.documentElement.getAttribute('data-theme')
        };
      });
      
      const expectedColors = {
        light: '#1FC7D4',
        dark: '#33E1ED',
        hc: '#0066CC'
      };
      
      const testResult = {
        theme: theme.value,
        expectedColor: expectedColors[theme.value],
        actualColor: pwaData.metaThemeColor,
        manifestUpdated: !!pwaData.manifestLink,
        passed: pwaData.metaThemeColor === expectedColors[theme.value]
      };
      
      pwaThemeTests.push(testResult);
    }
    
    await saveThemeReport(pwaThemeTests, 'pwa_theme_sync');
    
    const failures = pwaThemeTests.filter(t => !t.passed);
    expect(failures.length).toBe(0);
  });
  
});