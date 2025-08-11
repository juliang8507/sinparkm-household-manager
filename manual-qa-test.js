/**
 * Manual QA Test Suite for Responsive Design and Layout Validation
 * Focuses on layout, accessibility, and performance metrics
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function runQATests() {
    console.log('🧪 Starting Manual QA Test Suite...');
    
    const browser = await puppeteer.launch({
        headless: false, // Show browser for visual debugging
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--allow-file-access-from-files'
        ],
        defaultViewport: { width: 1280, height: 720 }
    });

    const page = await browser.newPage();
    const baseURL = 'http://localhost:3000';
    
    // Test results collector
    const results = {
        responsive: [],
        accessibility: [],
        performance: [],
        layout: [],
        errors: []
    };

    console.log('📱 Testing Responsive Design...');
    
    // Responsive breakpoints to test
    const breakpoints = [
        { name: 'Mobile', width: 375, height: 667 },
        { name: 'Mobile Large', width: 414, height: 896 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Desktop', width: 1280, height: 720 },
        { name: 'Desktop Large', width: 1920, height: 1080 }
    ];

    for (const bp of breakpoints) {
        console.log(`📐 Testing ${bp.name} (${bp.width}x${bp.height})`);
        
        await page.setViewport({ width: bp.width, height: bp.height });
        await page.goto(`${baseURL}/index.html`, { waitUntil: 'networkidle0' });
        
        // Wait for layout to stabilize
        await page.waitForTimeout(500);
        
        // Check for horizontal scrollbar
        const layoutCheck = await page.evaluate(() => {
            return {
                hasHorizontalScrollbar: document.body.scrollWidth > window.innerWidth,
                viewportWidth: window.innerWidth,
                bodyWidth: document.body.scrollWidth,
                hasMainContent: !!document.querySelector('main, .main-content, .container'),
                hasNavigation: !!document.querySelector('nav, .navigation, .bottom-navigation'),
                headerVisible: !!document.querySelector('header, .app-header')
            };
        });
        
        results.responsive.push({
            breakpoint: bp.name,
            dimensions: `${bp.width}x${bp.height}`,
            passed: !layoutCheck.hasHorizontalScrollbar,
            details: layoutCheck
        });
        
        // Take screenshot
        await page.screenshot({ 
            path: `tests/screenshots/manual-qa-${bp.name.toLowerCase().replace(' ', '-')}.png`,
            fullPage: false
        });
        
        console.log(`  ${!layoutCheck.hasHorizontalScrollbar ? '✅' : '❌'} No horizontal scroll: ${!layoutCheck.hasHorizontalScrollbar}`);
        console.log(`  📊 Body width: ${layoutCheck.bodyWidth}px, Viewport: ${layoutCheck.viewportWidth}px`);
    }

    console.log('⚡ Testing Performance Metrics...');
    
    // Performance testing at desktop resolution
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(`${baseURL}/index.html`, { waitUntil: 'networkidle0' });
    
    const performanceMetrics = await page.evaluate(() => {
        const perf = performance;
        const timing = perf.timing;
        const navigation = perf.getEntriesByType('navigation')[0];
        
        return {
            loadTime: timing.loadEventEnd - timing.navigationStart,
            domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
            firstPaint: perf.getEntriesByName('first-paint')[0]?.startTime || 0,
            largestContentfulPaint: perf.getEntriesByName('largest-contentful-paint')[0]?.startTime || 0,
            resourceCount: perf.getEntriesByType('resource').length,
            totalTransferSize: navigation?.transferSize || 0,
            domElements: document.querySelectorAll('*').length
        };
    });
    
    // Core Web Vitals check
    const clsValue = await page.evaluate(() => {
        return new Promise(resolve => {
            let cls = 0;
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        cls += entry.value;
                    }
                }
                resolve(cls);
            }).observe({ type: 'layout-shift', buffered: true });
            
            setTimeout(() => resolve(cls), 3000);
        });
    });
    
    results.performance.push({
        loadTime: performanceMetrics.loadTime,
        domContentLoaded: performanceMetrics.domContentLoaded,
        firstPaint: performanceMetrics.firstPaint,
        lcp: performanceMetrics.largestContentfulPaint,
        cls: clsValue,
        resourceCount: performanceMetrics.resourceCount,
        transferSize: performanceMetrics.totalTransferSize,
        domElements: performanceMetrics.domElements
    });
    
    console.log(`  ⏱️  Load time: ${performanceMetrics.loadTime}ms`);
    console.log(`  🎨 First Paint: ${performanceMetrics.firstPaint}ms`);
    console.log(`  📊 LCP: ${performanceMetrics.largestContentfulPaint}ms`);
    console.log(`  📏 CLS: ${clsValue.toFixed(3)}`);

    console.log('♿ Testing Accessibility Features...');
    
    const accessibilityCheck = await page.evaluate(() => {
        return {
            hasSkipLinks: !!document.querySelector('.skip-to-content'),
            hasProperHeadings: !!document.querySelector('h1') && !!document.querySelector('h2'),
            ariaLabels: document.querySelectorAll('[aria-label]').length,
            ariaRoles: document.querySelectorAll('[role]').length,
            altTexts: document.querySelectorAll('img[alt]').length,
            totalImages: document.querySelectorAll('img').length,
            focusableElements: document.querySelectorAll('button, a, input, [tabindex]:not([tabindex="-1"])').length,
            landmarks: {
                header: !!document.querySelector('header'),
                nav: !!document.querySelector('nav'),
                main: !!document.querySelector('main'),
                footer: !!document.querySelector('footer')
            }
        };
    });
    
    results.accessibility.push(accessibilityCheck);
    
    console.log(`  🔗 Skip links: ${accessibilityCheck.hasSkipLinks ? '✅' : '❌'}`);
    console.log(`  📝 Proper headings: ${accessibilityCheck.hasProperHeadings ? '✅' : '❌'}`);
    console.log(`  🏷️  ARIA labels: ${accessibilityCheck.ariaLabels}`);
    console.log(`  🖼️  Alt texts: ${accessibilityCheck.altTexts}/${accessibilityCheck.totalImages} images`);

    console.log('🎨 Testing Theme Systems...');
    
    const themes = ['light', 'dark'];
    for (const theme of themes) {
        await page.evaluate((themeName) => {
            document.documentElement.setAttribute('data-theme', themeName);
        }, theme);
        
        await page.waitForTimeout(300);
        
        const themeCheck = await page.evaluate((themeName) => {
            const root = document.documentElement;
            const appliedTheme = root.getAttribute('data-theme');
            const styles = getComputedStyle(root);
            
            return {
                theme: themeName,
                applied: appliedTheme === themeName,
                hasCSSVariables: !!styles.getPropertyValue('--color-primary'),
                backgroundColor: getComputedStyle(document.body).backgroundColor
            };
        }, theme);
        
        // Take screenshot of theme
        await page.screenshot({ 
            path: `tests/screenshots/manual-qa-theme-${theme}.png`,
            fullPage: false 
        });
        
        console.log(`  🎭 ${theme} theme: ${themeCheck.applied ? '✅' : '❌'} Applied`);
    }

    console.log('🖱️  Testing Interactive Elements...');
    
    // Test keyboard navigation
    await page.focus('body');
    await page.keyboard.press('Tab');
    
    const focusedElement = await page.evaluate(() => {
        const focused = document.activeElement;
        return {
            tagName: focused.tagName,
            hasVisibleFocus: focused.matches(':focus-visible') || focused.matches(':focus'),
            className: focused.className
        };
    });
    
    console.log(`  ⌨️  Keyboard focus: ${focusedElement.hasVisibleFocus ? '✅' : '❌'} Working`);
    console.log(`  🎯 Focused element: ${focusedElement.tagName}.${focusedElement.className}`);

    // Generate summary report
    const summary = {
        timestamp: new Date().toISOString(),
        totalTests: results.responsive.length + results.accessibility.length + results.performance.length,
        passedTests: results.responsive.filter(r => r.passed).length,
        results: results
    };
    
    // Save results
    await fs.writeFile(
        'tests/reports/manual-qa-report.json',
        JSON.stringify(summary, null, 2)
    );
    
    console.log('\n📊 QA Test Summary:');
    console.log(`  📱 Responsive tests: ${results.responsive.filter(r => r.passed).length}/${results.responsive.length} passed`);
    console.log(`  ♿ Accessibility features detected: ${Object.values(results.accessibility[0]?.landmarks || {}).filter(Boolean).length}`);
    console.log(`  ⚡ Performance: Load ${results.performance[0]?.loadTime}ms, CLS ${results.performance[0]?.cls?.toFixed(3)}`);
    console.log(`  💾 Report saved to: tests/reports/manual-qa-report.json`);

    await browser.close();
    console.log('✅ Manual QA Testing completed!');
    
    return summary;
}

// Run the tests
runQATests().catch(console.error);