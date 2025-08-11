/**
 * 감자토끼 가계부 - 테마 스위처
 * 라이트/다크/고대비/시스템 테마를 지원하는 접근성 중심 테마 스위처
 */

class ThemeSwitcher {
  constructor(container) {
    this.container = container;
    this.currentTheme = this.getStoredTheme() || 'system';
    this.dropdown = null;
    this.isOpen = false;
    
    this.themes = {
      light: {
        name: '라이트',
        description: '밝은 테마',
        icon: '☀️',
        value: 'light'
      },
      dark: {
        name: '다크',
        description: '어두운 테마',
        icon: '🌙',
        value: 'dark'
      },
      hc: {
        name: '고대비',
        description: '접근성 향상',
        icon: '🔍',
        value: 'hc'
      },
      system: {
        name: '시스템',
        description: '기기 설정 따름',
        icon: '🖥️',
        value: 'system'
      }
    };
    
    this.init();
  }
  
  init() {
    this.createButton();
    this.createDropdown();
    this.bindEvents();
    this.applyTheme(this.currentTheme);
    this.updateButtonIcon();
  }
  
  createButton() {
    const button = document.createElement('button');
    button.className = 'theme-switcher-button';
    button.setAttribute('aria-label', '테마 변경');
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('type', 'button');
    button.innerHTML = `
      <span class="theme-switcher-icon" aria-hidden="true">🌙</span>
      <span class="theme-switcher-label visually-hidden">테마</span>
    `;
    
    this.button = button;
    this.container.appendChild(button);
  }
  
  createDropdown() {
    const dropdown = document.createElement('div');
    dropdown.className = 'theme-dropdown';
    dropdown.setAttribute('role', 'listbox');
    dropdown.setAttribute('aria-label', '테마 선택');
    
    const optionsList = document.createElement('ul');
    optionsList.className = 'theme-options';
    optionsList.setAttribute('role', 'none');
    
    Object.entries(this.themes).forEach(([key, theme]) => {
      const listItem = document.createElement('li');
      listItem.setAttribute('role', 'none');
      
      const option = document.createElement('button');
      option.className = 'theme-option';
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', key === this.currentTheme ? 'true' : 'false');
      option.setAttribute('data-theme', key);
      option.setAttribute('type', 'button');
      
      option.innerHTML = `
        <span class="theme-option-icon" aria-hidden="true">${theme.icon}</span>
        <div class="theme-option-info">
          <div class="theme-option-name">${theme.name}</div>
          <div class="theme-option-description">${theme.description}</div>
        </div>
      `;
      
      if (key === this.currentTheme) {
        option.classList.add('active');
      }
      
      listItem.appendChild(option);
      optionsList.appendChild(listItem);
    });
    
    dropdown.appendChild(optionsList);
    this.dropdown = dropdown;
    this.container.appendChild(dropdown);
  }
  
