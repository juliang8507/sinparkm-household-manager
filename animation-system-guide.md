# 감자·토끼 가계부 애니메이션 시스템 가이드

## 개요

감자·토끼 가계부의 애니메이션 시스템은 친근하고 부드러운 사용자 경험을 제공하기 위해 설계되었습니다. Magic MCP의 모던한 애니메이션 패턴을 기반으로 하며, 캐릭터의 개성과 앱의 따뜻한 감성을 반영합니다.

## 🎯 핵심 특징

- **캐릭터 중심**: 감자와 토끼의 개성을 반영한 애니메이션 곡선
- **접근성 우선**: prefers-reduced-motion 완벽 지원
- **성능 최적화**: GPU 가속과 60fps 보장
- **토큰 기반**: 일관된 디자인 언어
- **배터리 효율**: 저성능 기기 배려

## 📁 파일 구조

```
css/
├── tokens.css              # 애니메이션 토큰 정의
├── animation-utilities.css # 실용적인 유틸리티 클래스
src/hooks/
└── useAnimations.js        # React 애니메이션 훅
```

## 🎨 애니메이션 토큰 체계

### Duration 토큰

```css
--dur-xxs: 100ms;   /* Ultra-fast feedback */
--dur-xs: 150ms;    /* Quick interactions */
--dur-sm: 250ms;    /* Standard interactions */
--dur-md: 400ms;    /* Character reactions */
--dur-lg: 600ms;    /* Gentle transitions */
--dur-xl: 800ms;    /* Smooth character animations */
--dur-2xl: 1200ms;  /* Celebration effects */
```

### Easing 토큰

```css
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);        /* Material Design 표준 */
--ease-bouncy: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* 장난스러운 바운스 */
--ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);  /* 부드러운 흐름 */
--ease-sharp: cubic-bezier(0.4, 0, 1, 1);             /* 빠른 응답 */
--ease-potato: cubic-bezier(0.34, 1.56, 0.64, 1);     /* 감자의 부드러운 바운스 */
--ease-rabbit: cubic-bezier(0.175, 0.885, 0.32, 1.275); /* 토끼의 빠른 홉 */
```

## 🎭 캐릭터 리액션 시스템

### 성공 리액션 (기쁜 바운스)

```css
.animate-success {
  animation: success-bounce var(--reaction-success-duration) var(--reaction-success-ease);
}
```

**사용 시점**: 저장 완료, 목표 달성, 성공적인 입력

### 경고 리액션 (부드러운 흔들림)

```css
.animate-warning {
  animation: warning-shake var(--reaction-warning-duration) var(--reaction-warning-ease);
}
```

**사용 시점**: 예산 초과 경고, 입력 값 확인 필요

### 정보 리액션 (부드러운 펄스)

```css
.animate-info {
  animation: info-pulse var(--reaction-info-duration) var(--reaction-info-ease) var(--reaction-info-iterations);
}
```

**사용 시점**: 팁 표시, 새로운 기능 안내

### 에러 리액션 (주의 끌기 흔들림)

```css
.animate-error {
  animation: error-shake var(--reaction-error-duration) var(--reaction-error-ease);
}
```

**사용 시점**: 입력 오류, 네트워크 에러, 필수 필드 누락

## 🔘 버튼 인터랙션

### 기본 리프트 효과

```jsx
import { useButtonAnimation } from '../hooks/useAnimations';

function MyButton({ children, ...props }) {
  const { buttonProps } = useButtonAnimation('lift');
  
  return (
    <button {...buttonProps} {...props}>
      {children}
    </button>
  );
}
```

### 바운스 효과

```jsx
const { buttonProps } = useButtonAnimation('bounce');
```

### 리플 효과

```jsx
const { buttonProps } = useButtonAnimation('ripple');
```

## 🃏 카드 인터랙션

### 호버 리프트

```jsx
import { useCardAnimation } from '../hooks/useAnimations';

function TransactionCard({ transaction }) {
  const { cardProps } = useCardAnimation('hover');
  
  return (
    <div {...cardProps}>
      {/* 카드 내용 */}
    </div>
  );
}
```

### 자동 플로팅

