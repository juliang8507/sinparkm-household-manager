/**
 * 감자·토끼 가계부 - Icon System Helpers
 * SVG 스프라이트 시스템과 애니메이션 토큰 통합 헬퍼 함수들
 */

class IconSystem {
  constructor() {
    this.spriteLoaded = false;
    this.loadSprite();
    
    // Animation states tracking
    this.activeAnimations = new Map();
    
    // Performance optimization
    this.animationFrame = null;
    
    // Default character preferences
    this.characterMap = {
      success: ['potato-success', 'rabbit-success'],
      warning: ['potato-warning', 'rabbit-warning'],
      info: ['potato-info', 'rabbit-info'],
      error: ['potato-error', 'rabbit-error'],
      neutral: ['potato-neutral', 'rabbit-neutral'],
      loading: ['potato-loading', 'rabbit-loading']
    };
  }

  /**
   * SVG 스프라이트 로드 및 최적화
   */
  async loadSprite() {
    try {
      // Preload sprite for better performance
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = 'icons.svg';
      link.as = 'image';
      document.head.appendChild(link);
      
      // Check if sprite is accessible
      const response = await fetch('icons.svg');
      if (response.ok) {
        this.spriteLoaded = true;
        console.log('✅ Icon sprite loaded successfully');
      }
    } catch (error) {
      console.warn('⚠️ Icon sprite loading failed:', error);
      this.spriteLoaded = false;
    }
  }

