/**
 * Comprehensive Performance QA Test Suite
 * Core Web Vitals, loading performance, and optimization validation
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function runPerformanceTests() {
    console.log('⚡ Starting Performance QA Test Suite...');
    
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-extensions',
            '--no-first-run'
        ],
        defaultViewport: { width: 1280, height: 720 }
    });

    const page = await browser.newPage();
    const baseURL = 'http://localhost:3000';
    
    // Enable Performance API
    await page.evaluateOnNewDocument(() => {
        window.performance.mark = window.performance.mark || (() => {});
        window.performance.measure = window.performance.measure || (() => {});
    });
    
    const performanceResults = {
        timestamp: new Date().toISOString(),
        testConfig: {
            network: 'No throttling',
            cpu: 'No throttling',
            viewport: '1280x720'
        },
        pages: [],
        summary: {}
    };

    const testPages = [
        { name: 'Home', path: '/index.html' },
        { name: 'Transaction Form', path: '/transaction-form.html' },
        { name: 'Transaction History', path: '/transaction-history.html' },
        { name: 'Meal Planning', path: '/meal-planning.html' }
    ];

    for (const testPage of testPages) {
        console.log(`\n⚡ Testing ${testPage.name} page performance...`);
        
        // Clear cache between tests
        await page.goto('about:blank');
        try {
            const client = await page.target().createCDPSession();
            await client.send('Network.clearBrowserCache');
            await client.send('Network.clearBrowserCookies');
        } catch (e) {
            console.log('    ⚠️  Cache clearing not available');
        }
        
        // Start performance recording
        await page.tracing.start({
            path: `tests/reports/trace-${testPage.name.toLowerCase().replace(' ', '-')}.json`,
            categories: ['devtools.timeline']
        });

        const startTime = Date.now();
        
        // Navigate and wait for complete load
        await page.goto(`${baseURL}${testPage.path}`, { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });
        
        const endTime = Date.now();
        const totalLoadTime = endTime - startTime;

        // Wait for dynamic content to load
        await page.waitForTimeout(2000);
        
        console.log('  📊 Collecting Core Web Vitals...');
        
        // Collect comprehensive performance metrics
        const metrics = await page.evaluate(async () => {
            // Core Web Vitals
            const getCLS = () => {
                return new Promise(resolve => {
                    let cls = 0;
                    const observer = new PerformanceObserver((list) => {
                        for (const entry of list.getEntries()) {
                            if (!entry.hadRecentInput) {
                                cls += entry.value;
                            }
                        }
                    });
                    observer.observe({ type: 'layout-shift', buffered: true });
                    
                    setTimeout(() => {
                        observer.disconnect();
                        resolve(cls);
                    }, 3000);
                });
            };

            const getLCP = () => {
                return new Promise(resolve => {
                    let lcp = 0;
                    const observer = new PerformanceObserver((list) => {
                        for (const entry of list.getEntries()) {
                            lcp = entry.startTime;
                        }
                    });
                    observer.observe({ type: 'largest-contentful-paint', buffered: true });
                    
                    setTimeout(() => {
                        observer.disconnect();
                        resolve(lcp);
                    }, 2000);
                });
            };

            const getFID = () => {
                return new Promise(resolve => {
                    let fid = 0;
                    const observer = new PerformanceObserver((list) => {
                        for (const entry of list.getEntries()) {
                            fid = entry.processingStart - entry.startTime;
                        }
                    });
                    observer.observe({ type: 'first-input', buffered: true });
                    
                    // Simulate first input if none detected
                    setTimeout(() => {
                        observer.disconnect();
                        resolve(fid || 0);
                    }, 1000);
                });
            };

            // Navigation timing
            const navigation = performance.getEntriesByType('navigation')[0];
            const timing = performance.timing;
            
            // Resource loading
            const resources = performance.getEntriesByType('resource');
            const resourceSummary = {
                total: resources.length,
                css: resources.filter(r => r.name.includes('.css')).length,
                js: resources.filter(r => r.name.includes('.js')).length,
                images: resources.filter(r => r.name.match(/\.(jpg|jpeg|png|gif|svg|webp)/)).length,
                fonts: resources.filter(r => r.name.match(/\.(woff|woff2|ttf|otf)/)).length
            };

            // Transfer sizes
            const totalTransferSize = resources.reduce((sum, resource) => {
                return sum + (resource.transferSize || 0);
            }, 0);

            const totalEncodedSize = resources.reduce((sum, resource) => {
                return sum + (resource.encodedBodySize || 0);
            }, 0);

            // DOM metrics
            const domMetrics = {
                elements: document.querySelectorAll('*').length,
                scripts: document.querySelectorAll('script').length,
                stylesheets: document.querySelectorAll('link[rel="stylesheet"], style').length,
                images: document.querySelectorAll('img').length
            };

            // Font loading
            const fontLoadTime = document.fonts ? await document.fonts.ready.then(() => performance.now()) : 0;

            // Collect async metrics
            const [cls, lcp, fid] = await Promise.all([
                getCLS(),
                getLCP(),
                getFID()
            ]);

            return {
                coreWebVitals: {
                    cls: Math.round(cls * 1000) / 1000, // Round to 3 decimals
                    lcp: Math.round(lcp * 10) / 10, // Round to 1 decimal
                    fid: Math.round(fid * 10) / 10 // Round to 1 decimal
                },
                timing: {
                    domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                    loadComplete: timing.loadEventEnd - timing.navigationStart,
                    firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
                    firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
                    domInteractive: timing.domInteractive - timing.navigationStart,
                    fontLoadTime: fontLoadTime
                },
                resources: {
                    summary: resourceSummary,
                    transferSize: Math.round(totalTransferSize / 1024), // KB
                    encodedSize: Math.round(totalEncodedSize / 1024), // KB
                    compressionRatio: totalTransferSize > 0 ? Math.round((1 - totalTransferSize / totalEncodedSize) * 100) : 0
                },
                dom: domMetrics,
                navigation: navigation ? {
                    type: navigation.type,
                    transferSize: Math.round((navigation.transferSize || 0) / 1024), // KB
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    loadEventDuration: navigation.loadEventEnd - navigation.loadEventStart
                } : {}
            };
        });

        // Stop tracing
        await page.tracing.stop();

        // Memory usage (if supported)
        let memoryInfo = {};
        try {
            const memoryMetrics = await page.metrics();
            memoryInfo = {
                jsHeapUsedSize: Math.round(memoryMetrics.JSHeapUsedSize / 1024 / 1024), // MB
                jsHeapTotalSize: Math.round(memoryMetrics.JSHeapTotalSize / 1024 / 1024), // MB
                domNodes: memoryMetrics.Nodes,
                domListeners: memoryMetrics.JSEventListeners
            };
        } catch (e) {
            console.log('    ⚠️  Memory metrics not available');
        }

        const pageResult = {
            page: testPage.name,
            url: testPage.path,
            totalLoadTime,
            metrics,
            memoryInfo,
            timestamp: new Date().toISOString()
        };

        performanceResults.pages.push(pageResult);

        // Console output with performance scoring
        const clsScore = metrics.coreWebVitals.cls <= 0.1 ? '✅' : metrics.coreWebVitals.cls <= 0.25 ? '⚠️' : '❌';
        const lcpScore = metrics.coreWebVitals.lcp <= 2500 ? '✅' : metrics.coreWebVitals.lcp <= 4000 ? '⚠️' : '❌';
        const fidScore = metrics.coreWebVitals.fid <= 100 ? '✅' : metrics.coreWebVitals.fid <= 300 ? '⚠️' : '❌';
        const loadScore = totalLoadTime <= 3000 ? '✅' : totalLoadTime <= 5000 ? '⚠️' : '❌';

        console.log(`    ${clsScore} CLS: ${metrics.coreWebVitals.cls} (${metrics.coreWebVitals.cls <= 0.1 ? 'Good' : metrics.coreWebVitals.cls <= 0.25 ? 'Needs Improvement' : 'Poor'})`);
        console.log(`    ${lcpScore} LCP: ${metrics.coreWebVitals.lcp}ms (${metrics.coreWebVitals.lcp <= 2500 ? 'Good' : metrics.coreWebVitals.lcp <= 4000 ? 'Needs Improvement' : 'Poor'})`);
        console.log(`    ${fidScore} FID: ${metrics.coreWebVitals.fid}ms (${metrics.coreWebVitals.fid <= 100 ? 'Good' : metrics.coreWebVitals.fid <= 300 ? 'Needs Improvement' : 'Poor'})`);
        console.log(`    ${loadScore} Load Time: ${totalLoadTime}ms`);
        console.log(`    📦 Resources: ${metrics.resources.summary.total} (${metrics.resources.transferSize}KB transferred)`);
        console.log(`    🧠 Memory: ${memoryInfo.jsHeapUsedSize || 'N/A'}MB heap, ${metrics.dom.elements} DOM elements`);
        console.log(`    🎨 First Paint: ${Math.round(metrics.timing.firstPaint)}ms`);
    }

    // Calculate summary statistics
    const allPages = performanceResults.pages;
    const summary = {
        averageCLS: allPages.reduce((sum, p) => sum + p.metrics.coreWebVitals.cls, 0) / allPages.length,
        averageLCP: allPages.reduce((sum, p) => sum + p.metrics.coreWebVitals.lcp, 0) / allPages.length,
        averageFID: allPages.reduce((sum, p) => sum + p.metrics.coreWebVitals.fid, 0) / allPages.length,
        averageLoadTime: allPages.reduce((sum, p) => sum + p.totalLoadTime, 0) / allPages.length,
        totalTransferSize: allPages.reduce((sum, p) => sum + p.metrics.resources.transferSize, 0),
        performanceScore: 0
    };

    // Calculate overall performance score (0-100)
    const clsScore = summary.averageCLS <= 0.1 ? 100 : summary.averageCLS <= 0.25 ? 75 : 50;
    const lcpScore = summary.averageLCP <= 2500 ? 100 : summary.averageLCP <= 4000 ? 75 : 50;
    const fidScore = summary.averageFID <= 100 ? 100 : summary.averageFID <= 300 ? 75 : 50;
    const loadScore = summary.averageLoadTime <= 3000 ? 100 : summary.averageLoadTime <= 5000 ? 75 : 50;
    
    summary.performanceScore = Math.round((clsScore + lcpScore + fidScore + loadScore) / 4);
    performanceResults.summary = summary;

    // Save results
    await fs.writeFile(
        'tests/reports/performance-qa-report.json',
        JSON.stringify(performanceResults, null, 2)
    );

    // Performance recommendations
    const recommendations = [];
    if (summary.averageCLS > 0.1) recommendations.push('Optimize layout stability (CLS > 0.1)');
    if (summary.averageLCP > 2500) recommendations.push('Improve largest contentful paint (LCP > 2.5s)');
    if (summary.averageFID > 100) recommendations.push('Optimize first input delay (FID > 100ms)');
    if (summary.averageLoadTime > 3000) recommendations.push('Reduce overall load time (> 3s)');
    if (summary.totalTransferSize > 1000) recommendations.push('Consider reducing bundle size');

    console.log('\n📊 Performance Test Summary:');
    console.log(`  🎯 Overall Score: ${summary.performanceScore}/100`);
    console.log(`  📏 Average CLS: ${Math.round(summary.averageCLS * 1000) / 1000}`);
    console.log(`  🎨 Average LCP: ${Math.round(summary.averageLCP)}ms`);
    console.log(`  ⚡ Average FID: ${Math.round(summary.averageFID)}ms`);
    console.log(`  ⏱️  Average Load: ${Math.round(summary.averageLoadTime)}ms`);
    console.log(`  📦 Total Transfer: ${summary.totalTransferSize}KB`);
    
    if (recommendations.length > 0) {
        console.log('\n📋 Performance Recommendations:');
        recommendations.forEach(rec => console.log(`  🔧 ${rec}`));
    }
    
    console.log(`  💾 Detailed report saved to: tests/reports/performance-qa-report.json`);

    await browser.close();
    console.log('✅ Performance QA Testing completed!');
    
    return performanceResults;
}

// Run the tests
runPerformanceTests().catch(console.error);