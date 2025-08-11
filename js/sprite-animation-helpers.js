/**
 * 감자·토끼 가계부 - SVG 스프라이트 애니메이션 헬퍼
 * 고성능 애니메이션과 최적화된 사용자 경험을 위한 통합 시스템
 */

class SpriteAnimationSystem {
  constructor() {
    this.spriteUrl = 'icons.svg';
    this.isInitialized = false;
    this.preloadPromise = null;
    
    // 애니메이션 상태 관리
    this.activeAnimations = new WeakMap();
    this.animationQueue = [];
    this.isProcessingQueue = false;
    
    // 성능 최적화
    this.intersectionObserver = null;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.highContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    // 애니메이션 프리셋
    this.presets = this.initializePresets();
    
    // 자동 초기화
    this.initialize();
  }

  /**
   * 시스템 초기화
   */
  async initialize() {
    try {
      // SVG 스프라이트 프리로드
      await this.preloadSprite();
      
      // Intersection Observer 설정 (뷰포트 애니메이션 최적화)
      this.setupIntersectionObserver();
      
      // 이벤트 리스너 설정
      this.setupEventListeners();
      
      this.isInitialized = true;
      this.dispatchEvent('sprite-system-ready');
      
      console.log('✅ Sprite Animation System initialized');
    } catch (error) {
      console.error('❌ Sprite Animation System initialization failed:', error);
    }
  }

  /**
   * SVG 스프라이트 프리로드
   */
  async preloadSprite() {
    if (this.preloadPromise) return this.preloadPromise;
    
    this.preloadPromise = new Promise((resolve, reject) => {
      // 링크 프리로드 설정
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = this.spriteUrl;
      link.as = 'image';
      link.type = 'image/svg+xml';
      
      link.onload = () => {
        console.log('📦 SVG sprite preloaded successfully');
        resolve();
      };
      
      link.onerror = () => {
        console.warn('⚠️ SVG sprite preload failed');
        resolve(); // 실패해도 계속 진행
      };
      
      document.head.appendChild(link);
      
      // 타임아웃 설정
      setTimeout(resolve, 2000);
    });
    
    return this.preloadPromise;
  }

  /**
   * Intersection Observer 설정
   */
  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const element = entry.target;
          const animationConfig = element.dataset.spriteAnimation;
          