```jsx
const { cardProps } = useCardAnimation('hover', true); // autoFloat = true
```

## 🎪 캐릭터 애니메이션

### 감자 캐릭터

```jsx
import { useCharacterAnimation } from '../hooks/useAnimations';

function PotatoCharacter() {
  const { getCharacterProps, playHappy } = useCharacterAnimation('potato');
  
  return (
    <div 
      {...getCharacterProps()}
      onClick={playHappy}
    >
      🥔
    </div>
  );
}
```

**사용 가능한 애니메이션**:
- `playHappy()`: 기쁨 표현 (wiggle)
- `playBounce()`: 부드러운 바운스
- `playAlert()`: 주의 끌기

### 토끼 캐릭터

```jsx
function RabbitCharacter() {
  const { getCharacterProps, playAlert } = useCharacterAnimation('rabbit');
  
  return (
    <div 
      {...getCharacterProps()}
      onClick={playAlert}
    >
      🐰
    </div>
  );
}
```

**사용 가능한 애니메이션**:
- `playHappy()`: 기쁨 표현 (hop)
- `playAlert()`: 귀 떨림 (twitch)
- `playBounce()`: 빠른 홉

## 🍞 토스트 알림

```jsx
import { useToastAnimation } from '../hooks/useAnimations';

function MyComponent() {
  const { toasts, showToast, removeToast } = useToastAnimation();
  
  const handleSave = () => {
    showToast('저장이 완료되었습니다!', 'success', 3000, 'top-right');
  };
  
  return (
    <>
      <button onClick={handleSave}>저장</button>
      
      {/* 토스트 렌더링 */}
      <div className="toast-container top-right">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`toast ${toast.type} toast-enter-right`}
            onClick={() => removeToast(toast.id)}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </>
  );
}
```

## 🎨 모달 애니메이션

```jsx
import { useModalAnimation } from '../hooks/useAnimations';

function MyModal() {
  const { isVisible, openModal, closeModal, modalProps, contentProps } = useModalAnimation(true); // bounceOnOpen
  
  return (
    <>
      <button onClick={openModal}>모달 열기</button>
      
      {isVisible && (
        <div {...modalProps}>
          <div {...contentProps}>
            <h2>모달 제목</h2>
            <p>모달 내용</p>
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}
    </>
  );
}
```

## 📝 입력 필드 피드백

```jsx
import { useInputFeedback } from '../hooks/useAnimations';

function FormInput({ value, onChange }) {
  const { getInputProps, showSuccess, showError } = useInputFeedback();
  
  const handleSubmit = () => {
    if (value.length < 3) {
      showError();
      return;
    }
    showSuccess();
  };
  
  return (
    <input 
      {...getInputProps()}
      value={value}
      onChange={onChange}
      placeholder="입력해주세요"
    />
  );
}
```

## 📋 리스트 스태거 애니메이션

```jsx
import { useStaggerAnimation } from '../hooks/useAnimations';

function TransactionList({ transactions }) {
  const { getItemProps } = useStaggerAnimation(transactions, 50); // 50ms 간격
  
  return (
    <div>
      {transactions.map((transaction, index) => (
        <div 
          key={transaction.id} 
          {...getItemProps(index)}
          className="toast-enter-top" // 진입 애니메이션 추가
        >
          {/* 거래 내용 */}
        </div>
      ))}
    </div>
  );
}
```

## 🔄 로딩 애니메이션

```jsx
import { useLoadingAnimation } from '../hooks/useAnimations';

function SaveButton() {
  const { isLoading, startLoading, stopLoading, getLoadingProps } = useLoadingAnimation('shimmer');
  
  const handleSave = async () => {
    startLoading();
    try {
      await saveData();
    } finally {
      stopLoading();
    }
  };
  
  return (
    <button 
      {...getLoadingProps()}
      onClick={handleSave}
      disabled={isLoading}
    >
      {isLoading ? '저장 중...' : '저장'}
    </button>
  );
}
```

## 🌟 통합 애니메이션 컨텍스트

