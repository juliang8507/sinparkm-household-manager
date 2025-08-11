/**
 * 감자토끼 가계부 - 스타일 가이드 인터랙티브 시스템
 * 테마 전환, 상태 데모, 캐릭터 애니메이션, 토스트 시스템 등을 포함
 */

class StyleGuideInteractive {
  constructor() {
    this.currentTheme = this.getSystemTheme();
    this.motionEnabled = true;
    this.toastContainer = null;
    this.activeToasts = new Set();
    this.init();
  }

  // === INITIALIZATION === //
  init() {
    this.initTheme();
    this.initMotion();
    this.initNavigation();
    this.initCharacterSystem();
    this.initButtonEffects();
    this.initToastSystem();
    this.initColorCopy();
    this.initStateDemo();
    this.initKeyboardNavigation();
    this.initAccessibility();
    
    // Advanced features
    this.initPerformanceMonitoring();
    this.initStateManager();
    this.initLivePreview();
    this.initScrollAnimations();
    this.initColorPaletteGenerator();
    
    console.log('🥔🐰 Style Guide Interactive System Initialized with Advanced Features');
  }

  // === THEME SYSTEM === //
  getSystemTheme() {
    const saved = localStorage.getItem('sg-theme');
    if (saved) return saved;
    
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      return 'hc';
    }
    return 'light';
  }

  initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Apply saved theme
    this.applyTheme(this.currentTheme);
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.cycleTheme();
      });
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('sg-theme')) {
        this.currentTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
      }
    });
  }

  cycleTheme() {
    const themes = ['light', 'dark', 'hc'];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.currentTheme = themes[nextIndex];
    
    this.applyTheme(this.currentTheme);
    this.saveTheme();
    this.showToast('테마가 변경되었습니다', `${this.getThemeName()} 모드로 전환`, 'info');
  }

  applyTheme(theme) {
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    
    // Add initialization class to prevent transitions
    html.setAttribute('data-theme-initializing', '');
    
    // Remove existing theme classes
    html.classList.remove('dark');
    html.removeAttribute('data-theme');
    
    // Apply new theme
    if (theme === 'dark') {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
    } else if (theme === 'hc') {
      html.setAttribute('data-theme', 'hc');
    } else {
      html.setAttribute('data-theme', 'light');
    }

    // Update toggle button icon
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = this.getThemeIcon(theme);
      }
    }

    // Remove initialization class after a brief delay
    setTimeout(() => {
      html.removeAttribute('data-theme-initializing');
    }, 50);

    this.currentTheme = theme;
  }

  getThemeIcon(theme) {
    switch (theme) {
      case 'light': return 'fas fa-sun';
      case 'dark': return 'fas fa-moon';
      case 'hc': return 'fas fa-adjust';
      default: return 'fas fa-sun';
    }
  }

  getThemeName(theme = this.currentTheme) {
    switch (theme) {
      case 'light': return '라이트';
      case 'dark': return '다크';
      case 'hc': return '고대비';
      default: return '라이트';
    }
  }

  saveTheme() {
    localStorage.setItem('sg-theme', this.currentTheme);
  }

  // === MOTION SYSTEM === //
  initMotion() {
    const motionToggle = document.getElementById('motionToggle');
    const savedMotion = localStorage.getItem('sg-motion');
    
    this.motionEnabled = savedMotion !== null ? savedMotion === 'true' : true;
    this.applyMotionPreference();

    if (motionToggle) {
      motionToggle.addEventListener('click', () => {
        this.toggleMotion();
      });
    }
  }

  toggleMotion() {
    this.motionEnabled = !this.motionEnabled;
    this.applyMotionPreference();
    localStorage.setItem('sg-motion', this.motionEnabled.toString());
    
    const status = this.motionEnabled ? '활성화' : '비활성화';
    this.showToast('애니메이션 설정', `모션이 ${status}되었습니다`, 'info');
  }

  applyMotionPreference() {
    const motionToggle = document.getElementById('motionToggle');
    const root = document.documentElement;
    
    if (this.motionEnabled) {
      root.style.setProperty('animation-play-state', 'running');
      if (motionToggle) {
        const icon = motionToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-play';
      }
    } else {
      root.style.setProperty('animation-play-state', 'paused');
      if (motionToggle) {
        const icon = motionToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-pause';
      }
    }
  }

  // === NAVIGATION SYSTEM === //
  initNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    navTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchTab(tab, navTabs, tabContents);
      });
    });

    // Keyboard navigation for tabs
    navTabs.forEach(tab => {
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.switchTab(tab, navTabs, tabContents);
        }
      });
    });
  }

  switchTab(activeTab, allTabs, allContents) {
    // Remove active states
    allTabs.forEach(tab => {
      tab.classList.remove('border-potato-500', 'text-potato-600', 'dark:text-potato-400');
      tab.classList.add('border-transparent', 'text-gray-500', 'dark:text-gray-400');
      tab.setAttribute('aria-selected', 'false');
    });

    // Add active state to clicked tab
    activeTab.classList.add('border-potato-500', 'text-potato-600', 'dark:text-potato-400');
    activeTab.classList.remove('border-transparent', 'text-gray-500', 'dark:text-gray-400');
    activeTab.setAttribute('aria-selected', 'true');

    // Hide all tab contents
    allContents.forEach(content => {
      content.classList.add('hidden');
      content.setAttribute('aria-hidden', 'true');
    });

    // Show selected tab content
    const targetTab = activeTab.getAttribute('data-tab');
    const targetContent = document.getElementById(targetTab);
    if (targetContent) {
      targetContent.classList.remove('hidden');
      targetContent.setAttribute('aria-hidden', 'false');
    }

    // Announce tab change for screen readers
    this.announceToScreenReader(`${activeTab.textContent} 탭으로 이동했습니다`);
  }

  // === CHARACTER SYSTEM === //
  initCharacterSystem() {
    const characterReactions = document.querySelectorAll('.character-reaction');
    const reactionMessage = document.getElementById('reactionMessage');
    const reactionText = document.getElementById('reactionText');

    characterReactions.forEach(button => {
      button.addEventListener('click', (e) => {
        this.triggerCharacterReaction(e, reactionMessage, reactionText);
      });

      // Add keyboard support
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.triggerCharacterReaction(e, reactionMessage, reactionText);
        }
      });
    });

    // Auto-animate characters
    this.startCharacterAnimations();
  }

  triggerCharacterReaction(event, messageEl, textEl) {
    const button = event.currentTarget;
    const character = button.getAttribute('data-character');
    const message = button.getAttribute('data-message');
    const characterEl = button.querySelector('[class*="w-"]');

    if (!this.motionEnabled) return;

    // Show reaction message
    if (messageEl && textEl) {
      textEl.textContent = `${character} ${message}`;
      messageEl.classList.remove('hidden');
      messageEl.setAttribute('aria-hidden', 'false');
    }

    // Add bounce animation to character
    if (characterEl) {
      characterEl.classList.add('animate-bounce');
      
      // Add a celebratory effect
      this.createCelebrationEffect(characterEl);
    }

    // Play reaction sound (if available)
    this.playReactionSound(character);

    // Show toast message
    this.showToast('캐릭터 반응', `${character} ${message}`, 'success');

    // Remove animation and message after delay
    setTimeout(() => {
      if (characterEl) characterEl.classList.remove('animate-bounce');
      if (messageEl) {
        messageEl.classList.add('hidden');
        messageEl.setAttribute('aria-hidden', 'true');
      }
    }, 3000);
  }

  createCelebrationEffect(element) {
    if (!this.motionEnabled) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create sparkle particles
    for (let i = 0; i < 6; i++) {
      this.createSparkle(centerX, centerY, i);
    }
  }

  createSparkle(x, y, index) {
    const sparkle = document.createElement('div');
    sparkle.className = 'fixed pointer-events-none z-50';
    sparkle.style.cssText = `
      width: 8px;
      height: 8px;
      background: linear-gradient(45deg, #FFD700, #FFA500);
      border-radius: 50%;
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%);
    `;

    document.body.appendChild(sparkle);

    // Animate sparkle
    const angle = (index * 60) * Math.PI / 180;
    const distance = 30 + Math.random() * 20;
    const duration = 800 + Math.random() * 400;

    sparkle.animate([
      { 
        transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
        opacity: 1 
      },
      { 
        transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1) rotate(180deg)`,
        opacity: 1,
        offset: 0.7
      },
      { 
        transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance * 1.5}px, ${Math.sin(angle) * distance * 1.5}px) scale(0) rotate(360deg)`,
        opacity: 0 
      }
    ], {
      duration: duration,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => {
      sparkle.remove();
    };
  }

  playReactionSound(character) {
    // Web Audio API implementation would go here
    // For now, we'll use a simple beep if available
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = character === '🥔' ? 220 : 330;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
      // Audio not available, silently continue
    }
  }

  startCharacterAnimations() {
    const animatedCharacters = document.querySelectorAll('.animate-pulse-character');
    
    animatedCharacters.forEach((char, index) => {
      // Stagger the animations
      char.style.animationDelay = `${index * 0.2}s`;
    });
  }

  // === BUTTON EFFECTS === //
  initButtonEffects() {
    this.initRippleEffect();
    this.initShimmerEffect();
    this.initHoverEffects();
  }

  initRippleEffect() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('.ripple-button, .sg-button--ripple');
      if (!button || !this.motionEnabled) return;

      this.createRipple(e, button);
    });
  }

  createRipple(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-effect 0.6s linear;
      pointer-events: none;
      z-index: 1;
    `;

    // Ensure button has relative positioning
    const position = getComputedStyle(button).position;
    if (position !== 'relative' && position !== 'absolute') {
      button.style.position = 'relative';
    }
    button.style.overflow = 'hidden';

    button.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  initShimmerEffect() {
    const shimmerButtons = document.querySelectorAll('.shimmer-button, .sg-button--shimmer');
    
    shimmerButtons.forEach(button => {
      let shimmerInterval;

      button.addEventListener('mouseenter', () => {
        if (!this.motionEnabled) return;
        
        shimmerInterval = setInterval(() => {
          const shimmer = button.querySelector('.animate-shimmer, .sg-button--shimmer::before');
          if (shimmer) {
            shimmer.style.animation = 'none';
            shimmer.offsetHeight; // Trigger reflow
            shimmer.style.animation = 'shimmer 1s linear';
          }
        }, 2000);
      });

      button.addEventListener('mouseleave', () => {
        if (shimmerInterval) {
          clearInterval(shimmerInterval);
        }
      });
    });
  }

  initHoverEffects() {
    const interactiveElements = document.querySelectorAll('.sg-button, .sg-card--interactive, .sg-character');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        if (!this.motionEnabled) return;
        element.style.willChange = 'transform, box-shadow';
      });

      element.addEventListener('mouseleave', () => {
        element.style.willChange = 'auto';
      });
    });
  }

  // === TOAST SYSTEM === //
  initToastSystem() {
    // Create toast container if it doesn't exist
    if (!this.toastContainer) {
      this.toastContainer = document.createElement('div');
      this.toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
      this.toastContainer.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.toastContainer);
    }

    // Add toast triggers for demo purposes
    this.addToastTriggers();
  }

  showToast(title, message, type = 'info', duration = 4000) {
    const toastId = Date.now() + Math.random();
    const toast = this.createToastElement(toastId, title, message, type);
    
    this.toastContainer.appendChild(toast);
    this.activeToasts.add(toastId);

    // Animate in
    if (this.motionEnabled) {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      
      requestAnimationFrame(() => {
        toast.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
      });
    }

    // Auto-remove after duration
    setTimeout(() => {
      this.hideToast(toastId);
    }, duration);

    return toastId;
  }

  createToastElement(id, title, message, type) {
    const toast = document.createElement('div');
    toast.className = `sg-toast sg-toast--${type}`;
    toast.setAttribute('data-toast-id', id);
    toast.setAttribute('role', 'alert');
    
    const iconMap = {
      success: 'fas fa-check',
      warning: 'fas fa-exclamation-triangle',
      danger: 'fas fa-times',
      info: 'fas fa-info-circle'
    };

    toast.innerHTML = `
      <div class="sg-toast__icon">
        <i class="${iconMap[type] || iconMap.info}"></i>
      </div>
      <div class="sg-toast__content">
        <div class="sg-toast__title">${title}</div>
        <div class="sg-toast__message">${message}</div>
      </div>
      <button class="ml-auto p-1 hover:bg-black/10 rounded" onclick="styleGuide.hideToast(${id})" aria-label="알림 닫기">
        <i class="fas fa-times text-sm"></i>
      </button>
    `;

    return toast;
  }

  hideToast(toastId) {
    const toast = this.toastContainer.querySelector(`[data-toast-id="${toastId}"]`);
    if (!toast || !this.activeToasts.has(toastId)) return;

    this.activeToasts.delete(toastId);

    if (this.motionEnabled) {
      toast.style.transition = 'all 0.2s ease-in-out';
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      
      setTimeout(() => {
        toast.remove();
      }, 200);
    } else {
      toast.remove();
    }
  }

  addToastTriggers() {
    // Add demo toast buttons
    const createToastButton = (container, text, type) => {
      const button = document.createElement('button');
      button.className = `sg-button sg-button--${type} sg-button--sm`;
      button.textContent = text;
      button.addEventListener('click', () => {
        this.showToast(`${type} 알림`, `${text} 토스트 메시지 예시입니다.`, type);
      });
      container.appendChild(button);
    };

    // Find toast demo sections and add buttons
    const toastSections = document.querySelectorAll('[data-demo="toast"]');
    toastSections.forEach(section => {
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'flex gap-2 mt-4 flex-wrap';
      
      createToastButton(buttonContainer, '성공', 'success');
      createToastButton(buttonContainer, '경고', 'warning');
      createToastButton(buttonContainer, '오류', 'danger');
      createToastButton(buttonContainer, '정보', 'info');
      
      section.appendChild(buttonContainer);
    });
  }

  // === COLOR COPY SYSTEM === //
  initColorCopy() {
    document.addEventListener('click', async (e) => {
      const colorValue = e.target.closest('.sg-color-swatch__value, .font-mono');
      if (!colorValue || !colorValue.textContent.includes('#')) return;

      const colorCode = colorValue.textContent.trim();
      
      try {
        await navigator.clipboard.writeText(colorCode);
        
        // Visual feedback
        const originalText = colorValue.textContent;
        const originalClass = colorValue.className;
        
        colorValue.textContent = 'Copied!';
        colorValue.className += ' bg-green-500 text-white px-2 py-1 rounded';
        
        setTimeout(() => {
          colorValue.textContent = originalText;
          colorValue.className = originalClass;
        }, 1500);

        // Show toast
        this.showToast('컬러 복사됨', `${colorCode}가 클립보드에 복사되었습니다`, 'success', 2000);
        
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = colorCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        this.showToast('컬러 복사됨', `${colorCode}가 클립보드에 복사되었습니다`, 'success', 2000);
      }
    });
  }

  // === STATE DEMONSTRATION === //
  initStateDemo() {
    // Add interactive state toggles
    this.createStateToggles();
    this.createLoadingDemos();
    this.createModalDemo();
  }

  createStateToggles() {
    const stateButtons = document.querySelectorAll('[data-demo-state]');
    
    stateButtons.forEach(button => {
      button.addEventListener('click', () => {
        const state = button.getAttribute('data-demo-state');
        this.toggleButtonState(button, state);
      });
    });
  }

  toggleButtonState(button, state) {
    const states = ['default', 'hover', 'active', 'disabled'];
    const currentIndex = states.indexOf(state);
    const nextIndex = (currentIndex + 1) % states.length;
    const nextState = states[nextIndex];
    
    // Remove current state classes
    button.classList.remove(
      'hover:bg-potato-600', 
      'bg-potato-700', 
      'bg-gray-300', 
      'opacity-50', 
      'cursor-not-allowed'
    );
    
    // Apply next state
    switch (nextState) {
      case 'hover':
        button.classList.add('bg-potato-600');
        break;
      case 'active':
        button.classList.add('bg-potato-700', 'transform', 'scale-95');
        break;
      case 'disabled':
        button.classList.add('bg-gray-300', 'opacity-50', 'cursor-not-allowed');
        button.disabled = true;
        break;
      default:
        button.classList.remove('transform', 'scale-95');
        button.disabled = false;
        break;
    }
    
    button.setAttribute('data-demo-state', nextState);
    
    // Update label
    const label = button.parentElement.querySelector('.sg-demo-state__label');
    if (label) {
      const stateNames = {
        default: '기본 상태',
        hover: '호버 상태',
        active: '활성 상태',
        disabled: '비활성 상태'
      };
      label.textContent = stateNames[nextState];
    }
  }

  createLoadingDemos() {
    const loadingButtons = document.querySelectorAll('[data-loading-demo]');
    
    loadingButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.simulateLoading(button);
      });
    });
  }

  simulateLoading(button) {
    const originalText = button.textContent;
    const originalClass = button.className;
    
    // Add loading state
    button.innerHTML = `
      <div class="sg-spinner sg-spinner--sm mr-2"></div>
      로딩 중...
    `;
    button.disabled = true;
    
    // Simulate async operation
    setTimeout(() => {
      button.textContent = originalText;
      button.className = originalClass;
      button.disabled = false;
      
      this.showToast('작업 완료', '로딩이 완료되었습니다', 'success');
    }, 2000);
  }

  createModalDemo() {
    const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
    const modal = document.getElementById('modal');
    const cancelBtn = document.getElementById('cancelModal');
    const confirmBtn = document.getElementById('confirmModal');
    
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        this.showModal();
      });
    });
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.hideModal();
      });
    }
    
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        this.hideModal();
        this.showToast('확인됨', '작업이 실행되었습니다', 'success');
      });
    }
    
    // Close modal on backdrop click
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideModal();
        }
      });
    }
  }

  showModal() {
    const modal = document.getElementById('modal');
    if (!modal) return;
    
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus management
    const firstFocusable = modal.querySelector('button');
    if (firstFocusable) firstFocusable.focus();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  hideModal() {
    const modal = document.getElementById('modal');
    if (!modal) return;
    
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to trigger if available
    const trigger = document.querySelector('[data-modal-trigger]');
    if (trigger) trigger.focus();
  }

  // === KEYBOARD NAVIGATION === //
  initKeyboardNavigation() {
    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Theme toggle with Ctrl/Cmd + Shift + T
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.cycleTheme();
      }
      
      // Motion toggle with Ctrl/Cmd + Shift + M
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        this.toggleMotion();
      }
      
      // Close modal with Escape
      if (e.key === 'Escape') {
        this.hideModal();
      }
    });

    // Skip link functionality
    this.createSkipLink();
  }

  createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = '메인 콘텐츠로 건너뛰기';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-black px-4 py-2 rounded z-50';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // === ACCESSIBILITY === //
  initAccessibility() {
    this.setupAriaLabels();
    this.setupLiveRegions();
    this.setupFocusManagement();
  }

  setupAriaLabels() {
    // Add missing aria-labels
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', '테마 전환');
    }
    
    const motionToggle = document.getElementById('motionToggle');
    if (motionToggle) {
      motionToggle.setAttribute('aria-label', '애니메이션 토글');
    }
  }

  setupLiveRegions() {
    // Create announcement region for screen readers
    if (!document.getElementById('sr-announcements')) {
      const announcements = document.createElement('div');
      announcements.id = 'sr-announcements';
      announcements.setAttribute('aria-live', 'polite');
      announcements.setAttribute('aria-atomic', 'true');
      announcements.className = 'sr-only';
      document.body.appendChild(announcements);
    }
  }

  setupFocusManagement() {
    // Enhanced focus indicators
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  announceToScreenReader(message) {
    const announcements = document.getElementById('sr-announcements');
    if (announcements) {
      announcements.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        announcements.textContent = '';
      }, 1000);
    }
  }

  // === PERFORMANCE MONITORING === //
  initPerformanceMonitoring() {
    if (!window.performance) return;
    
    this.performanceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.analyzePerformanceEntry(entry);
      }
    });

    try {
      this.performanceObserver.observe({
        entryTypes: ['measure', 'navigation', 'resource', 'paint']
      });
    } catch (e) {
      // Performance Observer not fully supported
    }

    // Monitor memory usage if available
    if (performance.memory) {
      setInterval(() => {
        this.monitorMemoryUsage();
      }, 30000); // Check every 30 seconds
    }

    // FPS monitoring
    this.fpsCounter = new FPSCounter();
    this.fpsCounter.start();
  }

  analyzePerformanceEntry(entry) {
    if (entry.entryType === 'paint') {
      if (entry.name === 'first-contentful-paint') {
        this.logPerformanceMetric('FCP', entry.startTime);
      }
    } else if (entry.entryType === 'navigation') {
      this.logPerformanceMetric('Navigation', entry.duration);
    } else if (entry.entryType === 'resource' && entry.duration > 1000) {
      console.warn(`Slow resource loading: ${entry.name} took ${entry.duration}ms`);
    }
  }

  monitorMemoryUsage() {
    if (!performance.memory) return;
    
    const memory = performance.memory;
    const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
    const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
    const usage = (usedMB / totalMB) * 100;

    if (usage > 80) {
      console.warn(`High memory usage: ${usedMB}MB / ${totalMB}MB (${usage.toFixed(1)}%)`);
      this.showToast('성능 경고', '메모리 사용량이 높습니다', 'warning');
    }
  }

  logPerformanceMetric(name, value) {
    if (!this.performanceMetrics) {
      this.performanceMetrics = {};
    }
    this.performanceMetrics[name] = value;
    
    if (value > 3000) { // Slow performance threshold
      console.warn(`Slow ${name}: ${value.toFixed(2)}ms`);
    }
  }

  // === STATE MANAGEMENT WITH PROXY === //
  initStateManager() {
    this.state = new Proxy({
      theme: this.currentTheme,
      motion: this.motionEnabled,
      currentTab: 'colors',
      selectedColor: null,
      componentStates: {},
      notifications: []
    }, {
      set: (target, property, value) => {
        const oldValue = target[property];
        target[property] = value;
        this.handleStateChange(property, value, oldValue);
        return true;
      },
      get: (target, property) => {
        return target[property];
      }
    });
  }

  handleStateChange(property, newValue, oldValue) {
    if (oldValue === newValue) return;

    switch (property) {
      case 'theme':
        this.onThemeStateChange(newValue);
        break;
      case 'motion':
        this.onMotionStateChange(newValue);
        break;
      case 'currentTab':
        this.onTabStateChange(newValue);
        break;
      case 'selectedColor':
        this.onColorStateChange(newValue);
        break;
    }

    // Emit custom event for state changes
    this.emitStateChange(property, newValue, oldValue);
  }

  onThemeStateChange(theme) {
    this.currentTheme = theme;
    this.applyTheme(theme);
    this.saveTheme();
  }

  onMotionStateChange(enabled) {
    this.motionEnabled = enabled;
    this.applyMotionPreference();
  }

  onTabStateChange(tab) {
    // Update URL hash without triggering navigation
    if (history.replaceState) {
      history.replaceState(null, null, `#${tab}`);
    }
  }

  onColorStateChange(color) {
    if (color) {
      this.highlightColorUsage(color);
    }
  }

  emitStateChange(property, newValue, oldValue) {
    const event = new CustomEvent('stateChange', {
      detail: { property, newValue, oldValue }
    });
    document.dispatchEvent(event);
  }

  // === ENHANCED TOAST SYSTEM === //
  showEnhancedToast(title, message, type = 'info', options = {}) {
    const defaultOptions = {
      duration: 4000,
      showProgress: true,
      actions: [],
      persistent: false,
      priority: 'normal'
    };
    
    const config = { ...defaultOptions, ...options };
    const toastId = Date.now() + Math.random();
    const toast = this.createEnhancedToastElement(toastId, title, message, type, config);
    
    // Priority queue for toasts
    if (config.priority === 'high') {
      this.toastContainer.insertBefore(toast, this.toastContainer.firstChild);
    } else {
      this.toastContainer.appendChild(toast);
    }
    
    this.activeToasts.add(toastId);

    // Animate in
    if (this.motionEnabled) {
      this.animateToastIn(toast);
    }

    // Progress bar animation
    if (config.showProgress && !config.persistent) {
      this.startProgressBar(toast, config.duration);
    }

    // Auto-remove after duration (unless persistent)
    if (!config.persistent) {
      setTimeout(() => {
        this.hideToast(toastId);
      }, config.duration);
    }

    return toastId;
  }

  createEnhancedToastElement(id, title, message, type, config) {
    const toast = document.createElement('div');
    toast.className = `sg-toast sg-toast--${type} sg-toast--enhanced`;
    toast.setAttribute('data-toast-id', id);
    toast.setAttribute('role', 'alert');
    
    const iconMap = {
      success: 'fas fa-check-circle',
      warning: 'fas fa-exclamation-triangle',
      danger: 'fas fa-times-circle',
      info: 'fas fa-info-circle'
    };

    let actionsHTML = '';
    if (config.actions && config.actions.length > 0) {
      actionsHTML = `
        <div class="sg-toast__actions">
          ${config.actions.map(action => `
            <button class="sg-toast__action" onclick="${action.handler}">
              ${action.label}
            </button>
          `).join('')}
        </div>
      `;
    }

    let progressHTML = '';
    if (config.showProgress && !config.persistent) {
      progressHTML = '<div class="sg-toast__progress"><div class="sg-toast__progress-bar"></div></div>';
    }

    toast.innerHTML = `
      <div class="sg-toast__icon">
        <i class="${iconMap[type] || iconMap.info}"></i>
      </div>
      <div class="sg-toast__content">
        <div class="sg-toast__title">${title}</div>
        <div class="sg-toast__message">${message}</div>
        ${actionsHTML}
      </div>
      <button class="sg-toast__close" onclick="styleGuide.hideToast(${id})" aria-label="알림 닫기">
        <i class="fas fa-times"></i>
      </button>
      ${progressHTML}
    `;

    return toast;
  }

  animateToastIn(toast) {
    toast.style.transform = 'translateX(100%) scale(0.8)';
    toast.style.opacity = '0';
    
    requestAnimationFrame(() => {
      toast.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      toast.style.transform = 'translateX(0) scale(1)';
      toast.style.opacity = '1';
    });
  }

  startProgressBar(toast, duration) {
    const progressBar = toast.querySelector('.sg-toast__progress-bar');
    if (!progressBar) return;

    progressBar.style.animation = `toast-progress ${duration}ms linear`;
  }

  // === LIVE CODE PREVIEW === //
  initLivePreview() {
    this.createPreviewContainer();
    this.initCodeEditor();
    this.bindPreviewEvents();
  }

  createPreviewContainer() {
    const previewSection = document.createElement('div');
    previewSection.className = 'sg-live-preview';
    previewSection.innerHTML = `
      <div class="sg-live-preview__header">
        <h3>라이브 미리보기</h3>
        <div class="sg-live-preview__controls">
          <button class="sg-live-preview__refresh" onclick="styleGuide.refreshPreview()">
            <i class="fas fa-refresh"></i> 새로고침
          </button>
          <button class="sg-live-preview__fullscreen" onclick="styleGuide.togglePreviewFullscreen()">
            <i class="fas fa-expand"></i>
          </button>
        </div>
      </div>
      <div class="sg-live-preview__content">
        <div class="sg-live-preview__editor">
          <textarea class="sg-live-preview__code" placeholder="HTML 코드를 입력하세요..."></textarea>
        </div>
        <div class="sg-live-preview__result">
          <iframe class="sg-live-preview__iframe"></iframe>
        </div>
      </div>
    `;

    // Insert into components tab
    const componentsTab = document.getElementById('components');
    if (componentsTab) {
      componentsTab.appendChild(previewSection);
    }
  }

  initCodeEditor() {
    const codeTextarea = document.querySelector('.sg-live-preview__code');
    if (!codeTextarea) return;

    // Basic syntax highlighting simulation
    codeTextarea.addEventListener('input', this.debounce(() => {
      this.updateLivePreview();
    }, 500));

    // Tab support for better coding experience
    codeTextarea.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        e.target.value = e.target.value.substring(0, start) + '  ' + e.target.value.substring(end);
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }
    });
  }

  bindPreviewEvents() {
    // Handle iframe load events and error handling
    const iframe = document.querySelector('.sg-live-preview__iframe');
    if (iframe) {
      iframe.addEventListener('load', () => {
        console.log('Preview updated successfully');
      });
    }
  }

  highlightColorUsage(color) {
    // Find and highlight elements using the selected color
    const elements = document.querySelectorAll('.sg-color-swatch, .sg-component-demo');
    elements.forEach(el => {
      el.classList.toggle('sg-highlight', el.style.backgroundColor === color);
    });
  }

  updateLivePreview() {
    const codeTextarea = document.querySelector('.sg-live-preview__code');
    const iframe = document.querySelector('.sg-live-preview__iframe');
    
    if (!codeTextarea || !iframe) return;

    const code = codeTextarea.value;
    const previewHTML = this.generatePreviewHTML(code);
    
    iframe.srcdoc = previewHTML;
  }

  generatePreviewHTML(userCode) {
    return `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Live Preview</title>
        <link rel="stylesheet" href="css/tokens.css">
        <link rel="stylesheet" href="css/styleguide.css">
        <style>
          body { 
            padding: 20px; 
            font-family: var(--font-family-primary);
            background: var(--color-background);
            color: var(--color-text-primary);
          }
        </style>
      </head>
      <body data-theme="${this.currentTheme}">
        ${userCode}
        <script>
          // Apply current theme to preview
          document.documentElement.className = document.parent?.documentElement?.className || '';
        </script>
      </body>
      </html>
    `;
  }

  refreshPreview() {
    this.updateLivePreview();
    this.showToast('미리보기 새로고침', '라이브 미리보기가 업데이트되었습니다', 'success');
  }

  togglePreviewFullscreen() {
    const preview = document.querySelector('.sg-live-preview');
    if (!preview) return;

    preview.classList.toggle('sg-live-preview--fullscreen');
    
    const button = document.querySelector('.sg-live-preview__fullscreen i');
    if (button) {
      button.className = preview.classList.contains('sg-live-preview--fullscreen') 
        ? 'fas fa-compress' 
        : 'fas fa-expand';
    }
  }

  // === SCROLL ANIMATIONS === //
  initScrollAnimations() {
    if (!window.IntersectionObserver) return;

    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElementIntoView(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    // Observe scroll animation targets
    document.querySelectorAll('.sg-animate-on-scroll').forEach(el => {
      this.scrollObserver.observe(el);
    });
  }

  animateElementIntoView(element) {
    if (!this.motionEnabled) {
      element.classList.add('sg-animate-visible');
      return;
    }

    element.style.willChange = 'transform, opacity';
    element.classList.add('sg-animate-in');
    
    // Clean up after animation
    setTimeout(() => {
      element.style.willChange = 'auto';
      element.classList.add('sg-animate-visible');
    }, 600);
  }

  // === COLOR PALETTE GENERATION === //
  initColorPaletteGenerator() {
    this.colorGenerator = new ColorPaletteGenerator();
    this.addColorGeneratorUI();
  }

  addColorGeneratorUI() {
    const colorSection = document.getElementById('colors');
    if (!colorSection) return;

    const generatorHTML = `
      <div class="sg-color-generator">
        <div class="sg-color-generator__header">
          <h3>컬러 팔레트 생성기</h3>
          <button class="sg-button sg-button--sm" onclick="styleGuide.generateRandomPalette()">
            <i class="fas fa-random"></i> 랜덤 생성
          </button>
        </div>
        <div class="sg-color-generator__input">
          <input type="color" id="baseColor" value="#8B4513" class="sg-color-picker">
          <button onclick="styleGuide.generateFromBase()" class="sg-button sg-button--primary">
            팔레트 생성
          </button>
        </div>
        <div class="sg-generated-palette" id="generatedPalette"></div>
      </div>
    `;

    colorSection.insertAdjacentHTML('beforeend', generatorHTML);
  }

  generateRandomPalette() {
    const palette = this.colorGenerator.generateRandomPalette();
    this.displayGeneratedPalette(palette);
    this.showToast('팔레트 생성', '새로운 컬러 팔레트가 생성되었습니다', 'success');
  }

  generateFromBase() {
    const baseColor = document.getElementById('baseColor')?.value || '#8B4513';
    const palette = this.colorGenerator.generateHarmoniousPalette(baseColor);
    this.displayGeneratedPalette(palette);
  }

  displayGeneratedPalette(palette) {
    const container = document.getElementById('generatedPalette');
    if (!container) return;

    container.innerHTML = palette.map(color => `
      <div class="sg-generated-color" style="background-color: ${color}">
        <span class="sg-generated-color__value">${color}</span>
      </div>
    `).join('');
  }

  // === ENHANCED THEME EXPORT === //
  exportThemeConfiguration() {
    const config = this.generateThemeConfig();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `potato-rabbit-theme-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    this.showEnhancedToast(
      '테마 내보내기',
      '테마 설정이 JSON 파일로 저장되었습니다',
      'success',
      { showProgress: true, duration: 3000 }
    );
  }

  generateThemeConfig() {
    return {
      name: 'Potato Rabbit Style Guide',
      version: '1.0.0',
      theme: this.currentTheme,
      settings: {
        motion: this.motionEnabled,
        performanceMetrics: this.performanceMetrics || {}
      },
      colors: this.extractCSSVariables(),
      components: this.getComponentStates(),
      timestamp: new Date().toISOString()
    };
  }

  extractCSSVariables() {
    const styles = getComputedStyle(document.documentElement);
    const variables = {};
    
    // Extract CSS custom properties
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i];
        const rules = sheet.cssRules || sheet.rules;
        
        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j];
          if (rule.selectorText === ':root') {
            const declarations = rule.style;
            for (let k = 0; k < declarations.length; k++) {
              const property = declarations[k];
              if (property.startsWith('--')) {
                variables[property] = declarations.getPropertyValue(property).trim();
              }
            }
          }
        }
      } catch (e) {
        // CORS or other stylesheet access issues
      }
    }
    
    return variables;
  }

  getComponentStates() {
    return {
      buttons: this.getButtonStates(),
      cards: this.getCardStates(),
      inputs: this.getInputStates()
    };
  }

  getButtonStates() {
    return {
      variants: ['primary', 'secondary', 'danger', 'success'],
      sizes: ['sm', 'md', 'lg'],
      states: ['default', 'hover', 'active', 'disabled']
    };
  }

  getCardStates() {
    return {
      variants: ['default', 'elevated', 'outlined'],
      interactive: true,
      states: ['default', 'hover', 'active']
    };
  }

  getInputStates() {
    return {
      types: ['text', 'email', 'password', 'textarea'],
      states: ['default', 'focus', 'error', 'success', 'disabled']
    };
  }

  // === UTILITY METHODS === //
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // === PUBLIC API === //
  getTheme() {
    return this.currentTheme;
  }

  isMotionEnabled() {
    return this.motionEnabled;
  }

  destroy() {
    // Cleanup event listeners and timers
    this.activeToasts.clear();
    if (this.toastContainer) {
      this.toastContainer.remove();
    }
    console.log('🥔🐰 Style Guide Interactive System Destroyed');
  }
}

// === UTILITY CLASSES === //

// FPS Counter for performance monitoring
class FPSCounter {
  constructor() {
    this.fps = 0;
    this.frameCount = 0;
    this.startTime = performance.now();
    this.lastTime = this.startTime;
  }

  start() {
    const tick = () => {
      const currentTime = performance.now();
      this.frameCount++;
      
      if (currentTime - this.lastTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        this.frameCount = 0;
        this.lastTime = currentTime;
        
        // Log low FPS warnings
        if (this.fps < 30) {
          console.warn(`Low FPS detected: ${this.fps} fps`);
        }
      }
      
      requestAnimationFrame(tick);
    };
    
    tick();
  }

  getFPS() {
    return this.fps;
  }
}

// Color Palette Generator utility
class ColorPaletteGenerator {
  constructor() {
    this.baseColors = [
      '#8B4513', // Potato brown
      '#DEB887', // Potato skin
      '#FF6B6B', // Warm red
      '#4ECDC4', // Teal
      '#45B7D1', // Blue
      '#96CEB4', // Green
      '#FFEAA7', // Yellow
      '#DDA0DD', // Plum
    ];
  }

  // Generate random palette
  generateRandomPalette(count = 5) {
    const palette = [];
    for (let i = 0; i < count; i++) {
      const hue = Math.floor(Math.random() * 360);
      const saturation = 50 + Math.floor(Math.random() * 40); // 50-90%
      const lightness = 40 + Math.floor(Math.random() * 30); // 40-70%
      palette.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return palette;
  }

  // Generate harmonious palette from base color
  generateHarmoniousPalette(baseColor, count = 5) {
    const hsl = this.hexToHsl(baseColor);
    const palette = [baseColor];
    
    for (let i = 1; i < count; i++) {
      let newHue = (hsl.h + (i * 60)) % 360; // Complementary/analogous colors
      let newSat = Math.max(20, Math.min(90, hsl.s + (Math.random() - 0.5) * 40));
      let newLight = Math.max(20, Math.min(80, hsl.l + (Math.random() - 0.5) * 30));
      
      palette.push(`hsl(${newHue}, ${newSat}%, ${newLight}%)`);
    }
    
    return palette;
  }

  // Convert hex to HSL
  hexToHsl(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { h: 0, s: 50, l: 50 };
    
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }
}

// Global instance
window.styleGuide = new StyleGuideInteractive();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StyleGuideInteractive;
}