          if (entry.isIntersecting && animationConfig) {
            try {
              const config = JSON.parse(animationConfig);
              this.playAnimation(element, config.type, config.options);
            } catch (error) {
              console.warn('Invalid animation config:', animationConfig);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '10% 0px',
        threshold: [0.1, 0.5, 1.0]
      }
    );
  }

  /**
   * 이벤트 리스너 설정
   */
  setupEventListeners() {
    // 반응형 미디어 쿼리 변경 감지
    window.matchMedia('(prefers-reduced-motion: reduce)').addListener((e) => {
      this.reducedMotion = e.matches;
      this.updateAnimationPreferences();
    });
    
    window.matchMedia('(prefers-contrast: high)').addListener((e) => {
      this.highContrast = e.matches;
      this.updateAnimationPreferences();
    });
    
    // 테마 변경 감지
    document.addEventListener('themechange', (e) => {
      this.updateThemeAnimations(e.detail.theme);
    });
    
    // 페이지 가시성 변경 (배터리 최적화)
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });
  }

  /**
   * 애니메이션 프리셋 초기화
   */
  initializePresets() {
    return {
      // 기본 반응 애니메이션
      success: {
        classes: ['react-success'],
        duration: 'var(--reaction-success-duration)',
        characterMap: {
          potato: 'potato-success',
          rabbit: 'rabbit-success'
        }
      },
      warning: {
        classes: ['react-warn'],
        duration: 'var(--reaction-warning-duration)',
        characterMap: {
          potato: 'potato-warning',
          rabbit: 'rabbit-warning'
        }
      },
      error: {
        classes: ['react-error'],
        duration: 'var(--reaction-error-duration)',
        characterMap: {
          potato: 'potato-error',
          rabbit: 'rabbit-error'
        }
      },
      info: {
        classes: ['react-info'],
        duration: 'var(--reaction-info-duration)',
        characterMap: {
          potato: 'potato-info',
          rabbit: 'rabbit-info'
        }
      },
      
      // 캐릭터 특별 애니메이션
      'potato-happy': {
        classes: ['react-potato-happy'],
        duration: 'var(--dur-md)',
        iconId: 'potato-success'
      },
      'rabbit-hop': {
        classes: ['react-rabbit-hop'],
        duration: 'var(--dur-md)',
        iconId: 'rabbit-success'
      },
      
      // 상황별 애니메이션
      'transaction-success': {
        classes: ['react-transaction-success'],
        duration: 'var(--dur-lg)',
        sound: 'success'
      },
      'budget-warning': {
        classes: ['react-budget-warning'],
        duration: 'var(--dur-md)',
        sound: 'warning'
      },
      'celebration': {
        classes: ['react-celebration'],
        duration: 'var(--dur-2xl)',
        sound: 'celebration'
      },
      
      // 상태 애니메이션
      loading: {
        classes: ['react-loading'],
        duration: 'infinite',
        loop: true
      },
      empty: {
        classes: ['react-empty'],
        duration: 'infinite',
        loop: true
      },
      
      // 인터렉션 애니메이션
      attention: {
        classes: ['react-attention'],
        duration: 'var(--dur-lg)',
        repeat: 3
      },
      enter: {
        classes: ['react-enter'],
        duration: 'var(--dur-md)'
      },
      exit: {
        classes: ['react-exit'],
        duration: 'var(--dur-sm)'
      }
    };
  }

  /**
   * 메인 애니메이션 실행 함수
   * @param {HTMLElement|string} element - 타겟 엘리먼트 또는 셀렉터
   * @param {string} animationType - 애니메이션 타입
   * @param {Object} options - 옵션 객체
   */
  async playAnimation(element, animationType, options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    const target = this.resolveElement(element);
    if (!target) {
      console.warn('Animation target not found:', element);
      return Promise.resolve();
    }
    
    // 접근성 설정 확인
    if (this.reducedMotion && !options.forceAnimation) {
      return this.playReducedAnimation(target, animationType, options);
    }
    
    const config = { ...this.presets[animationType], ...options };
    if (!config.classes) {
      console.warn('Unknown animation type:', animationType);
      return Promise.resolve();
    }
    
    // 기존 애니메이션 정리
    this.clearAnimation(target);
    
    // 애니메이션 실행
    return this.executeAnimation(target, config, options);
  }

  /**
   * 애니메이션 실행 핵심 로직
   */
  async executeAnimation(element, config, options) {
    const animationId = `anim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 애니메이션 상태 저장
    this.activeAnimations.set(element, {
      id: animationId,
      config,
      startTime: Date.now()
    });
    
    // 아이콘 변경 (필요한 경우)
    if (config.iconId || (config.characterMap && options.character)) {
      const iconId = config.iconId || config.characterMap[options.character || 'auto'];
      if (iconId) {
        await this.changeIcon(element, iconId, { smooth: options.smooth !== false });
      }
    }
    
    // CSS 클래스 적용
    element.classList.add(...config.classes);
    
    // 커스텀 CSS 변수 설정
    if (options.duration) {
      element.style.setProperty('--custom-animation-duration', options.duration);
    }
    if (options.delay) {
      element.style.setProperty('--custom-animation-delay', options.delay);
    }
    
    // 사운드 효과 (옵션)
    if (config.sound && options.enableSound) {
      this.playSound(config.sound);
    }
    
    // 접근성 알림
    if (options.announceToScreenReader !== false) {
      this.announceToScreenReader(config.type || options.type, options.message);
    }
    
    // 애니메이션 완료 대기
    return this.waitForAnimationComplete(element, config, options);
  }

  /**
   * 아이콘 변경 (부드러운 전환 포함)
   */
  async changeIcon(element, iconId, options = {}) {
    const useElement = element.querySelector('use');
    if (!useElement) return;
    
    if (options.smooth) {
      // 부드러운 전환 효과
      element.style.transition = 'opacity var(--dur-xs) var(--ease-standard)';
      element.style.opacity = '0.7';
      
      await this.wait(100);
      
      useElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${iconId}`);
      element.style.opacity = '1';
      
      await this.wait(150);
      element.style.transition = '';
    } else {
      useElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${iconId}`);
    }
  }

  /**
   * 애니메이션 완료 대기
   */
  waitForAnimationComplete(element, config, options) {
    return new Promise((resolve) => {
      const cleanup = () => {
        // 애니메이션 클래스 제거
        element.classList.remove(...config.classes);
        
        // 커스텀 CSS 변수 정리
        element.style.removeProperty('--custom-animation-duration');
        element.style.removeProperty('--custom-animation-delay');
        
        // 활성 애니메이션 목록에서 제거
        this.activeAnimations.delete(element);
        
        // 완료 콜백 실행
        if (options.onComplete) {
          options.onComplete(element);
        }
        
        resolve(element);
      };
      
      if (config.loop || config.duration === 'infinite') {
        // 무한 루프 애니메이션은 수동 정리만 가능
        return;
      }
      
      if (options.duration) {
        // 커스텀 지속 시간
        setTimeout(cleanup, parseInt(options.duration));
      } else {
        // CSS 애니메이션 이벤트 감지
        const handleAnimationEnd = (event) => {
          if (event.target === element && config.classes.some(cls => 
            element.classList.contains(cls))) {
            element.removeEventListener('animationend', handleAnimationEnd);
            cleanup();
          }
        };
        
        element.addEventListener('animationend', handleAnimationEnd);
        
        // 안전장치 (최대 5초)
        setTimeout(() => {
          element.removeEventListener('animationend', handleAnimationEnd);
          if (this.activeAnimations.has(element)) {
            cleanup();
          }
        }, 5000);
      }
    });
  }

  /**
   * 스태거된 애니메이션 실행
   */
  async playStaggeredAnimation(elements, animationType, options = {}) {
    const { stagger = 50, ...animationOptions } = options;
    const elementsArray = this.resolveElements(elements);
    
    const promises = elementsArray.map((element, index) => {
      return new Promise(resolve => {
        setTimeout(() => {
          this.playAnimation(element, animationType, {
            ...animationOptions,
            onComplete: resolve
          });
        }, index * stagger);
      });
    });
    
    return Promise.all(promises);
  }

  /**
   * 시퀀스 애니메이션 실행
   */
  async playSequence(sequences, options = {}) {
    const results = [];
    
    for (const sequence of sequences) {
      const { element, type, delay = 0, ...sequenceOptions } = sequence;
      
      if (delay > 0) {
        await this.wait(delay);
      }
      
      const result = await this.playAnimation(element, type, {
        ...options,
        ...sequenceOptions
      });
      
      results.push(result);
    }
    
    return results;
  }

  /**
   * 애니메이션 정리
   */
  clearAnimation(element) {
    if (this.activeAnimations.has(element)) {
      const animationData = this.activeAnimations.get(element);
      
      // 모든 가능한 애니메이션 클래스 제거
      Object.values(this.presets).forEach(preset => {
        element.classList.remove(...preset.classes);
      });
      
      // 커스텀 CSS 변수 정리
      element.style.removeProperty('--custom-animation-duration');
      element.style.removeProperty('--custom-animation-delay');
      
      this.activeAnimations.delete(element);
    }
  }

  /**
   * 모든 애니메이션 일시정지/재개
   */
  pauseAllAnimations() {
    document.documentElement.style.setProperty('--animation-play-state', 'paused');
  }

  resumeAllAnimations() {
    document.documentElement.style.removeProperty('--animation-play-state');
  }

  /**
   * 줄어든 모션 대응 애니메이션
   */
  playReducedAnimation(element, animationType, options) {
    // 필수 피드백만 최소한으로 표시
    const reducedAnimations = {
      success: () => {
        element.classList.add('react-success');
        setTimeout(() => element.classList.remove('react-success'), 100);
      },
      error: () => {
        element.classList.add('react-error');
        setTimeout(() => element.classList.remove('react-error'), 50);
      }
    };
    
    const reducedAnimation = reducedAnimations[animationType];
    if (reducedAnimation) {
      reducedAnimation();
    }
    
    return Promise.resolve(element);
  }

  /**
   * 접근성 알림
   */
  announceToScreenReader(type, customMessage) {
    const messages = {
      success: customMessage || '성공적으로 완료되었습니다',
      warning: customMessage || '주의가 필요합니다',
      error: customMessage || '오류가 발생했습니다',
      info: customMessage || '새로운 정보가 있습니다'
    };

    const message = messages[type];
    if (!message) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }

  /**
   * 사운드 효과 재생 (Web Audio API 사용)
   */
  async playSound(soundType) {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        return; // 오디오 지원 안함
      }
    }

    const soundConfig = {
      success: { frequency: 800, duration: 100, type: 'sine' },
      warning: { frequency: 600, duration: 150, type: 'square' },
      error: { frequency: 400, duration: 200, type: 'sawtooth' },
      celebration: { frequency: [800, 1000, 1200], duration: 300, type: 'sine' }
    };

    const config = soundConfig[soundType];
    if (!config) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(
        Array.isArray(config.frequency) ? config.frequency[0] : config.frequency,
        this.audioContext.currentTime
      );
      
      oscillator.type = config.type;
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + config.duration / 1000);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + config.duration / 1000);
      
      // 축하 사운드의 경우 화음 추가
      if (soundType === 'celebration' && Array.isArray(config.frequency)) {
        config.frequency.slice(1).forEach((freq, index) => {
          setTimeout(() => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
            osc.type = config.type;
            gain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
            
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.15);
          }, (index + 1) * 100);
        });
      }
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }

  /**
   * 뷰포트 애니메이션 (스크롤 기반)
   */
  observeForAnimation(element, animationType, options = {}) {
    if (!this.intersectionObserver) return;
    
    element.dataset.spriteAnimation = JSON.stringify({
      type: animationType,
      options
    });
    
    this.intersectionObserver.observe(element);
  }

  /**
   * 성능 모니터링
   */
  getPerformanceMetrics() {
    return {
      activeAnimations: this.activeAnimations.size || 0,
      queueLength: this.animationQueue.length,
      reducedMotion: this.reducedMotion,
      memoryUsage: performance.memory ? {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total: Math.round(performance.memory.totalJSHeapSize / 1048576)
      } : null,
      timestamp: Date.now()
    };
  }

  /**
   * 테마 변경에 따른 애니메이션 업데이트
   */
  updateThemeAnimations(theme) {
    // CSS 변수를 통해 테마별 애니메이션 조정
    document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-hc');
    document.documentElement.classList.add(`theme-${theme}`);
  }

  /**
   * 페이지 가시성 변경 처리 (배터리 최적화)
   */
  handleVisibilityChange() {
    if (document.hidden) {
      this.pauseAllAnimations();
    } else {
      this.resumeAllAnimations();
    }
  }

  /**
   * 애니메이션 설정 업데이트
   */
  updateAnimationPreferences() {
    document.documentElement.classList.toggle('reduced-motion', this.reducedMotion);
    document.documentElement.classList.toggle('high-contrast', this.highContrast);
  }

  /**
   * 유틸리티 함수들
   */
  resolveElement(element) {
    return typeof element === 'string' ? document.querySelector(element) : element;
  }

  resolveElements(elements) {
    if (typeof elements === 'string') {
      return Array.from(document.querySelectorAll(elements));
    }
    return Array.isArray(elements) ? elements : Array.from(elements);
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  dispatchEvent(eventName, detail = {}) {
    document.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  /**
   * 정리 (메모리 누수 방지)
   */
  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    this.activeAnimations.clear();
    this.animationQueue.length = 0;
    
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

// 전역 인스턴스 생성
const spriteAnimations = new SpriteAnimationSystem();

// 편의 함수들을 전역으로 노출
window.playReaction = (type, element, options) => 
  spriteAnimations.playAnimation(element, type, options);

window.playStaggeredReaction = (elements, type, options) => 
  spriteAnimations.playStaggeredAnimation(elements, type, options);

window.playAnimationSequence = (sequences, options) => 
  spriteAnimations.playSequence(sequences, options);

window.clearAnimation = (element) => 
  spriteAnimations.clearAnimation(element);

window.observeForAnimation = (element, type, options) => 
  spriteAnimations.observeForAnimation(element, type, options);

window.changeCharacterExpression = (element, iconId, options) => 
  spriteAnimations.changeIcon(element, iconId, options);

// 모듈 exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { spriteAnimations, SpriteAnimationSystem };
}

// 초기화 완료 알림
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎬 Sprite Animation System loaded');
});

// ES6 export removed for browser compatibility
// Use window.spriteAnimations or module.exports instead