# 🥔🐰 부부 가계부 앱 UI 디자인 시스템

감자(남편) & 토끼(아내) 테마 기반 귀여운 부부 가계부 앱의 완전한 UI 디자인 시스템입니다.

## 🎨 Design System Foundation

### 컬러 팔레트

#### 주요 브랜드 컬러
```css
/* 브랜드 컬러 */
--potato-primary: #FFE59D;     /* 감자 메인 컬러 */
--rabbit-primary: #FFC1D6;     /* 토끼 메인 컬러 */
--couple-accent: #FFD4E5;      /* 커플 액센트 컬러 */

/* 시멘틱 컬러 */
--income-green: #A8E6A3;       /* 수입 - 밝은 그린 */
--expense-coral: #FFB3B3;      /* 지출 - 코랄 */
--warning-yellow: #FFF3A0;     /* 경고 - 옅은 옐로우 */

/* 뉴트럴 컬러 */
--background-cream: #FFFBF5;   /* 배경 크림 */
--surface-white: #FFFFFF;      /* 카드/모달 흰색 */
--border-light: #F0E6D6;       /* 경계선 라이트 */
--text-dark: #5A4A3A;          /* 본문 텍스트 */
--text-medium: #8A7A6A;        /* 보조 텍스트 */
--text-light: #BAA090;         /* 비활성 텍스트 */

/* 그라데이션 */
--gradient-sunset: linear-gradient(135deg, #FFE59D 0%, #FFC1D6 100%);
--gradient-morning: linear-gradient(135deg, #FFF3A0 0%, #FFE59D 100%);
--gradient-evening: linear-gradient(135deg, #FFC1D6 0%, #E6A8D6 100%);
```

#### 확장 컬러 시스템
```css
/* 감자 팔레트 */
--potato-50: #FFFDF8;
--potato-100: #FFF8E6;
--potato-200: #FFF0CC;
--potato-300: #FFE8B3;
--potato-400: #FFE59D;
--potato-500: #FFD966;  /* 베이스 */
--potato-600: #E6C14D;
--potato-700: #CCAA33;
--potato-800: #B3941A;
--potato-900: #997D00;

/* 토끼 팔레트 */
--rabbit-50: #FFFAFC;
--rabbit-100: #FFF0F5;
--rabbit-200: #FFE6EE;
--rabbit-300: #FFDCE6;
--rabbit-400: #FFC1D6;
--rabbit-500: #FFB3CC;  /* 베이스 */
--rabbit-600: #E699B3;
--rabbit-700: #CC8099;
--rabbit-800: #B36680;
--rabbit-900: #994D66;
```

### 타이포그래피

```css
/* 폰트 패밀리 */
--font-primary: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
--font-display: 'Gmarket Sans', 'Pretendard', sans-serif;

/* 폰트 크기 (모바일 기준) */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* 타이포그래피 스케일 */
.text-display-1 {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 700;
  line-height: 1.2;
}

.text-heading-1 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 600;
  line-height: 1.3;
}

.text-heading-2 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  line-height: 1.4;
}

.text-body-lg {
  font-size: var(--text-lg);
  font-weight: 400;
  line-height: 1.6;
}

.text-body-base {
  font-size: var(--text-base);
  font-weight: 400;
  line-height: 1.5;
}

.text-caption {
  font-size: var(--text-sm);
  font-weight: 400;
  line-height: 1.4;
}
```

### 스페이싱 시스템

```css
/* 스페이싱 토큰 */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### 둥근 모서리 & 그림자

```css
/* 둥근 모서리 */
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-full: 9999px;

/* 그림자 시스템 */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 25px rgba(0, 0, 0, 0.12);
--shadow-card: 0 2px 8px rgba(90, 74, 58, 0.06);
--shadow-floating: 0 4px 16px rgba(90, 74, 58, 0.1);
```

## 📱 Responsive Design

### 브레이크포인트
```css
/* 모바일 우선 접근법 */
--breakpoint-sm: 640px;   /* 세로 태블릿 */
--breakpoint-md: 768px;   /* 가로 태블릿 */
--breakpoint-lg: 1024px;  /* 데스크톱 */
--breakpoint-xl: 1280px;  /* 대형 데스크톱 */

