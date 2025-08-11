/**
 * Multi-Theme System Manager
 * Manages theme switching and system preference detection
 */

class ThemeManager {
  constructor() {
    this.themes = ['light', 'dark', 'hc'];
    this.currentTheme = this.getInitialTheme();
    this.mediaQueries = {
      dark: window.matchMedia('(prefers-color-scheme: dark)'),
      highContrast: window.matchMedia('(prefers-contrast: high)'),
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)')
    };
    
    this.init();
  }

  /**
   * Initialize theme system
   */
  init() {
    // Apply initial theme without transition
    document.documentElement.setAttribute('data-theme-initializing', '');
    this.applyTheme(this.currentTheme);
    
    // Remove initialization flag after a short delay
    requestAnimationFrame(() => {
      document.documentElement.removeAttribute('data-theme-initializing');
    });

    // Set up media query listeners
    this.setupMediaQueryListeners();
    
    // Set up storage listener for cross-tab synchronization
    this.setupStorageListener();
  }

  /**
   * Get initial theme from storage or system preferences
   */
  getInitialTheme() {
    // First check localStorage
    const stored = localStorage.getItem('theme');
    if (stored && this.themes.includes(stored)) {
      return stored;
    }

    // Then check system preferences
    if (this.mediaQueries.highContrast.matches) {
      return 'hc';
    }
    
    if (this.mediaQueries.dark.matches) {
      return 'dark';
    }

    return 'light'; // Default fallback
  }

  /**
   * Apply theme to document
   */
  applyTheme(theme) {
    if (!this.themes.includes(theme)) {
      console.warn(`Unknown theme: ${theme}. Falling back to light.`);
      theme = 'light';
    }

    // Update document attribute
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update current theme
    this.currentTheme = theme;
    
    // Store preference
    localStorage.setItem('theme', theme);
    
    // Dispatch theme change event
    this.dispatchThemeChangeEvent(theme);
    
    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);

    console.log(`Theme applied: ${theme}`);
  }

  /**
   * Switch to next theme in cycle
   */
  cycleTheme() {
    const currentIndex = this.themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    this.setTheme(this.themes[nextIndex]);
  }

  /**
   * Set specific theme
   */
  setTheme(theme) {
    this.applyTheme(theme);
  }

  /**
   * Get current theme
   */
  getTheme() {
    return this.currentTheme;
  }

  /**
   * Toggle between light and dark (ignoring high contrast)
   */
  toggleDarkMode() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * Set up media query listeners for system preference changes
   */
  setupMediaQueryListeners() {
    // Dark mode preference change
    this.mediaQueries.dark.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a theme
      if (!localStorage.getItem('theme')) {
        if (this.mediaQueries.highContrast.matches) {
          this.applyTheme('hc');
        } else if (e.matches) {
          this.applyTheme('dark');
        } else {
          this.applyTheme('light');
        }
      }
    });

    // High contrast preference change
    this.mediaQueries.highContrast.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a theme
      if (!localStorage.getItem('theme')) {
        if (e.matches) {
          this.applyTheme('hc');
        } else if (this.mediaQueries.dark.matches) {
          this.applyTheme('dark');
        } else {
          this.applyTheme('light');
        }
      }
    });

    // Reduced motion preference change
    this.mediaQueries.reducedMotion.addEventListener('change', (e) => {
      if (e.matches) {
        document.documentElement.style.setProperty('--theme-transition', 'none');
      } else {
        document.documentElement.style.removeProperty('--theme-transition');
      }
    });
  }

  /**
   * Set up storage listener for cross-tab theme synchronization
   */
  setupStorageListener() {
    window.addEventListener('storage', (e) => {
      if (e.key === 'theme' && e.newValue && this.themes.includes(e.newValue)) {
        this.applyTheme(e.newValue);
      }
    });
  }

  /**
   * Dispatch custom theme change event
   */
  dispatchThemeChangeEvent(theme) {
    const event = new CustomEvent('themechange', {
      detail: { 
        theme,
        previousTheme: this.currentTheme !== theme ? this.currentTheme : null
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * Update meta theme-color for mobile browsers
   */
  updateMetaThemeColor(theme) {
    let themeColor = '#FAF9FA'; // Light theme default
    
    switch (theme) {
      case 'dark':
        themeColor = '#0E0E0E';
        break;
      case 'hc':
        themeColor = '#FFFFFF';
        break;
      default:
        themeColor = '#FAF9FA';
    }

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = themeColor;
  }

  /**
   * Get theme-specific color value
   */
  getThemeColor(colorName) {
    const rootStyles = getComputedStyle(document.documentElement);
    return rootStyles.getPropertyValue(`--color-${colorName}`).trim();
  }

  /**
   * Check if current theme is dark
   */
  isDarkTheme() {
    return this.currentTheme === 'dark';
  }

  /**
   * Check if current theme is high contrast
   */
  isHighContrastTheme() {
    return this.currentTheme === 'hc';
  }

  /**
   * Get system preference for color scheme
   */
  getSystemPreference() {
    if (this.mediaQueries.highContrast.matches) return 'hc';
    if (this.mediaQueries.dark.matches) return 'dark';
    return 'light';
  }

  /**
   * Reset theme to system preference
   */
  resetToSystemPreference() {
    localStorage.removeItem('theme');
    const systemTheme = this.getSystemPreference();
    this.applyTheme(systemTheme);
  }

  /**
   * Calculate contrast ratio between two colors (basic implementation)
   */
  calculateContrastRatio(color1, color2) {
    // This is a simplified implementation
    // In a real application, you might want to use a more robust color library
    const getLuminance = (color) => {
      // Remove # and convert to RGB
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;
      
      // Calculate relative luminance
      const sRGB = [r, g, b].map((c) => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * Auto-adjust colors for better contrast
   */
  autoAdjustContrast(backgroundColor, textColor, targetRatio = 4.5) {
    const currentRatio = this.calculateContrastRatio(backgroundColor, textColor);
    
    if (currentRatio < targetRatio) {
      console.warn(`Low contrast detected: ${currentRatio.toFixed(2)}:1. Target: ${targetRatio}:1`);
      // In a real implementation, you would adjust the colors here
      return {
        backgroundColor,
        textColor,
        adjusted: false,
        ratio: currentRatio
      };
    }
    
    return {
      backgroundColor,
      textColor,
      adjusted: false,
      ratio: currentRatio
    };
  }

  /**
   * Get accessibility information for current theme
   */
  getAccessibilityInfo() {
    return {
      theme: this.currentTheme,
      isDark: this.isDarkTheme(),
      isHighContrast: this.isHighContrastTheme(),
      prefersReducedMotion: this.mediaQueries.reducedMotion.matches,
      systemPreference: this.getSystemPreference(),
      wcagLevel: this.isHighContrastTheme() ? 'AAA' : 'AA'
    };
  }
}

// Initialize theme manager when DOM is loaded
let themeManager;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
    window.themeManager = themeManager; // Make globally available
  });
} else {
  themeManager = new ThemeManager();
  window.themeManager = themeManager; // Make globally available
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}

/**
 * Usage Examples:
 * 
 * // Basic usage
 * window.themeManager.setTheme('dark');
 * window.themeManager.cycleTheme();
 * window.themeManager.toggleDarkMode();
 * 
 * // Listen for theme changes
 * document.addEventListener('themechange', (e) => {
 *   console.log('Theme changed to:', e.detail.theme);
 * });
 * 
 * // Check current theme
 * const isDark = window.themeManager.isDarkTheme();
 * const currentTheme = window.themeManager.getTheme();
 * 
 * // Get theme-specific colors
 * const primaryColor = window.themeManager.getThemeColor('primary');
 * 
 * // Reset to system preference
 * window.themeManager.resetToSystemPreference();
 * 
 * // Get accessibility info
 * const a11yInfo = window.themeManager.getAccessibilityInfo();
 */