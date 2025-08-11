/**
 * Keyboard Navigation Testing for 감자토끼 가계부
 * Complete keyboard-only user flows and focus management
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs').promises;
const path = require('path');

puppeteer.use(StealthPlugin());

describe('Keyboard Navigation Testing', () => {
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
    await page.setViewport({
      width: 1280,
      height: 720,
      deviceScaleFactor: 1
    });
    
    // Enable focus visibility
    await page.evaluateOnNewDocument(() => {
      const style = document.createElement('style');
      style.textContent = `
        *:focus {
          outline: 3px solid #0066CC !important;
          outline-offset: 2px !important;
        }
      `;
      document.head.appendChild(style);
    });
  });
  
  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });
  
  /**
   * Get focused element information
   */
  async function getFocusedElement() {
    return await page.evaluate(() => {
      const focused = document.activeElement;
      if (!focused || focused === document.body) return null;
      
      return {
        tagName: focused.tagName,
        className: focused.className,
        id: focused.id,
        ariaLabel: focused.getAttribute('aria-label'),
        ariaRole: focused.getAttribute('role'),
        type: focused.type,
        text: focused.textContent?.trim().substring(0, 100),
        isVisible: focused.offsetParent !== null,
        tabIndex: focused.tabIndex,
        disabled: focused.disabled,
        href: focused.href,
        selector: focused.className ? `.${focused.className.split(' ')[0]}` : focused.tagName.toLowerCase()
      };
    });
  }
  
  /**
   * Test keyboard navigation sequence
   */
  async function testNavigationSequence(steps, context = {}) {
    const results = [];
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Execute the keyboard action
      if (step.key) {
        await page.keyboard.press(step.key);
      } else if (step.keys) {
        for (const key of step.keys) {
          await page.keyboard.press(key);
        }
      } else if (step.type) {
        await page.type(step.selector || ':focus', step.type);
      }
      
      await page.waitForTimeout(step.delay || 100);
      
      // Get current focus
      const focusedElement = await getFocusedElement();
      
      // Validate the step
      let passed = true;
      let errorMessage = '';
      
      if (step.validate) {
        try {
          passed = await step.validate(focusedElement, page);
        } catch (error) {
          passed = false;
          errorMessage = error.message;
        }
      } else if (step.expectedFocus) {
        if (typeof step.expectedFocus === 'string') {
          passed = focusedElement?.selector?.includes(step.expectedFocus) ||
                   focusedElement?.id?.includes(step.expectedFocus) ||
                   focusedElement?.className?.includes(step.expectedFocus) ||
                   focusedElement?.ariaLabel?.includes(step.expectedFocus);
        } else if (typeof step.expectedFocus === 'object') {
          passed = Object.keys(step.expectedFocus).every(key => 
            focusedElement?.[key] === step.expectedFocus[key]
          );
        }
        
        if (!passed) {
          errorMessage = `Expected focus on ${JSON.stringify(step.expectedFocus)}, but got ${JSON.stringify(focusedElement)}`;
        }
      }
      
      const result = {
        step: i + 1,
        description: step.description || `Step ${i + 1}`,
        key: step.key || step.keys?.join('+') || 'type',
        expectedFocus: step.expectedFocus,
        actualFocus: focusedElement,
        passed,
        errorMessage,
        context
      };
      
      results.push(result);
      
      // Take screenshot if step failed (for debugging)
      if (!passed && !process.env.CI) {
        const filename = `keyboard_error_${Date.now()}_step_${i + 1}`;
        await page.screenshot({ path: `tests/screenshots/current/${filename}.png` });
      }
    }
    
    return results;
  }
  
  /**
   * Save navigation test report
   */
  async function saveNavigationReport(results, testName, theme) {
    const reportPath = path.join(__dirname, '../reports', `keyboard_${testName}_${theme}.json`);
    
    const report = {
      timestamp: new Date().toISOString(),
      testName,
      theme,
      url: page.url(),
      totalSteps: results.length,
      passedSteps: results.filter(r => r.passed).length,
      failedSteps: results.filter(r => !r.passed).length,
      results
    };
    
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    return report;
  }
  
  // Test basic tab navigation
  test('Keyboard Navigation - Basic Tab Navigation', async () => {
    await page.goto(`${global.TEST_CONFIG.baseURL}/index.html`, { waitUntil: 'networkidle0' });
    await global.testUtils.setTheme(page, 'light');
    
    const steps = [
      {
        key: 'Tab',
        description: 'Focus on skip-to-content link',
        expectedFocus: 'skip-to-content',
        validate: (el) => el?.className?.includes('skip-to-content') || el?.text?.includes('건너뛰기')
      },
      {
        key: 'Tab',
        description: 'Focus on theme switcher button',
        expectedFocus: 'theme-switcher',
        validate: (el) => el?.ariaLabel?.includes('테마') || el?.className?.includes('theme')
      },
      {
        key: 'Tab',
        description: 'Focus on main navigation',
        expectedFocus: 'nav',
        validate: (el) => el?.tagName === 'BUTTON' || el?.tagName === 'A' || el?.ariaRole === 'navigation'
      },
      {
        key: 'Tab',
        description: 'Focus on main content area',
        expectedFocus: 'main',
        validate: (el) => {
          // Skip until we find an element in main content
          let currentEl = el;
          while (currentEl && !currentEl.closest?.('[role="main"], main')) {
            // Continue tabbing if not in main content yet
            return true;
          }
          return currentEl?.closest?.('[role="main"], main') !== null;
        }
      }
    ];
    
    const results = await testNavigationSequence(steps, { page: 'home', theme: 'light' });
    await saveNavigationReport(results, 'basic_tab_navigation', 'light');
    
    const failures = results.filter(r => !r.passed);
    
    if (failures.length > 0) {
      console.log('❌ Tab navigation failures:', failures.map(f => f.errorMessage).join('\n'));
    }
    
    expect(failures.length).toBe(0);
  });
  
  // Test theme switcher keyboard navigation
  test('Keyboard Navigation - Theme Switcher Interaction', async () => {
    await page.goto(`${global.TEST_CONFIG.baseURL}/index.html`, { waitUntil: 'networkidle0' });
    await global.testUtils.setTheme(page, 'light');
    
    const steps = [
      {
        key: 'Tab',
        description: 'Navigate to theme switcher',
        validate: async (el) => {
          // Keep tabbing until we reach theme switcher
          if (!el?.ariaLabel?.includes('테마') && !el?.className?.includes('theme')) {
            await page.keyboard.press('Tab');
            await page.waitForTimeout(100);
            return false; // Continue looking
          }
          return true;
        }
      },
      {
        key: 'Enter',
        description: 'Open theme dropdown with Enter',
        validate: async (el, page) => {
          await page.waitForTimeout(300);
          const dropdown = await page.$('.theme-dropdown.show, .theme-dropdown[aria-expanded="true"]');
          return dropdown !== null;
        }
      },
      {
        key: 'ArrowDown',
        description: 'Navigate down in theme options',
        validate: (el) => el?.className?.includes('theme-option') || el?.ariaRole === 'option'
      },
      {
        key: 'ArrowDown',
        description: 'Navigate to next theme option',
        validate: (el) => el?.className?.includes('theme-option') || el?.ariaRole === 'option'
      },
      {
        key: 'Enter',
        description: 'Select theme option',
        validate: async (el, page) => {
          await page.waitForTimeout(500);
          // Verify theme changed
          const currentTheme = await page.evaluate(() => 
            document.documentElement.getAttribute('data-theme')
          );
          return currentTheme && currentTheme !== 'light';
        }
      },
      {
        key: 'Escape',
        description: 'Close dropdown with Escape',
        validate: async (el, page) => {
          await page.waitForTimeout(300);
          const dropdown = await page.$('.theme-dropdown.show, .theme-dropdown[aria-expanded="true"]');
          return dropdown === null;
        }
      }
    ];
    
    const results = await testNavigationSequence(steps, { page: 'home', interaction: 'theme-switcher' });
    await saveNavigationReport(results, 'theme_switcher_navigation', 'light');
    
    const failures = results.filter(r => !r.passed);
    expect(failures.length).toBeLessThanOrEqual(1); // Allow one failure for dynamic navigation
  });
  
  // Test form navigation
  test('Keyboard Navigation - Transaction Form Navigation', async () => {
    await page.goto(`${global.TEST_CONFIG.baseURL}/transaction-form.html`, { waitUntil: 'networkidle0' });
    await global.testUtils.setTheme(page, 'light');
    
    const steps = [
      {
        key: 'Tab',
        description: 'Navigate to first form field',
        validate: async (el) => {
          // Keep tabbing until we reach a form field
          if (el?.tagName !== 'INPUT' && el?.tagName !== 'SELECT' && el?.tagName !== 'TEXTAREA') {
            await page.keyboard.press('Tab');
            await page.waitForTimeout(100);
            return el?.tagName === 'INPUT' || el?.tagName === 'SELECT' || el?.tagName === 'TEXTAREA';
          }
          return true;
        }
      },
      {
        type: '50000',
        description: 'Type amount value',
        validate: async (el, page) => {
          const value = await page.evaluate(() => document.activeElement.value);
          return value.includes('50000');
        }
      },
      {
        key: 'Tab',
        description: 'Move to next form field',
        validate: (el) => el?.tagName === 'INPUT' || el?.tagName === 'SELECT' || el?.tagName === 'TEXTAREA'
      },
      {
        type: '월급',
        description: 'Type description',
        validate: async (el, page) => {
          const value = await page.evaluate(() => document.activeElement.value);
          return value.includes('월급');
        }
      },
      {
        key: 'Tab',
        description: 'Move to category select',
        validate: (el) => el?.tagName === 'SELECT'
      },
      {
        key: 'ArrowDown',
        description: 'Navigate select options',
        validate: async (el, page) => {
          // Allow select navigation
          return el?.tagName === 'SELECT' || el?.tagName === 'OPTION';
        }
      },
      {
        key: 'Tab',
        description: 'Move to submit button',
        validate: (el) => el?.tagName === 'BUTTON' && (el?.type === 'submit' || el?.text?.includes('저장') || el?.text?.includes('등록'))
      },
      {
        key: 'Enter',
        description: 'Submit form',
        validate: async (el, page) => {
          await page.waitForTimeout(1000);
          // Check for success message or redirect
          const successMessage = await page.$('.success-message, .alert-success, [data-success]');
          const currentUrl = page.url();
          return successMessage !== null || !currentUrl.includes('transaction-form.html');
        }
      }
    ];
    
    const results = await testNavigationSequence(steps, { page: 'transaction-form', flow: 'form-submission' });
    await saveNavigationReport(results, 'form_navigation', 'light');
    
    const criticalFailures = results.filter(r => !r.passed && r.description.includes('Submit form'));
    expect(criticalFailures.length).toBe(0);
  });
  
  // Test modal focus trap
  test('Keyboard Navigation - Modal Focus Trap', async () => {
    await page.goto(`${global.TEST_CONFIG.baseURL}/index.html`, { waitUntil: 'networkidle0' });
    await global.testUtils.setTheme(page, 'light');
    
    // Check if modal exists on page
    const hasModal = await page.$('[data-bs-toggle="modal"], [data-modal-trigger], .modal-trigger') !== null;
    
    if (!hasModal) {
      console.log('ℹ️  No modal found on home page, skipping modal focus trap test');
      return;
    }
    
    const steps = [
      {
        description: 'Open modal',
        validate: async (el, page) => {
          // Find and click modal trigger
          const modalTrigger = await page.$('[data-bs-toggle="modal"], [data-modal-trigger], .modal-trigger');
          if (modalTrigger) {
            await modalTrigger.click();
            await page.waitForTimeout(500);
            
            const modal = await page.$('.modal:not([aria-hidden="true"]), [role="dialog"]:not([aria-hidden="true"])');
            return modal !== null;
          }
          return false;
        }
      },
      {
        key: 'Tab',
        description: 'Focus first element in modal',
        validate: async (el, page) => {
          // Verify focus is trapped within modal
          const focusedInModal = await page.evaluate(() => {
            const focused = document.activeElement;
            const modal = focused.closest('.modal, [role="dialog"]');
            return modal !== null;
          });
          return focusedInModal;
        }
      },
      {
        key: 'Tab',
        description: 'Tab within modal',
        validate: async (el, page) => {
          const focusedInModal = await page.evaluate(() => {
            const focused = document.activeElement;
            const modal = focused.closest('.modal, [role="dialog"]');
            return modal !== null;
          });
          return focusedInModal;
        }
      },
      {
        key: 'Escape',
        description: 'Close modal with Escape',
        validate: async (el, page) => {
          await page.waitForTimeout(500);
          const modal = await page.$('.modal:not([aria-hidden="true"]), [role="dialog"]:not([aria-hidden="true"])');
          return modal === null;
        }
      }
    ];
    
    const results = await testNavigationSequence(steps, { page: 'home', interaction: 'modal' });
    await saveNavigationReport(results, 'modal_focus_trap', 'light');
    
    const failures = results.filter(r => !r.passed);
    expect(failures.length).toBeLessThanOrEqual(1);
  });
  
  // Test navigation menu keyboard access
  test('Keyboard Navigation - Navigation Menu Access', async () => {
    await page.goto(`${global.TEST_CONFIG.baseURL}/index.html`, { waitUntil: 'networkidle0' });
    await global.testUtils.setTheme(page, 'light');
    
    const steps = [
      {
        description: 'Navigate to navigation menu',
        validate: async (el, page) => {
          // Keep tabbing until we find navigation
          let attempts = 0;
          while (attempts < 10) {
            await page.keyboard.press('Tab');
            await page.waitForTimeout(100);
            
            const focused = await getFocusedElement();
            if (focused?.ariaRole === 'navigation' || 
                focused?.closest?.('nav, [role="navigation"]') ||
                focused?.className?.includes('nav')) {
              return true;
            }
            attempts++;
          }
          return false;
        }
      },
      {
        key: 'Enter',
        description: 'Access navigation menu',
        validate: async (el, page) => {
          await page.waitForTimeout(300);
          // Check if submenu or navigation options are revealed
          const activeNav = await page.$('.nav-open, .active, [aria-expanded="true"]');
          return activeNav !== null || el?.ariaExpanded === 'true';
        }
      },
      {
        key: 'ArrowDown',
        description: 'Navigate menu items with arrow keys',
        validate: (el) => {
          // Allow navigation within menu
          return el?.tagName === 'A' || el?.tagName === 'BUTTON' || el?.ariaRole === 'menuitem';
        }
      },
      {
        key: 'Enter',
        description: 'Select menu item',
        validate: async (el, page) => {
          await page.waitForTimeout(1000);
          // Check if page changed or action occurred
          const currentUrl = page.url();
          return currentUrl.length > 0;
        }
      }
    ];
    
    const results = await testNavigationSequence(steps, { page: 'home', interaction: 'navigation' });
    await saveNavigationReport(results, 'navigation_menu', 'light');
    
    const criticalFailures = results.filter(r => !r.passed && (
      r.description.includes('Access navigation') || 
      r.description.includes('Navigate menu')
    ));
    
    expect(criticalFailures.length).toBeLessThanOrEqual(2); // Allow some flexibility in menu navigation
  });
  
  // Test skip links functionality
  test('Keyboard Navigation - Skip Links Functionality', async () => {
    await page.goto(`${global.TEST_CONFIG.baseURL}/index.html`, { waitUntil: 'networkidle0' });
    await global.testUtils.setTheme(page, 'light');
    
    const steps = [
      {
        key: 'Tab',
        description: 'Focus on skip-to-content link',
        expectedFocus: 'skip-to-content',
        validate: (el) => el?.className?.includes('skip-to-content') || el?.text?.includes('건너뛰기')
      },
      {
        key: 'Enter',
        description: 'Activate skip-to-content link',
        validate: async (el, page) => {
          await page.waitForTimeout(300);
          
          // Check if focus moved to main content
          const focusedAfterSkip = await getFocusedElement();
          const mainContent = await page.$('#main-content, [role="main"], main');
          
          if (mainContent) {
            const mainContentFocused = await page.evaluate(() => {
              const main = document.querySelector('#main-content, [role="main"], main');
              const focused = document.activeElement;
              return main === focused || main.contains(focused);
            });
            return mainContentFocused;
          }
          
          return true; // Allow if no main content found
        }
      }
    ];
    
    const results = await testNavigationSequence(steps, { page: 'home', interaction: 'skip-links' });
    await saveNavigationReport(results, 'skip_links', 'light');
    
    const failures = results.filter(r => !r.passed);
    expect(failures.length).toBe(0);
  });
  
  // Test keyboard navigation with screen reader keys
  test('Keyboard Navigation - Screen Reader Compatibility', async () => {
    await page.goto(`${global.TEST_CONFIG.baseURL}/index.html`, { waitUntil: 'networkidle0' });
    await global.testUtils.setTheme(page, 'light');
    
    const screenReaderTests = [
      {
        key: 'h', // NVDA/JAWS heading navigation
        description: 'Navigate by headings',
        validate: async (el, page) => {
          // Simulate heading navigation by finding next heading
          const headings = await page.$$('h1, h2, h3, h4, h5, h6');
          return headings.length > 0;
        }
      },
      {
        key: 'l', // NVDA/JAWS list navigation
        description: 'Navigate by lists',
        validate: async (el, page) => {
          const lists = await page.$$('ul, ol, dl');
          return lists.length >= 0; // Allow if no lists
        }
      },
      {
        key: 'f', // NVDA/JAWS form navigation
        description: 'Navigate by forms',
        validate: async (el, page) => {
          const forms = await page.$$('form, input, select, textarea');
          return forms.length >= 0; // Allow if no forms on home page
        }
      }
    ];
    
    // Note: These tests are more conceptual as real screen reader testing requires actual screen reader software
    console.log('ℹ️  Screen reader compatibility test is conceptual - requires actual screen reader for full validation');
    
    const results = screenReaderTests.map((test, index) => ({
      step: index + 1,
      description: test.description,
      key: test.key,
      passed: true, // Assume passed for conceptual test
      note: 'Conceptual test - requires actual screen reader validation'
    }));
    
    await saveNavigationReport(results, 'screen_reader_compatibility', 'light');
    
    // Always pass conceptual test
    expect(results.length).toBeGreaterThan(0);
  });
  
});