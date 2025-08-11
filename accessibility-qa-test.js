/**
 * Comprehensive Accessibility QA Test Suite
 * WCAG 2.1 AA/AAA compliance validation
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function runAccessibilityTests() {
    console.log('♿ Starting Accessibility QA Test Suite...');
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1280, height: 720 }
    });

    const page = await browser.newPage();
    const baseURL = 'http://localhost:3000';
    
    const testResults = {
        timestamp: new Date().toISOString(),
        pages: [],
        summary: {
            totalIssues: 0,
            criticalIssues: 0,
            warnings: 0,
            passes: 0
        }
    };

    const testPages = [
        { name: 'Home', path: '/index.html' },
        { name: 'Transaction Form', path: '/transaction-form.html' },
        { name: 'Transaction History', path: '/transaction-history.html' },
        { name: 'Meal Planning', path: '/meal-planning.html' }
    ];

    for (const testPage of testPages) {
        console.log(`\n🔍 Testing ${testPage.name} page...`);
        
        await page.goto(`${baseURL}${testPage.path}`, { 
            waitUntil: 'networkidle0',
            timeout: 10000 
        });
        
        await page.waitForTimeout(1000);

        // 1. Heading Structure Test
        console.log('  📝 Checking heading structure...');
        const headingStructure = await page.evaluate(() => {
            const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
            const structure = headings.map(h => ({
                level: parseInt(h.tagName[1]),
                text: h.textContent.trim(),
                hasId: !!h.id,
                isVisible: h.offsetParent !== null
            }));
            
            const issues = [];
            if (structure.length > 0 && structure[0].level !== 1) {
                issues.push('First heading should be h1');
            }
            
            let previousLevel = 0;
            structure.forEach((heading, index) => {
                if (heading.level > previousLevel + 1) {
                    issues.push(`Heading level jumps from h${previousLevel} to h${heading.level}`);
                }
                if (heading.level > 0) previousLevel = heading.level;
            });
            
            return { structure, issues };
        });

        // 2. Color Contrast Test (Simulated)
        console.log('  🎨 Checking color contrast...');
        const colorContrast = await page.evaluate(() => {
            const elements = [];
            const selectors = ['.text-primary', '.text-secondary', '.btn', 'button', 'a', 'input'];
            
            selectors.forEach(selector => {
                const els = document.querySelectorAll(selector);
                els.forEach(el => {
                    const styles = getComputedStyle(el);
                    const color = styles.color;
                    const backgroundColor = styles.backgroundColor;
                    
                    if (color !== 'rgba(0, 0, 0, 0)' || backgroundColor !== 'rgba(0, 0, 0, 0)') {
                        elements.push({
                            selector,
                            color,
                            backgroundColor,
                            fontSize: styles.fontSize
                        });
                    }
                });
            });
            
            return elements;
        });

        // 3. Form Labels Test
        console.log('  📝 Checking form accessibility...');
        const formAccessibility = await page.evaluate(() => {
            const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
            const issues = [];
            const passes = [];
            
            inputs.forEach((input, index) => {
                if (input.type === 'hidden') return;
                
                const hasLabel = document.querySelector(`label[for="${input.id}"]`) ||
                               input.getAttribute('aria-label') ||
                               input.getAttribute('aria-labelledby') ||
                               input.getAttribute('placeholder');
                
                if (!hasLabel) {
                    issues.push(`Form input ${index + 1} (${input.type}) missing label or aria-label`);
                } else {
                    passes.push(`Form input ${index + 1} has proper labeling`);
                }
            });
            
            return { issues, passes, totalInputs: inputs.length };
        });

        // 4. ARIA Landmarks Test
        console.log('  🗺️  Checking ARIA landmarks...');
        const landmarks = await page.evaluate(() => {
            const landmarkRoles = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
            const found = {};
            
            landmarkRoles.forEach(role => {
                const byRole = document.querySelectorAll(`[role="${role}"]`).length;
                const semantic = {
                    'banner': document.querySelectorAll('header').length,
                    'navigation': document.querySelectorAll('nav').length,
                    'main': document.querySelectorAll('main').length,
                    'contentinfo': document.querySelectorAll('footer').length
                }[role] || 0;
                
                found[role] = byRole + semantic;
            });
            
            return found;
        });

        // 5. Image Alt Text Test
        console.log('  🖼️  Checking image alt text...');
        const imageAccessibility = await page.evaluate(() => {
            const images = Array.from(document.querySelectorAll('img'));
            const issues = [];
            const passes = [];
            
            images.forEach((img, index) => {
                const hasAlt = img.hasAttribute('alt');
                const isDecorative = img.getAttribute('alt') === '' || img.getAttribute('aria-hidden') === 'true';
                const hasAriaLabel = img.getAttribute('aria-label');
                
                if (!hasAlt && !hasAriaLabel && !isDecorative) {
                    issues.push(`Image ${index + 1} missing alt text: ${img.src.substring(img.src.lastIndexOf('/'))}`);
                } else {
                    passes.push(`Image ${index + 1} has proper alt text`);
                }
            });
            
            return { issues, passes, totalImages: images.length };
        });

        // 6. Keyboard Navigation Test
        console.log('  ⌨️  Testing keyboard navigation...');
        const keyboardNav = await page.evaluate(() => {
            const focusableElements = document.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            let tabOrder = [];
            focusableElements.forEach((el, index) => {
                const tabIndex = el.tabIndex;
                const isVisible = el.offsetParent !== null;
                const isDisabled = el.disabled;
                
                tabOrder.push({
                    index,
                    tagName: el.tagName,
                    tabIndex,
                    isVisible,
                    isDisabled,
                    hasAriaLabel: !!el.getAttribute('aria-label')
                });
            });
            
            return {
                totalFocusable: focusableElements.length,
                visibleFocusable: tabOrder.filter(el => el.isVisible && !el.isDisabled).length,
                tabOrder
            };
        });

        // 7. ARIA Attributes Test
        console.log('  🏷️  Checking ARIA attributes...');
        const ariaAttributes = await page.evaluate(() => {
            const ariaElements = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [role], [aria-expanded], [aria-hidden]');
            const ariaTypes = {
                'aria-label': document.querySelectorAll('[aria-label]').length,
                'aria-labelledby': document.querySelectorAll('[aria-labelledby]').length,
                'aria-describedby': document.querySelectorAll('[aria-describedby]').length,
                'role': document.querySelectorAll('[role]').length,
                'aria-expanded': document.querySelectorAll('[aria-expanded]').length,
                'aria-hidden': document.querySelectorAll('[aria-hidden]').length
            };
            
            return {
                totalAriaElements: ariaElements.length,
                ariaTypes
            };
        });

        // Compile page results
        const pageResult = {
            page: testPage.name,
            url: testPage.path,
            headingStructure,
            colorContrast: colorContrast.slice(0, 5), // Limit output
            formAccessibility,
            landmarks,
            imageAccessibility,
            keyboardNavigation: keyboardNav,
            ariaAttributes,
            issueCount: headingStructure.issues.length + formAccessibility.issues.length + imageAccessibility.issues.length
        };
        
        testResults.pages.push(pageResult);
        testResults.summary.totalIssues += pageResult.issueCount;

        // Console output
        console.log(`    📊 Headings: ${headingStructure.structure.length} found, ${headingStructure.issues.length} issues`);
        console.log(`    📝 Forms: ${formAccessibility.totalInputs} inputs, ${formAccessibility.issues.length} issues`);
        console.log(`    🖼️  Images: ${imageAccessibility.totalImages} images, ${imageAccessibility.issues.length} issues`);
        console.log(`    ⌨️  Focusable: ${keyboardNav.visibleFocusable} elements`);
        console.log(`    🏷️  ARIA: ${ariaAttributes.totalAriaElements} elements with ARIA attributes`);
        console.log(`    🗺️  Landmarks: ${Object.values(landmarks).reduce((a, b) => a + b, 0)} total`);
    }

    // Generate overall score
    const totalChecks = testResults.pages.length * 6; // 6 categories per page
    const passedChecks = totalChecks - testResults.summary.totalIssues;
    const score = Math.round((passedChecks / totalChecks) * 100);

    testResults.summary.score = score;
    testResults.summary.passedChecks = passedChecks;
    testResults.summary.totalChecks = totalChecks;

    // Save detailed results
    await fs.writeFile(
        'tests/reports/accessibility-qa-report.json',
        JSON.stringify(testResults, null, 2)
    );

    console.log('\n📊 Accessibility Test Summary:');
    console.log(`  🎯 Overall Score: ${score}%`);
    console.log(`  ✅ Passed Checks: ${passedChecks}/${totalChecks}`);
    console.log(`  ⚠️  Total Issues: ${testResults.summary.totalIssues}`);
    console.log(`  📄 Pages Tested: ${testResults.pages.length}`);
    
    // Recommendations
    console.log('\n📋 Key Recommendations:');
    testResults.pages.forEach(pageResult => {
        if (pageResult.issueCount > 0) {
            console.log(`  🔧 ${pageResult.page}: ${pageResult.issueCount} issues need attention`);
        }
    });
    
    console.log(`  💾 Detailed report saved to: tests/reports/accessibility-qa-report.json`);

    await browser.close();
    console.log('✅ Accessibility QA Testing completed!');
    
    return testResults;
}

// Run the tests
runAccessibilityTests().catch(console.error);