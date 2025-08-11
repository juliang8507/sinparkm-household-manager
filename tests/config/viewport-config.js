/**
 * Viewport Configuration for 감자토끼 가계부 Visual Testing
 * Comprehensive device coverage for responsive design validation
 */

const VIEWPORT_CONFIG = {
  // Mobile Devices
  mobile: {
    name: 'mobile',
    width: 360,
    height: 640,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    description: '기본 모바일 (360px)'
  },
  
  iphone: {
    name: 'iphone',
    width: 414,
    height: 896,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    description: 'iPhone (414px)'
  },
  
  // Tablet Devices
  tablet: {
    name: 'tablet',
    width: 768,
    height: 1024,
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    description: 'iPad/태블릿 (768px)'
  },
  
  // Desktop Devices
  desktop: {
    name: 'desktop',
    width: 1024,
    height: 768,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    description: '데스크톱 (1024px)'
  },
  
  desktopLarge: {
    name: 'desktop-large',
    width: 1280,
    height: 720,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    description: '대형 데스크톱 (1280px)'
  }
};

const THEME_CONFIG = {
  light: {
    name: 'light',
    dataTheme: 'light',
    storageKey: 'light',
    description: '라이트 모드',
    themeColor: '#1FC7D4',
    backgroundColor: '#FFFFFF'
  },
  
  dark: {
    name: 'dark',
    dataTheme: 'dark',
    storageKey: 'dark',
    description: '다크 모드',
    themeColor: '#33E1ED',
    backgroundColor: '#1A1A2E'
  },
  
  hc: {
    name: 'hc',
    dataTheme: 'hc',
    storageKey: 'hc',
    description: '고대비 모드',
    themeColor: '#0066CC',
    backgroundColor: '#000000'
  }
};

const PAGE_CONFIG = {
  home: {
    path: '/index.html',
    name: 'home',
    title: '홈 - 감자토끼 가계부',
    description: '메인 대시보드',
    waitForSelectors: ['.stats-grid', '.character-container'],
    hideSelectors: ['[data-testid="timestamp"]', '.loading-spinner']
  },
  
  transactionForm: {
    path: '/transaction-form.html',
    name: 'transaction-form',
    title: '거래 등록 - 감자토끼 가계부',
    description: '거래 입력 폼',
    waitForSelectors: ['.transaction-form', '.form-container'],
    hideSelectors: ['[data-testid="current-time"]', '.loading-state']
  },
  
  transactionHistory: {
    path: '/transaction-history.html',
    name: 'transaction-history',
    title: '거래 내역 - 감자토끼 가계부',
    description: '거래 내역 목록',
    waitForSelectors: ['.transaction-list', '.history-container'],
    hideSelectors: ['[data-testid="relative-time"]', '.loading-transactions']
  },
  
  mealPlanning: {
    path: '/meal-planning.html',
    name: 'meal-planning',
    title: '식단 계획 - 감자토끼 가계부',
    description: '식단 관리',
    waitForSelectors: ['.meal-grid', '.planning-container'],
    hideSelectors: ['[data-testid="current-date"]', '.loading-meals']
  }
};

// Browser configurations for cross-browser testing
const BROWSER_CONFIG = {
  chromium: {
    name: 'chromium',
    channel: 'chrome',
    description: 'Chrome/Edge 브라우저'
  },
  
  firefox: {
    name: 'firefox',
    description: 'Firefox 브라우저'
  },
  
  webkit: {
    name: 'webkit',
    description: 'Safari 브라우저'
  }
};

// Test combinations generator
const generateTestCombinations = () => {
  const combinations = [];
  
  Object.values(PAGE_CONFIG).forEach(page => {
    Object.values(THEME_CONFIG).forEach(theme => {
      Object.values(VIEWPORT_CONFIG).forEach(viewport => {
        combinations.push({
          page,
          theme,
          viewport,
          testName: `${page.name}_${theme.name}_${viewport.name}`,
          description: `${page.description} - ${theme.description} - ${viewport.description}`
        });
      });
    });
  });
  
  return combinations;
};

// Critical user journeys for visual testing
const CRITICAL_JOURNEYS = [
  {
    name: 'transaction-flow',
    description: '거래 등록 흐름',
    steps: [
      { page: 'home', action: 'load' },
      { page: 'transactionForm', action: 'navigate' },
      { page: 'transactionForm', action: 'fillForm', data: { amount: '50000', category: 'income' } },
      { page: 'transactionHistory', action: 'navigate' }
    ]
  },
  
  {
    name: 'meal-planning-flow',
    description: '식단 계획 흐름',
    steps: [
      { page: 'home', action: 'load' },
      { page: 'mealPlanning', action: 'navigate' },
      { page: 'mealPlanning', action: 'addMeal', data: { meal: '김치찌개', time: 'dinner' } }
    ]
  },
  
  {
    name: 'theme-switching',
    description: '테마 변경 흐름',
    steps: [
      { page: 'home', theme: 'light' },
      { page: 'home', theme: 'dark' },
      { page: 'home', theme: 'hc' }
    ]
  }
];

module.exports = {
  VIEWPORT_CONFIG,
  THEME_CONFIG,
  PAGE_CONFIG,
  BROWSER_CONFIG,
  CRITICAL_JOURNEYS,
  generateTestCombinations
};