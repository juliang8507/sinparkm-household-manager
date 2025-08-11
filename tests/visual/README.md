# 감자토끼 가계부 - Visual Regression Testing System

Comprehensive visual regression testing system to validate CSS refactoring and ensure consistent UI across all devices, themes, and browsers.

## Overview

This testing system validates the major CSS refactoring that implemented 7 key improvements:

1. **Pixel units → rem conversion** - Improved scalability and accessibility
2. **Flex → Grid optimization** - Enhanced layout control and responsiveness  
3. **Safe area enhancements** - Better mobile device compatibility
4. **Image aspect-ratio/object-fit** - Consistent image rendering
5. **vh → dvh conversion** - Modern viewport handling
6. **!important reduction** - Cleaner CSS specificity
7. **Design token implementation** - 2,193 tokens for consistent theming

## Test Coverage

### 📱 Viewports Tested
- **360px** - Mobile (기본 모바일)
- **414px** - iPhone (아이폰)  
- **768px** - Tablet (태블릿)
- **1024px** - Desktop (데스크톱)
- **1280px** - Large Desktop (대형 데스크톱)

### 🎨 Themes Tested
- **Light Mode** (라이트 모드) - Default bright theme
- **Dark Mode** (다크 모드) - Dark theme for low-light environments
- **High Contrast** (고대비 모드) - Accessibility-focused high contrast theme

### 📄 Pages Covered
- **index.html** - Main dashboard with stats and character animations
- **transaction-form.html** - Transaction input form with validation
- **transaction-history.html** - Transaction history list with filtering
- **meal-planning.html** - Meal planning interface with calendar

### 🌐 Browsers Supported
- **Chromium** - Chrome/Edge compatibility
- **Firefox** - Mozilla Firefox compatibility  
- **WebKit** - Safari compatibility

## Testing Architecture

### Core Components

#### 1. Viewport Configuration (`config/viewport-config.js`)
- Comprehensive device configurations with Korean locale support
- Theme definitions with proper color mappings
- Page-specific wait conditions and element selectors
- Test combination generator for systematic coverage

#### 2. Screenshot Helper (`helpers/screenshot-helper.js`)
- Korean font loading and stabilization
- Dynamic content hiding for consistent screenshots
- Pixel-perfect image comparison with detailed analysis
- HTML report generation with visual comparisons

#### 3. Playwright Tests (`visual-regression-playwright.test.js`)
- Cross-browser testing with modern Playwright
- Theme transition validation
- Interactive state testing
- Responsive breakpoint validation

#### 4. Test Runner (`run-visual-tests.js`)
- Orchestrates comprehensive testing workflow
- Supports both Playwright and Puppeteer for compatibility
- Generates unified HTML reports
- Handles baseline management

## Usage

### Quick Start

