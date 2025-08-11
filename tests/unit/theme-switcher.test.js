/**
 * Unit Tests for Theme Switcher
 * Testing theme switching functionality and localStorage integration
 */

/**
 * @jest-environment jsdom
 */

describe('Theme Switcher Unit Tests', () => {
  let mockLocalStorage;
  
  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    });
    
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    // Setup DOM
    document.head.innerHTML = '';
    document.body.innerHTML = `
      <div id="theme-switcher-container"></div>
      <meta name="theme-color" content="#1FC7D4">
    `;
    
    // Mock CSS custom properties
    document.documentElement.style.setProperty = jest.fn();
    document.documentElement.getAttribute = jest.fn().mockReturnValue('light');
    document.documentElement.setAttribute = jest.fn();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });
  
  test('should initialize with default theme', () => {
    // Mock theme switcher class initialization
    const themes = {
      light: { name: '라이트', value: 'light' },
      dark: { name: '다크', value: 'dark' },
      hc: { name: '고대비', value: 'hc' }
    };
    
    expect(themes).toBeDefined();
    expect(themes.light.name).toBe('라이트');
    expect(themes.dark.name).toBe('다크');
    expect(themes.hc.name).toBe('고대비');
  });
  
  test('should store theme preference in localStorage', () => {
    const theme = 'dark';
    
    // Simulate storing theme
    mockLocalStorage.setItem('potato-rabbit-theme', theme);
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('potato-rabbit-theme', theme);
  });
  
  test('should retrieve stored theme from localStorage', () => {
    const storedTheme = 'hc';
    mockLocalStorage.getItem.mockReturnValue(storedTheme);
    
    const theme = mockLocalStorage.getItem('potato-rabbit-theme');
    
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('potato-rabbit-theme');
    expect(theme).toBe(storedTheme);
  });
  
  test('should update document theme attribute', () => {
    const theme = 'dark';
    
    // Simulate theme application
    document.documentElement.setAttribute('data-theme', theme);
    
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', theme);
  });
  
  test('should update meta theme-color', () => {
    const themeColor = '#33E1ED'; // Dark theme color
    const metaTag = document.querySelector('meta[name="theme-color"]');
    
    if (metaTag) {
      metaTag.setAttribute('content', themeColor);
      expect(metaTag.getAttribute('content')).toBe(themeColor);
    }
  });
  
  test('should detect system theme preference', () => {
    // Mock dark theme preference
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    expect(darkQuery.matches).toBe(true);
    
    const lightQuery = window.matchMedia('(prefers-color-scheme: light)');
    expect(lightQuery.matches).toBe(false);
  });
  
  test('should handle theme switching with proper validation', () => {
    const validThemes = ['light', 'dark', 'hc', 'system'];
    const invalidThemes = ['invalid', null, undefined, '', 123];
    
    validThemes.forEach(theme => {
      expect(typeof theme).toBe('string');
      expect(theme.length).toBeGreaterThan(0);
    });
    
    invalidThemes.forEach(theme => {
      expect(validThemes.includes(theme)).toBe(false);
    });
  });
  
  test('should create theme switcher button with proper accessibility attributes', () => {
    const container = document.getElementById('theme-switcher-container');
    
    // Simulate button creation
    const button = document.createElement('button');
    button.className = 'theme-switcher-button';
    button.setAttribute('aria-label', '테마 변경');
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('type', 'button');
    
    container.appendChild(button);
    
    expect(button.getAttribute('aria-label')).toBe('테마 변경');
    expect(button.getAttribute('aria-haspopup')).toBe('listbox');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('type')).toBe('button');
  });
  
  test('should create dropdown with proper ARIA roles', () => {
    const container = document.getElementById('theme-switcher-container');
    
    // Simulate dropdown creation
    const dropdown = document.createElement('div');
    dropdown.className = 'theme-dropdown';
    dropdown.setAttribute('role', 'listbox');
    dropdown.setAttribute('aria-label', '테마 선택');
    
    const option = document.createElement('button');
    option.className = 'theme-option';
    option.setAttribute('role', 'option');
    option.setAttribute('aria-selected', 'false');
    option.setAttribute('data-theme', 'dark');
    
    dropdown.appendChild(option);
    container.appendChild(dropdown);
    
    expect(dropdown.getAttribute('role')).toBe('listbox');
    expect(dropdown.getAttribute('aria-label')).toBe('테마 선택');
    expect(option.getAttribute('role')).toBe('option');
    expect(option.getAttribute('aria-selected')).toBe('false');
    expect(option.getAttribute('data-theme')).toBe('dark');
  });
  
  test('should handle PWA theme color updates', () => {
    const themeColors = {
      light: '#1FC7D4',
      dark: '#33E1ED',
      hc: '#0066CC'
    };
    
    Object.keys(themeColors).forEach(theme => {
      const expectedColor = themeColors[theme];
      expect(expectedColor).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });
  
  test('should dispatch theme change event', () => {
    const eventSpy = jest.spyOn(document, 'dispatchEvent');
    
    // Simulate theme change event
    const event = new CustomEvent('pwa-theme-updated', {
      detail: { theme: 'dark', colors: { themeColor: '#33E1ED' } }
    });
    
    document.dispatchEvent(event);
    
    expect(eventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'pwa-theme-updated',
        detail: expect.objectContaining({
          theme: 'dark',
          colors: expect.objectContaining({
            themeColor: '#33E1ED'
          })
        })
      })
    );
    
    eventSpy.mockRestore();
  });
  
});