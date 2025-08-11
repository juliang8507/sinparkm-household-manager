// 감자·토끼 가계부 - Animation Hooks
// 애니메이션 토큰 시스템을 활용한 React 훅

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 캐릭터 리액션 애니메이션을 관리하는 훅
 */
export const useCharacterReaction = () => {
  const [currentReaction, setCurrentReaction] = useState(null);
  const timeoutRef = useRef(null);

  const playReaction = useCallback((type, duration = null) => {
    // 이전 타이머 클리어
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setCurrentReaction(type);

    // 기본 지속 시간 설정
    const durations = {
      success: 400,
      warning: 250,
      info: 600,
      error: 150
    };

    const animationDuration = duration || durations[type] || 400;

    // 애니메이션 완료 후 상태 리셋
    timeoutRef.current = setTimeout(() => {
      setCurrentReaction(null);
    }, animationDuration);
  }, []);

  const clearReaction = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setCurrentReaction(null);
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    currentReaction,
    playReaction,
    clearReaction,
    // 애니메이션 클래스 이름 생성
    getAnimationClass: () => currentReaction ? `animate-${currentReaction}` : ''
  };
};

/**
 * 버튼 인터랙션 애니메이션을 관리하는 훅
 */
export const useButtonAnimation = (type = 'lift') => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const buttonProps = {
    className: `btn-${type}`,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => {
      setIsHovered(false);
      setIsPressed(false);
    },
    onMouseDown: () => setIsPressed(true),
    onMouseUp: () => setIsPressed(false),
    onTouchStart: () => setIsPressed(true),
    onTouchEnd: () => setIsPressed(false)
  };

  return {
    buttonProps,
    isPressed,
    isHovered,
    getStateClass: () => {
      const classes = [];
      if (isPressed) classes.push('pressed');
      if (isHovered) classes.push('hovered');
      return classes.join(' ');
    }
  };
};

/**
 * 카드 호버 애니메이션을 관리하는 훅
 */
export const useCardAnimation = (type = 'hover', autoFloat = false) => {
  const cardProps = {
    className: `card-${type} ${autoFloat ? 'card-float' : ''}`.trim()
  };

  return { cardProps };
};

/**
 * 토스트 알림 애니메이션을 관리하는 훅
 */
export const useToastAnimation = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000, position = 'top-right') => {
    const id = Date.now();
    const toast = {
      id,
      message,
      type,
      position,
      isVisible: true
    };

    setToasts(prev => [...prev, toast]);

    // 자동 제거
    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const shakeToast = useCallback((id) => {
    // 토스트 흔들기 효과 (에러 상황에서 사용)
    setToasts(prev =>
      prev.map(toast =>
        toast.id === id
          ? { ...toast, shake: true }
          : toast
      )
    );

    // 흔들기 효과 제거
    setTimeout(() => {
      setToasts(prev =>
        prev.map(toast =>
          toast.id === id
            ? { ...toast, shake: false }
            : toast
        )
      );
    }, 250);
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    shakeToast
  };
};

/**
 * 모달 애니메이션을 관리하는 훅
 */
export const useModalAnimation = (bounceOnOpen = true) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  const openModal = useCallback(() => {
    setIsVisible(true);
    setIsEntering(true);

    // 진입 애니메이션 완료 후 상태 업데이트
    setTimeout(() => {
      setIsEntering(false);
    }, bounceOnOpen ? 600 : 400);
  }, [bounceOnOpen]);

  const closeModal = useCallback(() => {
    setIsVisible(false);
    setIsEntering(false);
  }, []);

  const modalProps = {
    className: `modal-backdrop ${isEntering ? 'entering' : ''}`.trim(),
    onClick: closeModal
  };

  const contentProps = {
    className: `modal-content ${isEntering ? (bounceOnOpen ? 'bounce' : 'entering') : ''}`.trim(),
    onClick: (e) => e.stopPropagation()
  };

  return {
    isVisible,
    isEntering,
    openModal,
    closeModal,
    modalProps,
    contentProps
  };
};

/**
 * 입력 필드 피드백 애니메이션을 관리하는 훅
 */