  bindEvents() {
    // 버튼 클릭으로 드롭다운 토글
    this.button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });
    
    // 키보드 네비게이션
    this.button.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.openDropdown();
        this.focusFirstOption();
      }
    });
    
    // 옵션 클릭
    this.dropdown.addEventListener('click', (e) => {
      const option = e.target.closest('.theme-option');
      if (option) {
        const theme = option.getAttribute('data-theme');
        this.selectTheme(theme);
        this.closeDropdown();
      }
    });
    
    // 옵션 키보드 네비게이션
    this.dropdown.addEventListener('keydown', (e) => {
      this.handleDropdownKeydown(e);
    });
    
    // 외부 클릭으로 드롭다운 닫기
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.closeDropdown();
      }
    });
    
    // ESC 키로 드롭다운 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeDropdown();
        this.button.focus();
      }
    });
    
    // 시스템 테마 변경 감지
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        if (this.currentTheme === 'system') {
          this.applySystemTheme();
        }
      });
    }
  }
  
  toggleDropdown() {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }
  
  openDropdown() {
    this.isOpen = true;
    this.dropdown.classList.add('show');
    this.button.setAttribute('aria-expanded', 'true');
    
    // 애니메이션 후 포커스
    setTimeout(() => {
      const activeOption = this.dropdown.querySelector('.theme-option.active');
      if (activeOption) {
        activeOption.focus();
      }
    }, 100);
  }
  
  closeDropdown() {
    this.isOpen = false;
    this.dropdown.classList.remove('show');
    this.button.setAttribute('aria-expanded', 'false');
  }
  
  focusFirstOption() {
    const firstOption = this.dropdown.querySelector('.theme-option');
    if (firstOption) {
      firstOption.focus();
    }
  }
  
  handleDropdownKeydown(e) {
    const options = Array.from(this.dropdown.querySelectorAll('.theme-option'));
    const currentIndex = options.indexOf(document.activeElement);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % options.length;
        options[nextIndex].focus();
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = currentIndex === 0 ? options.length - 1 : currentIndex - 1;
        options[prevIndex].focus();
        break;
        
      case 'Home':
        e.preventDefault();
        options[0].focus();
        break;
        
      case 'End':
        e.preventDefault();
        options[options.length - 1].focus();
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        const focusedOption = document.activeElement;
        if (focusedOption.classList.contains('theme-option')) {
          const theme = focusedOption.getAttribute('data-theme');
          this.selectTheme(theme);
          this.closeDropdown();
          this.button.focus();
        }
        break;
        
      case 'Tab':
        this.closeDropdown();
        break;
    }
  }
  
  selectTheme(theme) {
    if (theme === this.currentTheme) return;
    
    // 이전 활성 옵션 업데이트
    const prevActive = this.dropdown.querySelector('.theme-option.active');
    if (prevActive) {
      prevActive.classList.remove('active');
      prevActive.setAttribute('aria-selected', 'false');
    }
    
    // 새 활성 옵션 업데이트
    const newActive = this.dropdown.querySelector(`[data-theme="${theme}"]`);
    if (newActive) {
      newActive.classList.add('active');
      newActive.setAttribute('aria-selected', 'true');
    }
    
    this.currentTheme = theme;
    this.storeTheme(theme);
    this.applyTheme(theme);
    this.updateButtonIcon();
    this.announceThemeChange(theme);
  }
  
  applyTheme(theme) {
    // 부드러운 전환을 위한 클래스 추가
    document.body.classList.add('theme-transitioning');
    
    if (theme === 'system') {
      this.applySystemTheme();
    } else {
      document.documentElement.setAttribute('data-theme', theme);
      
      // meta 태그 업데이트
      this.updateMetaThemeColor(theme);
    }
    
    // 전환 애니메이션 완료 후 클래스 제거
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 300);
  }
  
  applySystemTheme() {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', systemTheme);
    this.updateMetaThemeColor(systemTheme);
  }
  
  updateMetaThemeColor(theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const colors = {
        light: '#1FC7D4',
        dark: '#33E1ED',
        hc: '#0066CC'
      };
      metaThemeColor.setAttribute('content', colors[theme] || colors.light);
    }

    // PWA 매니페스트 동기화
    this.updatePWAThemeColors(theme);
  }

  /**
   * PWA 테마 컬러 및 매니페스트 업데이트
   */
  updatePWAThemeColors(theme) {
    const themeColors = {
      light: {
        themeColor: '#1FC7D4',
        backgroundColor: '#FAF9FA'
      },
      dark: {
        themeColor: '#33E1ED', 
        backgroundColor: '#0E0E0E'
      },
      hc: {
        themeColor: '#0066CC',
        backgroundColor: '#FFFFFF'
      }
    };

    const colors = themeColors[theme] || themeColors.light;

    // Service Worker를 통한 매니페스트 업데이트
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'UPDATE_THEME_COLORS',
        themeColor: colors.themeColor,
        backgroundColor: colors.backgroundColor,
        theme: theme
      });
    }

    // 동적 매니페스트 생성 및 업데이트
    this.updateManifestLink(theme, colors);

    // 사용자 정의 이벤트 발생 (PWA 테마 변경)
    document.dispatchEvent(new CustomEvent('pwa-theme-updated', {
      detail: { theme, colors }
    }));
  }

  /**
   * 동적 매니페스트 링크 업데이트
   */
  updateManifestLink(theme, colors) {
    const manifestData = {
      name: "감자토끼 가계부",
      short_name: "감자토끼", 
      description: "감자와 토끼 부부의 친근한 가계부 앱",
      start_url: "/index.html",
      display: "standalone",
      orientation: "portrait",
      theme_color: colors.themeColor,
      background_color: colors.backgroundColor,
      lang: "ko",
      scope: "/",
      categories: ["finance", "productivity"],
      icons: [
        {
          src: "assets/icons/icon-72x72.png",
          sizes: "72x72", 
          type: "image/png",
          purpose: "any maskable"
        },
        {
          src: "assets/icons/icon-96x96.png",
          sizes: "96x96",
          type: "image/png", 
          purpose: "any maskable"
        },
        {
          src: "assets/icons/icon-128x128.png",
          sizes: "128x128",
          type: "image/png",
          purpose: "any maskable"
        },
        {
          src: "assets/icons/icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
          purpose: "any maskable"
        },
        {
          src: "assets/icons/icon-152x152.png",
          sizes: "152x152",
          type: "image/png",
          purpose: "any maskable"
        },
        {
          src: "assets/icons/icon-192x192.png", 
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable"
        },
        {
          src: "assets/icons/icon-384x384.png",
          sizes: "384x384",
          type: "image/png",
          purpose: "any maskable"
        },
        {
          src: "assets/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        }
      ],
      shortcuts: [
        {
          name: "수입 추가",
          short_name: "수입",
          description: "새로운 수입 거래를 빠르게 추가",
          url: "/transaction-form.html?type=income",
          icons: [
            {
              src: "assets/icons/shortcut-income.png",
              sizes: "96x96",
              type: "image/png"
            }
          ]
        },
        {
          name: "지출 추가", 
          short_name: "지출",
          description: "새로운 지출 거래를 빠르게 추가",
          url: "/transaction-form.html?type=expense",
          icons: [
            {
              src: "assets/icons/shortcut-expense.png",
              sizes: "96x96",
              type: "image/png"
            }
          ]
        },
        {
          name: "거래 내역",
          short_name: "내역", 
          description: "모든 거래 내역 확인",
          url: "/transaction-history.html",
          icons: [
            {
              src: "assets/icons/shortcut-history.png",
              sizes: "96x96",
              type: "image/png"
            }
          ]
        }
      ]
    };

    // 기존 매니페스트 링크 찾기 또는 생성
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      document.head.appendChild(manifestLink);
    }

    // 동적 매니페스트 Blob 생성
    const manifestBlob = new Blob([JSON.stringify(manifestData, null, 2)], {
      type: 'application/json'
    });
    const manifestUrl = URL.createObjectURL(manifestBlob);
    
    // 이전 URL 정리 (메모리 누수 방지)
    if (manifestLink.dataset.prevUrl) {
      URL.revokeObjectURL(manifestLink.dataset.prevUrl);
    }
    
    manifestLink.href = manifestUrl;
    manifestLink.dataset.prevUrl = manifestUrl;

    console.log(`PWA 매니페스트 업데이트: ${theme} 테마`);
  }
  
  updateButtonIcon() {
    const icon = this.button.querySelector('.theme-switcher-icon');
    const currentTheme = this.currentTheme === 'system' ? this.getSystemTheme() : this.currentTheme;
    icon.textContent = this.themes[this.currentTheme].icon;
    
    // 버튼 라벨 업데이트
    this.button.setAttribute('aria-label', `현재 테마: ${this.themes[this.currentTheme].name}. 클릭하여 변경`);
  }
  
  getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
  
  storeTheme(theme) {
    try {
      localStorage.setItem('potato-rabbit-theme', theme);
    } catch (e) {
      console.warn('테마 설정을 저장할 수 없습니다:', e);
    }
  }
  
  getStoredTheme() {
    try {
      return localStorage.getItem('potato-rabbit-theme');
    } catch (e) {
      console.warn('저장된 테마 설정을 불러올 수 없습니다:', e);
      return null;
    }
  }
  
  announceThemeChange(theme) {
    const themeName = this.themes[theme].name;
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'visually-hidden';
    announcement.textContent = `테마가 ${themeName}로 변경되었습니다.`;
    
    document.body.appendChild(announcement);
    
    // 안내 메시지 제거
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}

// 페이지 로드 완료 후 테마 스위처 초기화
document.addEventListener('DOMContentLoaded', () => {
  // 헤더의 설정 버튼 옆에 테마 스위처 추가
  const headerContent = document.querySelector('.header-content');
  if (headerContent) {
    // 테마 스위처 컨테이너 생성
    const themeSwitcherContainer = document.createElement('div');
    themeSwitcherContainer.className = 'theme-switcher';
    
    // 설정 버튼 앞에 추가
    const settingsButton = headerContent.querySelector('.settings-button');
    if (settingsButton) {
      headerContent.insertBefore(themeSwitcherContainer, settingsButton);
    } else {
      headerContent.appendChild(themeSwitcherContainer);
    }
    
    // 테마 스위처 초기화
    new ThemeSwitcher(themeSwitcherContainer);
  }
});

// 초기 테마 적용 (깜빡임 방지)
(function() {
  const getStoredTheme = () => {
    try {
      return localStorage.getItem('potato-rabbit-theme');
    } catch (e) {
      return null;
    }
  };
  
  const applyInitialTheme = (theme) => {
    if (theme === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  };
  
  const storedTheme = getStoredTheme() || 'system';
  applyInitialTheme(storedTheme);
})();