```jsx
import { useAnimationContext } from '../hooks/useAnimations';

function App() {
  const { playFeedback, toast, shouldAnimate } = useAnimationContext();
  
  const handleTransaction = (type) => {
    playFeedback('success', '거래가 저장되었습니다!');
  };
  
  return (
    <div>
      {/* 앱 내용 */}
      
      {/* 토스트 컨테이너 */}
      <div className="toast-container top-right">
        {toast.toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type} toast-enter-right`}>
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## ♿ 접근성 지원

### 자동 모션 감소 지원

```jsx
import { useAccessibleAnimation } from '../hooks/useAnimations';

function AccessibleComponent() {
  const { getAnimationProps, shouldAnimate } = useAccessibleAnimation();
  
  return (
    <div {...getAnimationProps('animate-success', 'feedback-success')}>
      {shouldAnimate ? '애니메이션이 재생됩니다' : '정적 피드백'}
    </div>
  );
}
```

### CSS에서의 자동 처리

```css
@media (prefers-reduced-motion: reduce) {
  /* 모든 애니메이션이 자동으로 비활성화됩니다 */
  --dur-xxs: 1ms;
  --dur-xs: 1ms;
  /* ... */
  
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🚀 성능 최적화

### GPU 가속 자동 적용

```css
.animate-success,
.animate-warning,
/* ... 기타 애니메이션 클래스 */ {
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);
}
```

### 배터리 효율성 고려

```css
@media (update: slow) {
  .animate-potato-bounce,
  .animate-float {
    animation-play-state: paused;
  }
}
```

## 🎭 테마별 애니메이션

### 다크 테마

```css
:root[data-theme='dark'] .loading-shimmer::after {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.05),
    transparent
  );
}
```

### 고대비 테마

```css
:root[data-theme='hc'] .btn-ripple::after {
  background: rgba(0, 0, 0, 0.2);
}
```

## 📊 애니메이션 성능 모니터링

### 개발 도구에서 확인

```javascript
// 개발 환경에서 애니메이션 성능 확인
if (process.env.NODE_ENV === 'development') {
  // Performance Observer로 애니메이션 성능 모니터링
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'measure') {
        console.log(`Animation: ${entry.name} took ${entry.duration}ms`);
      }
    }
  });
  observer.observe({ entryTypes: ['measure'] });
}
```

## 🎨 커스텀 애니메이션 추가

### 새로운 캐릭터 애니메이션

```css
@keyframes custom-celebration {
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(5deg); }
  50% { transform: scale(1.2) rotate(-5deg); }
  75% { transform: scale(1.1) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.animate-celebration {
  animation: custom-celebration var(--dur-lg) var(--ease-bouncy) 2;
}
```

### React 훅 확장

```javascript
// useAnimations.js에 추가
export const useCelebrationAnimation = () => {
  const celebrate = useCallback(() => {
    // 셀레브레이션 로직
  }, []);
  
  return { celebrate };
};
```

## 🔧 트러블슈팅

### 애니메이션이 재생되지 않을 때

1. **CSS 클래스 확인**: 올바른 클래스가 적용되었는지 확인
2. **접근성 설정**: `prefers-reduced-motion` 설정 확인
3. **브라우저 지원**: 브라우저 호환성 확인
4. **성능**: GPU 메모리 부족 여부 확인

### 성능 이슈가 있을 때

1. **애니메이션 수 줄이기**: 동시 실행 애니메이션 최소화
2. **GPU 가속 확인**: `transform`과 `opacity` 사용 우선
3. **배터리 모드**: 저성능 모드에서 애니메이션 일시정지

## 🎯 베스트 프랙티스

1. **의미 있는 애니메이션**: 사용자 경험 개선에 도움이 되는 애니메이션만 사용
2. **일관된 타이밍**: 토큰 시스템 활용으로 일관성 유지
3. **접근성 우선**: 항상 `prefers-reduced-motion` 고려
4. **성능 모니터링**: 정기적인 성능 점검
5. **점진적 향상**: 기본 기능 우선, 애니메이션은 부가 기능

---

이 애니메이션 시스템을 통해 감자·토끼 가계부는 사용자에게 친근하고 즐거운 경험을 제공하며, 동시에 접근성과 성능을 보장합니다.