export const useInputFeedback = () => {
  const [feedbackState, setFeedbackState] = useState(null); // 'success', 'error', null

  const showSuccess = useCallback((duration = 600) => {
    setFeedbackState('success');
    setTimeout(() => setFeedbackState(null), duration);
  }, []);

  const showError = useCallback((duration = 400) => {
    setFeedbackState('error');
    setTimeout(() => setFeedbackState(null), duration);
  }, []);

  const clearFeedback = useCallback(() => {
    setFeedbackState(null);
  }, []);

  const getInputProps = useCallback(() => ({
    className: `input-enhanced ${feedbackState || ''}`.trim()
  }), [feedbackState]);

  return {
    feedbackState,
    showSuccess,
    showError,
    clearFeedback,
    getInputProps
  };
};

/**
 * 리스트 아이템 스태거 애니메이션을 관리하는 훅
 */
export const useStaggerAnimation = (items, baseDelay = 50) => {
  const getItemProps = useCallback((index) => ({
    className: 'stagger-item',
    style: {
      animationDelay: `${index * baseDelay}ms`
    }
  }), [baseDelay]);

  return { getItemProps };
};

/**
 * 로딩 상태 애니메이션을 관리하는 훅
 */
export const useLoadingAnimation = (type = 'pulse') => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const getLoadingProps = useCallback(() => ({
    className: isLoading ? `loading-${type}` : ''
  }), [isLoading, type]);

  return {
    isLoading,
    startLoading,
    stopLoading,
    getLoadingProps
  };
};

/**
 * 감자·토끼 캐릭터별 애니메이션을 관리하는 훅
 */
export const useCharacterAnimation = (character = 'potato') => {
  const [animationState, setAnimationState] = useState('idle');

  const playAnimation = useCallback((animation, duration = null) => {
    setAnimationState(animation);

    const durations = {
      bounce: character === 'potato' ? 600 : 400,
      hop: 400,
      wiggle: 400,
      twitch: 150
    };

    const animationDuration = duration || durations[animation] || 400;

    setTimeout(() => {
      setAnimationState('idle');
    }, animationDuration);
  }, [character]);

  const getCharacterProps = useCallback(() => {
    const baseClass = `${character}-${animationState}`;
    const animationClass = animationState !== 'idle' ? 
      `animate-${character}-${animationState}` : '';

    return {
      className: [baseClass, animationClass].filter(Boolean).join(' ')
    };
  }, [character, animationState]);

  return {
    animationState,
    playAnimation,
    getCharacterProps,
    // 편의 메서드들
    playHappy: () => playAnimation(character === 'potato' ? 'wiggle' : 'hop'),
    playAlert: () => playAnimation(character === 'rabbit' ? 'twitch' : 'bounce'),
    playBounce: () => playAnimation('bounce')
  };
};

/**
 * 접근성을 고려한 애니메이션 설정 훅
 */
export const useAccessibleAnimation = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // prefers-reduced-motion 미디어 쿼리 확인
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const getAnimationProps = useCallback((animationClass, fallbackClass = '') => {
    if (prefersReducedMotion) {
      return { className: fallbackClass };
    }
    return { className: animationClass };
  }, [prefersReducedMotion]);

  return {
    prefersReducedMotion,
    getAnimationProps,
    shouldAnimate: !prefersReducedMotion
  };
};

/**
 * 통합 애니메이션 컨텍스트를 위한 훅
 */
export const useAnimationContext = () => {
  const characterReaction = useCharacterReaction();
  const toast = useToastAnimation();
  const { prefersReducedMotion, shouldAnimate } = useAccessibleAnimation();

  const playFeedback = useCallback((type, message = null) => {
    if (!shouldAnimate) return;

    // 캐릭터 리액션 재생
    characterReaction.playReaction(type);

    // 토스트 메시지 표시 (메시지가 있는 경우)
    if (message) {
      toast.showToast(message, type);
    }
  }, [shouldAnimate, characterReaction, toast]);

  return {
    // 개별 애니메이션 훅들
    characterReaction,
    toast,
    
    // 통합 메서드들
    playFeedback,
    
    // 접근성 정보
    prefersReducedMotion,
    shouldAnimate
  };
};

export default {
  useCharacterReaction,
  useButtonAnimation,
  useCardAnimation,
  useToastAnimation,
  useModalAnimation,
  useInputFeedback,
  useStaggerAnimation,
  useLoadingAnimation,
  useCharacterAnimation,
  useAccessibleAnimation,
  useAnimationContext
};