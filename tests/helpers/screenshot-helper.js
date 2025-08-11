/**
 * Screenshot Helper Utilities for 감자토끼 가계부 Visual Testing
 * Enhanced Korean app support with pixel-perfect comparison
 */

const fs = require('fs').promises;
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const { VIEWPORT_CONFIG, THEME_CONFIG, PAGE_CONFIG } = require('../config/viewport-config');

class ScreenshotHelper {
  constructor() {
    this.baselineDir = path.join(__dirname, '../screenshots/baseline');
    this.currentDir = path.join(__dirname, '../screenshots/current');
    this.diffDir = path.join(__dirname, '../screenshots/diffs');
    this.reportsDir = path.join(__dirname, '../reports');
    
    // Ensure directories exist
    this.ensureDirectories();
    
    // Comparison results
    this.comparisonResults = [];
  }
  
  /**
   * Ensure all required directories exist
   */
  async ensureDirectories() {
    const dirs = [this.baselineDir, this.currentDir, this.diffDir, this.reportsDir];
    
    for (const dir of dirs) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
      }
    }
  }
  
  /**
   * Take screenshot with Korean font support and stabilization
   */
  async takeScreenshot(page, testName, options = {}) {
    const defaultOptions = {
      fullPage: true,
      type: 'png',
      animations: 'disabled',
      clip: options.clip || null,
      ...options
    };
    
    // Ensure Korean fonts are loaded
    await this.waitForKoreanFonts(page);
    
    // Stabilize animations and dynamic content
    await this.stabilizePage(page, options.pageConfig);
    
    // Wait for layout stability
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    const screenshotPath = path.join(this.currentDir, `${testName}.png`);
    
    // Take screenshot with consistent settings
    await page.screenshot({
      path: screenshotPath,
      ...defaultOptions
    });
    
    return screenshotPath;
  }
  
  /**
   * Wait for Korean fonts to fully load
   */
  async waitForKoreanFonts(page) {
    // Wait for document fonts to be ready
    await page.waitForFunction(() => document.fonts.ready);
    
    // Specifically check for Korean font rendering
    await page.waitForFunction(() => {
      const testElement = document.createElement('div');
      testElement.style.position = 'absolute';
      testElement.style.visibility = 'hidden';
      testElement.style.fontFamily = 'Kanit, "Malgun Gothic", Dotum, AppleGothic, sans-serif';
      testElement.style.fontSize = '16px';
      testElement.textContent = '감자토끼 가계부';
      document.body.appendChild(testElement);
      
      const width = testElement.offsetWidth;
      document.body.removeChild(testElement);
      
      // Korean text should render properly (width > 0)
      return width > 0;
    });
    
    // Additional wait for font rendering stability
    await page.waitForTimeout(1000);
  }
  
  /**
   * Stabilize page by hiding dynamic content and disabling animations
   */
  async stabilizePage(page, pageConfig) {
    await page.evaluate((config) => {
      // Disable all animations and transitions
      const style = document.createElement('style');
      style.innerHTML = `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
          scroll-behavior: auto !important;
        }
      `;
      document.head.appendChild(style);
      
      // Hide dynamic content based on page configuration
      if (config && config.hideSelectors) {
        config.hideSelectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            el.style.visibility = 'hidden';
          });
        });
      }
      
      // Hide common dynamic elements
      const dynamicSelectors = [
        '[data-testid="timestamp"]',
        '[data-testid="current-time"]',
        '[data-testid="relative-time"]',
        '[data-testid="current-date"]',
        '.loading-spinner',
        '.loading-state',
        '.loading-transactions',
        '.loading-meals',
        '.skeleton-loader'
      ];
      
      dynamicSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          el.style.visibility = 'hidden';
        });
      });
      
      // Replace dynamic text content with stable values
      const dateElements = document.querySelectorAll('.date-display');
      dateElements.forEach(el => {
        el.textContent = '2024-08-11';
      });
      
      const timeElements = document.querySelectorAll('.time-display');
      timeElements.forEach(el => {
        el.textContent = '14:30';
      });
      
    }, pageConfig);
  }
  
  /**
   * Set theme with proper waiting and validation
   */
  async setTheme(page, themeName) {
    const theme = THEME_CONFIG[themeName];
    if (!theme) {
      throw new Error(`Unknown theme: ${themeName}`);
    }
    
    // Set theme in localStorage
    await page.evaluate((themeData) => {
      localStorage.setItem('potato-rabbit-theme', themeData.storageKey);
    }, theme);
    
    // Reload page to apply theme
    await page.reload({ waitUntil: 'networkidle' });
    
    // Wait for theme to be applied
    await page.waitForFunction(
      (expectedTheme) => {
        const appliedTheme = document.documentElement.getAttribute('data-theme');
        return appliedTheme === expectedTheme;
      },
      {},
      theme.dataTheme
    );
    
    // Wait for CSS variables to be applied
    await page.waitForFunction(
      (bgColor) => {
        const computedStyle = getComputedStyle(document.documentElement);
        const actualBgColor = computedStyle.getPropertyValue('--background-color') || 
                             computedStyle.backgroundColor;
        return actualBgColor.includes(bgColor.slice(1)) || actualBgColor !== '';
      },
      {},
      theme.backgroundColor
    );
    
    await page.waitForTimeout(500); // Additional stability wait
  }
  
  /**
   * Compare screenshots with detailed analysis
   */
  async compareScreenshots(testName, threshold = 0.1) {
    const baselinePath = path.join(this.baselineDir, `${testName}.png`);
    const currentPath = path.join(this.currentDir, `${testName}.png`);
    const diffPath = path.join(this.diffDir, `${testName}.png`);
    
    const result = {
      testName,
      baselineExists: true,
      identical: false,
      diffPercentage: 0,
      pixelDifference: 0,
      threshold,
      passed: false,
      isNewBaseline: false,
      error: null
    };
    
    try {
      // Check if baseline exists
      await fs.access(baselinePath);
      
      // Read both images
      const baselineBuffer = await fs.readFile(baselinePath);
      const currentBuffer = await fs.readFile(currentPath);
      
      const baseline = PNG.sync.read(baselineBuffer);
      const current = PNG.sync.read(currentBuffer);
      
      // Validate dimensions
      if (baseline.width !== current.width || baseline.height !== current.height) {
        throw new Error(
          `Dimension mismatch: baseline(${baseline.width}x${baseline.height}) vs current(${current.width}x${current.height})`
        );
      }
      
      // Create diff image
      const diff = new PNG({ width: baseline.width, height: baseline.height });
      
      // Compare pixels
      const pixelDifference = pixelmatch(
        baseline.data,
        current.data,
        diff.data,
        baseline.width,
        baseline.height,
        {
          threshold: 0.1,
          includeAA: false,
          alpha: 0.1,
          aaColor: [255, 255, 0], // Yellow for anti-aliasing differences
          diffColor: [255, 0, 255], // Magenta for actual differences
          diffColorAlt: [0, 255, 255] // Cyan for alternative differences
        }
      );
      
      const totalPixels = baseline.width * baseline.height;
      const diffPercentage = (pixelDifference / totalPixels) * 100;
      
      result.pixelDifference = pixelDifference;
      result.diffPercentage = diffPercentage;
      result.identical = pixelDifference === 0;
      result.passed = diffPercentage <= threshold;
      
      // Save diff image if differences exist
      if (pixelDifference > 0) {
        await fs.writeFile(diffPath, PNG.sync.write(diff));
      }
      
    } catch (error) {
      if (error.code === 'ENOENT') {
        // No baseline exists, create one
        await fs.copyFile(currentPath, baselinePath);
        result.baselineExists = false;
        result.isNewBaseline = true;
        result.passed = true;
      } else {
        result.error = error.message;
        result.passed = false;
      }
    }
    
    // Store result for reporting
    this.comparisonResults.push(result);
    
    return result;
  }
  
  /**
   * Generate comprehensive HTML report
   */
  async generateHTMLReport() {
    const reportPath = path.join(this.reportsDir, 'layout-regression.html');
    const timestamp = new Date().toISOString();
    
    // Group results by page and theme
    const groupedResults = this.groupResultsByCategory();
    
    // Calculate statistics
    const stats = this.calculateStatistics();
    
    const htmlContent = this.generateHTMLContent({
      timestamp,
      stats,
      groupedResults,
      comparisonResults: this.comparisonResults
    });
    
    await fs.writeFile(reportPath, htmlContent);
    return reportPath;
  }
  
  /**
   * Group comparison results by page and theme
   */
  groupResultsByCategory() {
    const grouped = {};
    
    this.comparisonResults.forEach(result => {
      const [page, theme, viewport] = result.testName.split('_');
      
      if (!grouped[page]) grouped[page] = {};
      if (!grouped[page][theme]) grouped[page][theme] = {};
      
      grouped[page][theme][viewport] = result;
    });
    
    return grouped;
  }
  
  /**
   * Calculate test statistics
   */
  calculateStatistics() {
    const total = this.comparisonResults.length;
    const passed = this.comparisonResults.filter(r => r.passed).length;
    const failed = total - passed;
    const newBaselines = this.comparisonResults.filter(r => r.isNewBaseline).length;
    
    const avgDiffPercentage = this.comparisonResults.reduce(
      (sum, r) => sum + r.diffPercentage, 0
    ) / total;
    
    return {
      total,
      passed,
      failed,
      newBaselines,
      passRate: ((passed / total) * 100).toFixed(1),
      avgDiffPercentage: avgDiffPercentage.toFixed(3)
    };
  }
  
  /**
   * Generate HTML report content
   */
  generateHTMLContent({ timestamp, stats, groupedResults, comparisonResults }) {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>감자토끼 가계부 - Visual Regression Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Kanit', 'Malgun Gothic', Dotum, sans-serif; 
            line-height: 1.6; 
            color: #333;
            background: #f5f5f5;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        
        /* Header */
        .header {
            background: linear-gradient(135deg, #1FC7D4 0%, #33E1ED 100%);
            color: white;
            padding: 30px 0;
            margin-bottom: 30px;
        }
        .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .header .subtitle { opacity: 0.9; font-size: 1.1rem; }
        
        /* Statistics */
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .stat-number.success { color: #28a745; }
        .stat-number.danger { color: #dc3545; }
        .stat-number.info { color: #17a2b8; }
        .stat-number.warning { color: #ffc107; }
        
        /* Results Table */
        .results-table {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        .results-table h2 {
            background: #2c3e50;
            color: white;
            padding: 15px 20px;
            margin: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
        }
        tr:hover {
            background: #f8f9fa;
        }
        
        /* Status badges */
        .status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.85rem;
            font-weight: 500;
        }
        .status.passed { background: #d4edda; color: #155724; }
        .status.failed { background: #f8d7da; color: #721c24; }
        .status.new { background: #d1ecf1; color: #0c5460; }
        
        /* Image comparison */
        .image-comparison {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }
        .image-box {
            text-align: center;
            background: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
        }
        .image-box img {
            max-width: 100%;
            height: auto;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .image-label {
            font-weight: 600;
            margin-bottom: 8px;
            color: #495057;
        }
        
        /* Collapsible sections */
        .collapsible {
            margin-bottom: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .collapsible-header {
            background: #e9ecef;
            padding: 15px 20px;
            cursor: pointer;
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .collapsible-header:hover { background: #dee2e6; }
        .collapsible-content {
            padding: 20px;
            display: none;
        }
        .collapsible.active .collapsible-content {
            display: block;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .container { padding: 10px; }
            .header h1 { font-size: 2rem; }
            .image-comparison {
                grid-template-columns: 1fr;
            }
            table { font-size: 0.9rem; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>📊 Visual Regression Report</h1>
            <div class="subtitle">감자토끼 가계부 - CSS 리팩토링 검증 결과</div>
            <div style="margin-top: 15px; opacity: 0.8;">
                <strong>Generated:</strong> ${timestamp}
            </div>
        </div>
    </div>

    <div class="container">
        <!-- Statistics Overview -->
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number info">${stats.total}</div>
                <div>Total Tests</div>
            </div>
            <div class="stat-card">
                <div class="stat-number success">${stats.passed}</div>
                <div>Passed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number danger">${stats.failed}</div>
                <div>Failed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number warning">${stats.newBaselines}</div>
                <div>New Baselines</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.passRate}%</div>
                <div>Pass Rate</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.avgDiffPercentage}%</div>
                <div>Avg Difference</div>
            </div>
        </div>

        <!-- Detailed Results -->
        <div class="results-table">
            <h2>🔍 Detailed Test Results</h2>
            <table>
                <thead>
                    <tr>
                        <th>Test Name</th>
                        <th>Status</th>
                        <th>Difference %</th>
                        <th>Pixel Diff</th>
                        <th>Screenshots</th>
                    </tr>
                </thead>
                <tbody>
                    ${comparisonResults.map(result => `
                        <tr>
                            <td><strong>${result.testName}</strong></td>
                            <td>
                                <span class="status ${result.isNewBaseline ? 'new' : (result.passed ? 'passed' : 'failed')}">
                                    ${result.isNewBaseline ? 'NEW' : (result.passed ? 'PASS' : 'FAIL')}
                                </span>
                            </td>
                            <td>${result.diffPercentage.toFixed(3)}%</td>
                            <td>${result.pixelDifference.toLocaleString()}</td>
                            <td>
                                ${!result.isNewBaseline && result.pixelDifference > 0 ? 
                                    `<a href="#comparison-${result.testName}">View Comparison</a>` : 
                                    'No differences'
                                }
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Image Comparisons for Failed Tests -->
        ${comparisonResults.filter(r => !r.passed && !r.isNewBaseline).map(result => `
            <div id="comparison-${result.testName}" class="collapsible">
                <div class="collapsible-header" onclick="toggleCollapsible(this)">
                    <h3>❌ ${result.testName} - ${result.diffPercentage.toFixed(3)}% difference</h3>
                    <span>▼</span>
                </div>
                <div class="collapsible-content">
                    <div class="image-comparison">
                        <div class="image-box">
                            <div class="image-label">Baseline (Expected)</div>
                            <img src="../screenshots/baseline/${result.testName}.png" alt="Baseline" />
                        </div>
                        <div class="image-box">
                            <div class="image-label">Current (Actual)</div>
                            <img src="../screenshots/current/${result.testName}.png" alt="Current" />
                        </div>
                        <div class="image-box">
                            <div class="image-label">Difference</div>
                            <img src="../screenshots/diffs/${result.testName}.png" alt="Difference" />
                        </div>
                    </div>
                </div>
            </div>
        `).join('')}

        <!-- Footer -->
        <div style="text-align: center; margin: 40px 0; color: #666;">
            <p>🥔🐰 감자토끼 가계부 Visual Regression Testing</p>
            <p>Generated by enhanced Playwright testing system</p>
        </div>
    </div>

    <script>
        function toggleCollapsible(header) {
            const collapsible = header.parentElement;
            const icon = header.querySelector('span');
            
            collapsible.classList.toggle('active');
            icon.textContent = collapsible.classList.contains('active') ? '▲' : '▼';
        }
        
        // Auto-expand failed tests
        document.addEventListener('DOMContentLoaded', function() {
            const failedSections = document.querySelectorAll('.collapsible');
            failedSections.forEach(section => {
                if (section.id.includes('comparison-')) {
                    section.classList.add('active');
                    section.querySelector('span').textContent = '▲';
                }
            });
        });
    </script>
</body>
</html>`;
  }
  
  /**
   * Reset comparison results
   */
  reset() {
    this.comparisonResults = [];
  }
}

module.exports = ScreenshotHelper;