/* 미디어 쿼리 믹스인 */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
```

### 모바일 우선 레이아웃
```css
/* 컨테이너 설정 */
.container {
  width: 100%;
  max-width: 100vw;
  padding: 0 var(--space-4);
  margin: 0 auto;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
    padding: 0 var(--space-6);
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
    padding: 0 var(--space-8);
  }
}
```

## 🧩 Core Components

### 카드 컴포넌트
```css
.card {
  background: var(--surface-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  padding: var(--space-6);
  border: 1px solid var(--border-light);
}

.card--elevated {
  box-shadow: var(--shadow-floating);
}

.card--gradient {
  background: var(--gradient-sunset);
  border: none;
  color: var(--text-dark);
}

.card--minimal {
  background: var(--background-cream);
  box-shadow: none;
  border: 1px solid var(--border-light);
}
```

### 버튼 시스템
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--text-base);
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  outline: none;
}

.btn--primary {
  background: var(--gradient-sunset);
  color: var(--text-dark);
}

.btn--potato {
  background: var(--potato-primary);
  color: var(--text-dark);
}

.btn--rabbit {
  background: var(--rabbit-primary);
  color: var(--text-dark);
}

.btn--outline {
  background: transparent;
  border: 2px solid var(--potato-primary);
  color: var(--potato-600);
}

.btn--floating {
  position: fixed;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-floating);
  z-index: 10;
}
```

### 입력 필드
```css
.input {
  width: 100%;
  padding: var(--space-4);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  background: var(--surface-white);
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--potato-primary);
  box-shadow: 0 0 0 3px rgba(255, 229, 157, 0.1);
}

.input--error {
  border-color: var(--expense-coral);
}

.input-group {
  position: relative;
}

.input-group__icon {
  position: absolute;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-medium);
}

.input--with-icon {
  padding-left: calc(var(--space-4) + 1.5rem + var(--space-2));
}
```

## 🎭 Character System

### 감자 캐릭터 (남편)
```css
.character--potato {
  display: inline-block;
  font-size: 2.5rem;
  animation: potato-bounce 2s ease-in-out infinite;
}

@keyframes potato-bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.potato-expression--happy::after {
  content: "🥔";
}

.potato-expression--sleepy::after {
  content: "🥔";
  opacity: 0.7;
}

.potato-expression--excited::after {
  content: "🥔";
  animation: potato-wiggle 0.5s ease-in-out;
}
```

### 토끼 캐릭터 (아내)
```css
.character--rabbit {
  display: inline-block;
  font-size: 2.5rem;
  animation: rabbit-hop 1.8s ease-in-out infinite;
}

@keyframes rabbit-hop {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  40% {
    transform: translateY(-8px) rotate(-2deg);
  }
  60% {
    transform: translateY(-4px) rotate(1deg);
  }
}

.rabbit-expression--happy::after {
  content: "🐰";
}

.rabbit-expression--shy::after {
  content: "🐰";
  opacity: 0.8;
}

.rabbit-expression--love::after {
  content: "🐰";
  animation: rabbit-heart 1s ease-in-out;
}
```

## 🌟 Component Architecture

### CSS 클래스 네이밍 컨벤션
```
BEM 방식 기반:
- .block
- .block__element
- .block--modifier
- .block__element--modifier

예시:
- .card
- .card__header
- .card--elevated
- .card__header--sticky
```

### 컴포넌트 구조 템플릿
```html
<!-- 기본 컴포넌트 구조 -->
<div class="component-name component-name--modifier">
  <div class="component-name__header">
    <h3 class="component-name__title">Title</h3>
    <div class="component-name__actions">
      <!-- 액션 버튼들 -->
    </div>
  </div>
  
  <div class="component-name__content">
    <!-- 메인 콘텐츠 -->
  </div>
  
  <div class="component-name__footer">
    <!-- 푸터 영역 -->
  </div>
</div>
```

## 🎨 Animation & Interaction

### 애니메이션 시스템
```css
/* 전환 효과 */
--transition-fast: 0.15s ease;
--transition-base: 0.2s ease;
--transition-slow: 0.3s ease;

/* 이징 함수 */
--ease-in-quart: cubic-bezier(0.5, 0, 0.75, 0);
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1);

/* 공통 애니메이션 */
.fade-in {
  animation: fadeIn 0.3s ease-out;
}

.slide-up {
  animation: slideUp 0.3s ease-out;
}

.bounce-in {
  animation: bounceIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}
```

### 스와이프 제스처 지원
```css
.swipeable {
  touch-action: pan-x;
  user-select: none;
  transition: transform var(--transition-base);
}

.swipeable--swiping {
  transition: none;
}

.swipeable__actions {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
```

이 디자인 시스템을 기반으로 다음 단계에서 각 화면별 상세 컴포넌트를 설계하겠습니다! 🎨✨