/**
 * 감자·토끼 가계부 - Animation Helpers
 * 애니메이션 토큰 시스템과 접근성을 고려한 JavaScript 헬퍼 함수들
 */

class AnimationHelpers {
    constructor() {
        this.motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.setupAccessibilityHandlers();
    }

    /**
     * 접근성 설정 감지 및 대응
     */
    setupAccessibilityHandlers() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', (e) => {
            this.motionReduced = e.matches;
            this.updateAnimationStates();
        });
    }

    /**
     * 모션 감소 설정에 따라 애니메이션 상태 업데이트
     */
    updateAnimationStates() {
        if (this.motionReduced) {
            document.documentElement.setAttribute('data-motion', 'reduced');
        } else {
            document.documentElement.removeAttribute('data-motion');
        }
    }

    /**
     * 캐릭터 반응 트리거 (감자)
     * @param {string} emotion - 'happy', 'concerned', 'celebrating'
     * @param {HTMLElement} element - 캐릭터 요소
     */
    triggerPotatoReaction(emotion = 'happy', element = null) {
        const potato = element || document.getElementById('potatoCharacter');
        if (!potato) return;

        if (this.motionReduced) {
            // 모션 감소 모드에서는 시각적 피드백으로 대체
            this.applyAlternativeFeedback(potato, emotion);
        } else {
            // 기존 클래스 제거
            potato.classList.remove('happy', 'concerned', 'celebrating');
            
            // 새 감정 클래스 추가
            potato.classList.add(emotion);
            
            // 애니메이션이 끝나면 클래스 제거
            setTimeout(() => {
                potato.classList.remove(emotion);
            }, this.getAnimationDuration('reaction-' + emotion));
        }
    }

    /**
     * 캐릭터 반응 트리거 (토끼)
     * @param {string} emotion - 'alert', 'happy', 'excited'
     * @param {HTMLElement} element - 캐릭터 요소
     */
    triggerRabbitReaction(emotion = 'alert', element = null) {
        const rabbit = element || document.getElementById('rabbitCharacter');
        if (!rabbit) return;

        if (this.motionReduced) {
            this.applyAlternativeFeedback(rabbit, emotion);
        } else {
            rabbit.classList.remove('alert', 'happy', 'excited');
            rabbit.classList.add(emotion);
            
            setTimeout(() => {
                rabbit.classList.remove(emotion);
            }, this.getAnimationDuration('reaction-' + emotion));
        }
    }

    /**
     * 토스트 알림 표시
     * @param {string} message - 메시지 내용
     * @param {string} type - 'success', 'error', 'warning', 'info'
     * @param {number} duration - 표시 시간 (ms)
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = this.createToastElement(message, type);
        document.body.appendChild(toast);

        if (this.motionReduced) {
            // 즉시 표시
            toast.classList.add('show');
            this.announceToScreen(message);
        } else {
            // 부드러운 애니메이션으로 표시
            requestAnimationFrame(() => {
                toast.classList.add('show');
            });
        }

        // 자동 제거
        setTimeout(() => {
            this.hideToast(toast);
        }, duration);

        return toast;
    }

    /**
     * 토스트 요소 생성
     */
    createToastElement(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}-toast`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        
        const icon = this.getToastIcon(type);
        
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${icon}</span>
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close" aria-label="닫기">×</button>
        `;

        // 닫기 버튼 이벤트
        const closeButton = toast.querySelector('.toast-close');
        closeButton.addEventListener('click', () => {
            this.hideToast(toast);
        });

        return toast;
    }

    /**
     * 토스트 숨기기
     */
    hideToast(toast) {
        if (this.motionReduced) {
            toast.remove();
        } else {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, this.getAnimationDuration('toast-exit'));
        }
    }

    /**
     * 모달 표시 애니메이션
     * @param {HTMLElement} modal - 모달 요소
     * @param {string} animationType - 'fade', 'scale', 'slide'
     */
    showModal(modal, animationType = 'scale') {
        if (!modal) return;

        modal.classList.add('show');
        
        if (!this.motionReduced && animationType !== 'none') {
            const content = modal.querySelector('.modal-content');
            if (content) {
                content.classList.add('entering');
                content.classList.add(animationType);
            }
        }

        // 포커스 트랩 설정
        this.setupFocusTrap(modal);
    }

    /**
     * 모달 숨기기 애니메이션
     * @param {HTMLElement} modal - 모달 요소
     */
    hideModal(modal) {
        if (!modal) return;

        if (this.motionReduced) {
            modal.classList.remove('show');
        } else {
            const content = modal.querySelector('.modal-content');
            if (content) {
                content.classList.add('exiting');
            }
            
            setTimeout(() => {
                modal.classList.remove('show');
                if (content) {
                    content.classList.remove('entering', 'exiting');
                }
            }, this.getAnimationDuration('modal-exit'));
        }

        this.removeFocusTrap(modal);
    }

    /**
     * 버튼 클릭 피드백 효과
     * @param {HTMLElement} button - 버튼 요소
     */
    buttonClickFeedback(button) {
        if (!button) return;

        if (this.motionReduced) {
            // 시각적 피드백만 제공
            button.style.backgroundColor = 'var(--color-primary)';
            button.style.color = 'var(--color-text-inverse)';
            
            setTimeout(() => {
                button.style.backgroundColor = '';
                button.style.color = '';
            }, 200);
        } else {
            // 리플 효과나 다른 애니메이션
            button.classList.add('btn-clicked');
            
            setTimeout(() => {
                button.classList.remove('btn-clicked');
            }, this.getAnimationDuration('button-click'));
        }
    }

    /**
     * 카드 진입 애니메이션 (스태거드)
     * @param {NodeList} cards - 카드 요소들
     * @param {number} staggerDelay - 지연 시간 (ms)
     */
    staggerCardEntrance(cards, staggerDelay = 100) {
        if (this.motionReduced) {
            cards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'none';
            });
            return;
        }

        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * staggerDelay);
        });
    }

    /**
     * 스크린 리더 공지
     * @param {string} message - 공지할 메시지
     */
    announceToScreen(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'visually-hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    /**
     * 포커스 트랩 설정
     * @param {HTMLElement} container - 포커스를 가둘 컨테이너
     */
    setupFocusTrap(container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const trapFocus = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        container.addEventListener('keydown', trapFocus);
        firstElement.focus();

        // 트랩 제거 함수를 컨테이너에 저장
        container._removeFocusTrap = () => {
            container.removeEventListener('keydown', trapFocus);
        };
    }

    /**
     * 포커스 트랩 제거
     * @param {HTMLElement} container - 포커스 트랩을 제거할 컨테이너
     */
    removeFocusTrap(container) {
        if (container._removeFocusTrap) {
            container._removeFocusTrap();
            delete container._removeFocusTrap;
        }
    }

    /**
     * 애니메이션 지속 시간 가져오기 (CSS 토큰에서)
     * @param {string} animationType - 애니메이션 타입
     * @returns {number} 지속 시간 (ms)
     */
    getAnimationDuration(animationType) {
        const durations = {
            'reaction-happy': 600,
            'reaction-concerned': 250,
            'reaction-celebrating': 800,
            'reaction-alert': 150,
            'reaction-excited': 600,
            'button-click': 150,
            'toast-exit': 250,
            'modal-exit': 400
        };

        return durations[animationType] || 300;
    }

    /**
     * 토스트 아이콘 가져오기
     * @param {string} type - 토스트 타입
     * @returns {string} 아이콘
     */
    getToastIcon(type) {
        const icons = {
            success: '✓',
            error: '⚠',
            warning: '!',
            info: 'ℹ'
        };

        return icons[type] || 'ℹ';
    }

    /**
     * 모션 감소 모드에서 대안 피드백 적용
     * @param {HTMLElement} element - 대상 요소
     * @param {string} emotion - 감정 상태
     */
    applyAlternativeFeedback(element, emotion) {
        const feedbackStyles = {
            happy: {
                backgroundColor: 'var(--color-success)',
                borderRadius: '50%',
                padding: '4px',
                outline: '3px solid var(--color-success)',
                outlineOffset: '2px'
            },
            concerned: {
                backgroundColor: 'var(--color-warning)',
                borderRadius: '50%',
                padding: '4px',
                outline: '3px solid var(--color-warning)',
                outlineOffset: '2px'
            },
            celebrating: {
                backgroundColor: 'var(--color-primary)',
                borderRadius: '50%',
                padding: '4px',
                outline: '3px solid var(--color-primary)',
                outlineOffset: '2px',
                boxShadow: '0 0 0 6px rgba(31, 199, 212, 0.3)'
            }
        };

        const styles = feedbackStyles[emotion];
        if (styles) {
            Object.assign(element.style, styles);
            
            setTimeout(() => {
                // 스타일 복원
                Object.keys(styles).forEach(prop => {
                    element.style[prop] = '';
                });
            }, 1500);
        }
    }

    /**
     * 성능 최적화를 위한 will-change 관리
     * @param {HTMLElement} element - 대상 요소
     * @param {string} property - 변경될 속성
     */
    optimizeForAnimation(element, property = 'transform') {
        if (!this.motionReduced) {
            element.style.willChange = property;
            
            // 애니메이션 완료 후 정리
            const cleanup = () => {
                element.style.willChange = 'auto';
            };
            
            element.addEventListener('animationend', cleanup, { once: true });
            element.addEventListener('transitionend', cleanup, { once: true });
            
            // 백업 정리 (5초 후)
            setTimeout(cleanup, 5000);
        }
    }
}

// 전역 인스턴스 생성
window.animationHelpers = new AnimationHelpers();

// 초기화 시 모션 감소 설정 적용
document.addEventListener('DOMContentLoaded', () => {
    window.animationHelpers.updateAnimationStates();
});

// ES6 export removed for browser compatibility
// Use window.AnimationHelpers or module.exports instead