  /**
   * 아이콘 생성 헬퍼
   * @param {string} iconId - 아이콘 ID (예: 'potato-success')
   * @param {Object} options - 옵션 객체
   * @param {string} options.size - 아이콘 크기 ('xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl')
   * @param {string} options.color - 아이콘 색상 클래스
   * @param {string[]} options.classes - 추가 CSS 클래스 배열
   * @param {string} options.ariaLabel - 접근성 레이블
   * @param {boolean} options.interactive - 클릭 가능 여부
   * @returns {HTMLElement} 생성된 아이콘 엘리먼트
   */
  createIcon(iconId, options = {}) {
    const {
      size = 'md',
      color = '',
      classes = [],
      ariaLabel = '',
      interactive = false
    } = options;

    // 컨테이너 생성
    const iconContainer = document.createElement('span');
    iconContainer.className = this.buildIconClasses(size, color, classes, interactive);
    
    // SVG 엘리먼트 생성
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', ariaLabel ? 'false' : 'true');
    if (ariaLabel) {
      svg.setAttribute('aria-label', ariaLabel);
      svg.setAttribute('role', 'img');
    }
    
    // use 엘리먼트 생성
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${iconId}`);
    
    svg.appendChild(use);
    iconContainer.appendChild(svg);
    
    // 디버그 정보 추가 (개발 모드에서만)
    if (process?.env?.NODE_ENV === 'development') {
      iconContainer.setAttribute('data-icon-name', iconId);
    }
    
    return iconContainer;
  }

  /**
   * 빠른 아이콘 생성 (HTML 문자열 반환)
   * @param {string} iconId - 아이콘 ID
   * @param {Object} options - 옵션 객체
   * @returns {string} HTML 문자열
   */
  getIconHTML(iconId, options = {}) {
    const {
      size = 'md',
      color = '',
      classes = [],
      ariaLabel = '',
      interactive = false
    } = options;

    const classList = this.buildIconClasses(size, color, classes, interactive);
    const ariaAttrs = ariaLabel 
      ? `aria-label="${ariaLabel}" role="img" aria-hidden="false"` 
      : 'aria-hidden="true"';
    
    return `
      <span class="${classList}">
        <svg ${ariaAttrs}>
          <use xlink:href="#${iconId}"></use>
        </svg>
      </span>
    `;
  }

  /**
   * CSS 클래스 빌더
   * @private
   */
  buildIconClasses(size, color, classes, interactive) {
    const classList = ['icon', `icon-${size}`];
    
    if (color) classList.push(color);
    if (interactive) classList.push('icon-interactive');
    if (classes.length) classList.push(...classes);
    
    return classList.join(' ');
  }

  /**
   * 캐릭터 리액션 애니메이션 실행
   * @param {string} type - 리액션 타입 ('success', 'warning', 'info', 'error')
   * @param {HTMLElement|string} element - 타겟 엘리먼트 또는 셀렉터
   * @param {Object} options - 옵션 객체
   * @param {string} options.character - 캐릭터 선택 ('potato', 'rabbit', 'auto')
   * @param {number} options.duration - 애니메이션 지속 시간 (ms, 토큰 기본값 사용)
   * @param {Function} options.onComplete - 완료 콜백
   * @returns {Promise<void>}
   */
  async playReaction(type, element, options = {}) {
    const {
      character = 'auto',
      duration = null,
      onComplete = null
    } = options;

    const target = typeof element === 'string' 
      ? document.querySelector(element) 
      : element;

    if (!target) {
      console.warn(`❌ Target element not found: ${element}`);
      return;
    }

    // 기존 애니메이션 정리
    this.clearAnimation(target);

    // 캐릭터 자동 선택
    const selectedCharacter = this.selectCharacter(target, character);
    const iconId = this.getCharacterIcon(selectedCharacter, type);
    
    // 애니메이션 클래스 추가
    const animationClass = `react-${type}`;
    target.classList.add(animationClass);
    
    // 아이콘 변경 (있는 경우)
    this.updateCharacterIcon(target, iconId);
    
    // 애니메이션 추적
    const animationId = `${target.id || 'element'}-${Date.now()}`;
    this.activeAnimations.set(target, animationId);

    // 애니메이션 완료 처리
    const cleanup = () => {
      target.classList.remove(animationClass);
      this.activeAnimations.delete(target);
      if (onComplete) onComplete();
    };

    // CSS 애니메이션 이벤트 리스닝 또는 타이머 설정
    if (duration) {
      setTimeout(cleanup, duration);
    } else {
      const handleAnimationEnd = (event) => {
        if (event.target === target) {
          target.removeEventListener('animationend', handleAnimationEnd);
          cleanup();
        }
      };
      target.addEventListener('animationend', handleAnimationEnd);
    }

    // 접근성 알림 (스크린 리더용)
    this.announceToScreenReader(type, target);
  }

  /**
   * 캐릭터 선택 로직
   * @private
   */
  selectCharacter(element, preference) {
    if (preference !== 'auto') {
      return preference;
    }

    // 기존 캐릭터 상태 확인
    if (element.classList.contains('icon-potato') || 
        element.querySelector('[class*="potato"]')) {
      return 'potato';
    }
    
    if (element.classList.contains('icon-rabbit') || 
        element.querySelector('[class*="rabbit"]')) {
      return 'rabbit';
    }

    // 컨텍스트 기반 선택
    const context = element.closest('[data-character]')?.dataset.character;
    if (context) {
      return context;
    }

    // 랜덤 선택 (가계부답게 감자를 약간 더 선호)
    return Math.random() < 0.6 ? 'potato' : 'rabbit';
  }

  /**
   * 캐릭터 아이콘 ID 생성
   * @private
   */
  getCharacterIcon(character, type) {
    return `${character}-${type}`;
  }

  /**
   * 캐릭터 아이콘 업데이트
   * @private
   */
  updateCharacterIcon(element, iconId) {
    const useElement = element.querySelector('use');
    if (useElement) {
      useElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${iconId}`);
    }
  }

  /**
   * 애니메이션 정리
   * @private
   */
  clearAnimation(element) {
    // 활성 애니메이션 클래스 제거
    const reactionClasses = ['react-success', 'react-warning', 'react-info', 'react-error'];
    element.classList.remove(...reactionClasses);
    
    // 캐릭터 애니메이션 클래스 제거
    const characterClasses = [
      'animate-potato-bounce', 'animate-potato-wiggle',
      'animate-rabbit-hop', 'animate-rabbit-twitch'
    ];
    element.classList.remove(...characterClasses);
    
    this.activeAnimations.delete(element);
  }

  /**
   * 스크린 리더 알림
   * @private
   */
  announceToScreenReader(type, element) {
    const messages = {
      success: '성공적으로 완료되었습니다',
      warning: '주의가 필요합니다',
      info: '새로운 정보가 있습니다',
      error: '오류가 발생했습니다'
    };

    const announcement = messages[type];
    if (announcement) {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.textContent = announcement;
      
      document.body.appendChild(liveRegion);
      
      // 정리
      setTimeout(() => {
        document.body.removeChild(liveRegion);
      }, 1000);
    }
  }

  /**
   * 캐릭터 표정 자동 변경
   * @param {HTMLElement|string} element - 타겟 엘리먼트 또는 셀렉터
   * @param {string} expression - 표정 ('success', 'warning', 'info', 'error', 'neutral', 'loading')
   * @param {Object} options - 옵션 객체
   * @returns {Promise<void>}
   */
  async changeExpression(element, expression, options = {}) {
    const target = typeof element === 'string' 
      ? document.querySelector(element) 
      : element;

    if (!target) {
      console.warn(`❌ Target element not found: ${element}`);
      return;
    }

    const character = this.selectCharacter(target, options.character || 'auto');
    const iconId = this.getCharacterIcon(character, expression);
    
    // 부드러운 전환 효과
    if (options.smooth !== false) {
      target.style.transition = 'opacity var(--dur-xs)';
      target.style.opacity = '0.7';
      
      setTimeout(() => {
        this.updateCharacterIcon(target, iconId);
        target.style.opacity = '1';
      }, 100);
      
      setTimeout(() => {
        target.style.transition = '';
      }, 250);
    } else {
      this.updateCharacterIcon(target, iconId);
    }
  }

  /**
   * 여러 아이콘에 스태거된 애니메이션 적용
   * @param {NodeList|HTMLElement[]} elements - 타겟 엘리먼트들
   * @param {string} type - 리액션 타입
   * @param {Object} options - 옵션 객체
   * @param {number} options.stagger - 스태거 딜레이 (ms, 기본값: 50ms)
   */
  async playStaggeredReaction(elements, type, options = {}) {
    const { stagger = 50, ...reactionOptions } = options;
    const elementsArray = Array.from(elements);
    
    const promises = elementsArray.map((element, index) => {
      return new Promise(resolve => {
        setTimeout(() => {
          this.playReaction(type, element, {
            ...reactionOptions,
            onComplete: resolve
          });
        }, index * stagger);
      });
    });
    
    return Promise.all(promises);
  }

  /**
   * 성능 모니터링 및 최적화
   * @returns {Object} 성능 메트릭스
   */
  getPerformanceMetrics() {
    return {
      spriteLoaded: this.spriteLoaded,
      activeAnimations: this.activeAnimations.size,
      memoryUsage: performance.memory ? {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      } : null
    };
  }

  /**
   * 테마 변경시 아이콘 업데이트
   * @param {string} theme - 새 테마 ('light', 'dark', 'hc')
   */
  updateIconsForTheme(theme) {
    // 테마별 아이콘 색상 자동 조정은 CSS에서 처리됨
    // 필요시 특별한 아이콘 교체 로직 추가 가능
    console.log(`🎨 Icons updated for theme: ${theme}`);
  }

  /**
   * 배치 아이콘 생성 (성능 최적화)
   * @param {Array} iconConfigs - 아이콘 설정 배열
   * @returns {DocumentFragment} 생성된 아이콘들의 DocumentFragment
   */
  createIconBatch(iconConfigs) {
    const fragment = document.createDocumentFragment();
    
    iconConfigs.forEach(config => {
      const icon = this.createIcon(config.id, config.options);
      fragment.appendChild(icon);
    });
    
    return fragment;
  }

  /**
   * 개발 도구: 아이콘 갤러리 생성
   * @param {HTMLElement} container - 갤러리가 표시될 컨테이너
   */
  createIconGallery(container) {
    if (process?.env?.NODE_ENV !== 'development') {
      console.warn('Icon gallery is only available in development mode');
      return;
    }

    const icons = [
      'potato-success', 'potato-warning', 'potato-info', 'potato-error', 'potato-neutral', 'potato-loading',
      'rabbit-success', 'rabbit-warning', 'rabbit-info', 'rabbit-error', 'rabbit-neutral', 'rabbit-loading',
      'empty-transactions', 'empty-meals', 'loading-state'
    ];

    const gallery = document.createElement('div');
    gallery.className = 'icon-gallery';
    gallery.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
      padding: 1rem;
      background: var(--color-background-paper);
      border-radius: var(--radius-lg);
      margin: 1rem 0;
    `;

    icons.forEach(iconId => {
      const item = document.createElement('div');
      item.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-md);
        cursor: pointer;
      `;

      const icon = this.createIcon(iconId, { size: 'xl' });
      const label = document.createElement('code');
      label.textContent = iconId;
      label.style.fontSize = '0.75rem';

      item.appendChild(icon);
      item.appendChild(label);

      // 클릭시 애니메이션 테스트
      item.addEventListener('click', () => {
        const type = iconId.includes('success') ? 'success' :
                    iconId.includes('warning') ? 'warning' :
                    iconId.includes('error') ? 'error' : 'info';
        this.playReaction(type, icon);
      });

      gallery.appendChild(item);
    });

    container.appendChild(gallery);
  }
}