1. **Install Dependencies:**
   \`\`\`bash
   npm install
   npm run playwright:install
   \`\`\`

2. **Start Development Server:**
   \`\`\`bash
   npm start
   \`\`\`

3. **Run Visual Tests:**
   \`\`\`bash
   # Run comprehensive visual regression tests
   npm run test:visual:comprehensive
   
   # Run only Playwright tests
   npm run test:visual:playwright
   
   # Update baseline images (first run or after changes)
   npm run test:visual:update-baselines
   \`\`\`

### Test Commands

| Command | Description |
|---------|-------------|
| \`npm run test:visual:comprehensive\` | Run all visual tests with HTML report |
| \`npm run test:visual:playwright\` | Run only Playwright tests |
| \`npm run test:visual:update-baselines\` | Update baseline screenshots |
| \`npm run test:visual\` | Run legacy Puppeteer tests |

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| \`BASE_URL\` | \`http://localhost:3000\` | Test server URL |
| \`BROWSERS\` | \`chromium,firefox\` | Browsers to test |
| \`DIFF_THRESHOLD\` | \`0.1\` | Pixel difference threshold (%) |
| \`UPDATE_BASELINES\` | \`false\` | Update baseline images |
| \`PARALLEL\` | \`true\` | Run tests in parallel |

## Test Scenarios

### 1. Basic Visual Regression
- **Purpose:** Ensure UI consistency across refactoring
- **Coverage:** All page/theme/viewport combinations
- **Success Criteria:** <0.1% visual difference from baseline

### 2. Theme Switching
- **Purpose:** Validate theme transitions work properly
- **Coverage:** Light → Dark → High Contrast transitions
- **Success Criteria:** Proper CSS variables applied, no visual artifacts

### 3. Interactive States
- **Purpose:** Test form interactions and validation states
- **Coverage:** Empty forms, filled forms, validation errors
- **Success Criteria:** Consistent state rendering across browsers

### 4. Responsive Breakpoints
- **Purpose:** Validate responsive design works across screen sizes
- **Coverage:** Portrait/landscape orientations, all major breakpoints
- **Success Criteria:** Proper layout adaptation, no overflow issues

### 5. Accessibility Validation
- **Purpose:** Ensure high contrast theme meets accessibility standards
- **Coverage:** High contrast theme on all pages
- **Success Criteria:** Proper contrast ratios, clear visual hierarchy

## Korean Application Support

### Font Loading
- **Primary Font:** Kanit (web font)
- **Fallbacks:** Malgun Gothic, Dotum, AppleGothic
- **Locale:** ko-KR with proper timezone (Asia/Seoul)
- **Encoding:** UTF-8 with proper Korean character support

### Content Stabilization
- **Dynamic Elements:** Timestamps, loading states, animations
- **Korean Text:** Proper rendering validation for "감자토끼 가계부"
- **Character Stability:** Potato (🥔) and Rabbit (🐰) character rendering

## Report Generation

### HTML Report Features
- **Visual Overview:** Statistics dashboard with pass/fail metrics
- **Screenshot Gallery:** Organized by page, theme, and viewport
- **Side-by-Side Comparisons:** Before/after views for failed tests
- **Diff Highlighting:** Visual differences marked in magenta/cyan
- **Responsive Design:** Mobile-friendly report viewing

### Report Location
- **Main Report:** \`tests/reports/layout-regression.html\`
- **Playwright Report:** \`tests/reports/playwright-report/\`
- **Screenshots:** \`tests/screenshots/\` (baseline, current, diffs)

## Troubleshooting

### Common Issues

#### 1. Server Not Running
\`\`\`bash
# Ensure development server is running
npm start
\`\`\`

#### 2. Font Loading Issues
- Wait time increased for Korean fonts
- Fallback fonts configured for cross-platform compatibility
- Check network connectivity for Google Fonts

#### 3. Screenshot Differences
- Check if content is truly dynamic (timestamps, etc.)
- Verify theme is properly applied
- Consider updating baselines if changes are intentional

#### 4. Browser Installation
\`\`\`bash
# Install Playwright browsers
npm run playwright:install
npm run playwright:install-deps
\`\`\`

## Continuous Integration

### CI Configuration
- **Headless Mode:** Automatically enabled in CI environments
- **Parallel Execution:** Reduced to 2 workers on CI
- **Baseline Management:** Baselines stored in version control
- **Report Artifacts:** HTML reports saved as CI artifacts

### GitHub Actions Example
\`\`\`yaml
- name: Run Visual Regression Tests
  run: |
    npm install
    npm run playwright:install
    npm start &
    sleep 10
    npm run test:visual:comprehensive
  
- name: Upload Test Results
  uses: actions/upload-artifact@v3
  with:
    name: visual-regression-report
    path: tests/reports/
\`\`\`

## Integration with Existing Tests

This visual regression system integrates with the existing test suite:

- **Accessibility Tests:** Validates high contrast theme accessibility
- **Keyboard Navigation:** Visual validation of focus states
- **Theme Testing:** Comprehensive theme switching validation
- **Performance Tests:** Validates optimizations don't break visual design

## Best Practices

### When to Update Baselines
- ✅ After intentional design changes
- ✅ After CSS refactoring (like this implementation)
- ✅ When adding new features
- ❌ For temporary content changes
- ❌ For minor pixel differences

### Test Maintenance
- Review failed tests carefully before updating baselines
- Ensure Korean font loading is consistent across environments
- Keep test data stable (avoid dynamic timestamps)
- Regularly audit test coverage for new pages/components

## Performance Considerations

### Optimization Features
- **Parallel Execution:** Multiple browsers tested simultaneously
- **Image Compression:** PNG optimization for faster comparisons
- **Selective Testing:** Run specific browsers or pages when needed
- **Incremental Updates:** Only test changed components when possible

### Resource Usage
- **Disk Space:** ~50MB for full baseline set
- **Memory:** ~2GB for parallel browser instances
- **CPU:** High during screenshot generation and comparison
- **Network:** Minimal after initial font downloads

---

## 🥔🐰 감자토끼 가계부 Visual Testing

This comprehensive visual regression testing system ensures that the major CSS refactoring maintains visual consistency while improving performance, accessibility, and responsive design. The system provides confidence that all 2,193 design tokens work correctly across all supported devices, themes, and browsers.

For questions or issues, please check the troubleshooting section above or review the generated HTML reports for detailed visual feedback.