// 전역 인스턴스 생성 및 exports
const iconSystem = new IconSystem();

// 편의 함수들을 전역으로 노출
window.createIcon = (iconId, options) => iconSystem.createIcon(iconId, options);
window.getIconHTML = (iconId, options) => iconSystem.getIconHTML(iconId, options);
window.playReaction = (type, element, options) => iconSystem.playReaction(type, element, options);
window.changeExpression = (element, expression, options) => iconSystem.changeExpression(element, expression, options);
window.playStaggeredReaction = (elements, type, options) => iconSystem.playStaggeredReaction(elements, type, options);

// 모듈 exports (ES6 모듈 사용시)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { iconSystem, IconSystem };
}

// 초기화 완료 이벤트
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎭 Icon System initialized');
  
  // 성능 모니터링 (개발 모드에서만)
  if (process?.env?.NODE_ENV === 'development') {
    setInterval(() => {
      const metrics = iconSystem.getPerformanceMetrics();
      if (metrics.activeAnimations > 5) {
        console.warn('⚠️ Too many active icon animations:', metrics.activeAnimations);
      }
    }, 5000);
  }
});

// 테마 변경 리스너
document.addEventListener('themechange', (event) => {
  iconSystem.updateIconsForTheme(event.detail.theme);
});

// ES6 export removed for browser compatibility
// Use window.iconSystem or module.exports instead