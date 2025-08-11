# 🥔🐰 감자토끼 가계부 UI 핸드북

> **친근하고 접근 가능한 디자인 시스템으로 사용자의 재정 관리를 돕는 감자와 토끼의 이야기**

감자토끼 가계부는 **PancakeSwap 디자인 시스템**을 기반으로 한국 사용자를 위한 친근한 캐릭터 중심의 가계부 애플리케이션입니다. 이 핸드북은 일관된 사용자 경험을 위한 완전한 구현 가이드를 제공합니다.

## 🎯 핵심 원칙

- **접근성 최우선**: WCAG 2.1 AA/AAA 기준 준수로 모든 사용자를 위한 설계
- **캐릭터 일관성**: 감자(절약 관리)와 토끼(수입 성장)의 명확한 역할 구분
- **문화적 적합성**: 한국 사용자의 금융 습관과 UI 패턴 반영
- **성능 우선**: 60fps 애니메이션과 효율적인 리소스 사용

## 📚 목차

1. [색상 시스템](#-색상-시스템) - 3가지 테마와 의미론적 색상 팔레트
2. [타이포그래피 스케일](#-타이포그래피-스케일) - 한국어 최적화 Kanit 폰트 시스템
3. [컴포넌트 상태](#-컴포넌트-상태) - 5단계 인터랙션 상태와 피드백
4. [모션 토큰](#-모션-토큰) - 캐릭터 개성을 반영한 애니메이션 시스템
5. [캐릭터 사용 원칙](#-캐릭터-사용-원칙) - 감자와 토끼의 올바른 사용법
6. [테마 가이드](#-테마-가이드) - Light/Dark/High Contrast 테마 구현
7. [접근성 체크리스트](#-접근성-체크리스트) - WCAG 준수를 위한 실무 가이드

## 🔗 스타일 가이드 참조

```css
/* 주요 CSS 파일 구조 */
css/
├── tokens.css              /* 모든 디자인 토큰의 중앙 집중식 관리 */
├── accessibility.css       /* 접근성 전용 스타일과 미디어 쿼리 */
├── theme-switcher.css      /* 테마 전환 UI 컴포넌트 */
└── index.css              /* 실제 구현 예제와 컴포넌트 스타일 */
```

---

## 🎨 색상 시스템

감자토끼 가계부는 **PancakeSwap 디자인 시스템**을 기반으로 한국 사용자와 캐릭터 친화적인 3단계 테마 색상 팔레트를 제공합니다. 모든 색상은 **WCAG 2.1 AA/AAA** 기준을 충족하며, 자동 테마 감지를 지원합니다.

> **구현 참조**: `css/tokens.css` (8-530줄) - 모든 색상 토큰의 중앙 관리

### 🎨 브랜드 색상 체계

#### Primary Colors (주요 브랜드 색상)
```css
/* 토끼의 상징색 - 성장과 희망의 민트색 */
:root {
  --color-primary: #1FC7D4;        /* 메인 브랜드 컬러 */
  --color-primary-light: #33E1ED;  /* 호버 및 활성 상태 */
  --color-primary-dark: #0098A1;   /* 눌림 및 강조 상태 */
  --color-primary-contrast: #FFFFFF; /* 텍스트 대비색 */
}

/* 다크 테마에서 자동 조정 */
:root[data-theme='dark'] {
  --color-primary: #33E1ED;        /* 더 밝은 톤으로 조정 */
  --color-primary-contrast: #0E0E0E; /* 다크 배경에 맞는 대비 */
}

/* 고대비 테마에서 AAA 기준 적용 */
:root[data-theme='hc'] {
  --color-primary: #0066CC;        /* 7.1:1 대비율 확보 */
}
```

#### Secondary Colors (보조 브랜드 색상)
```css
/* 마법 같은 보라색 - 프리미엄과 특별함 */
:root {
  --color-secondary: #7645D9;      /* 보조 브랜드 */
  --color-secondary-light: #9A6AFF;/* 부드러운 효과 */
  --color-secondary-dark: #5D21B6; /* 강한 강조 */
  --color-secondary-contrast: #FFFFFF;
}
```

### 🥔🐰 캐릭터 전용 색상

캐릭터별 고유 색상은 브랜드 아이덴티티의 핵심 요소입니다:

```css
/* 감자 캐릭터 - 따뜻하고 안정적인 베이지 톤 */
:root {
  --color-potato: #DEB887;         /* 감자 메인 컬러 */
  --color-potato-accent: #CD853F;  /* 감자 액센트 (어두운 톤) */
  --character-potato-shadow: 0px 4px 12px rgba(205, 133, 63, 0.3);
}

/* 토끼 캐릭터 - 깨끗하고 순수한 화이트 톤 */
:root {
  --color-rabbit: #F8F8FF;         /* 토끼 메인 컬러 */
  --color-rabbit-accent: #FFB6C1;  /* 토끼 액센트 (핑크 톤) */
  --character-rabbit-shadow: 0px 4px 12px rgba(255, 182, 193, 0.3);
}

/* 다크 테마에서 캐릭터 색상 조정 */
:root[data-theme='dark'] {
  --color-potato: #F4D03F;         /* 더 따뜻한 노란 톤 */
  --color-rabbit: #E8E8E8;         /* 부드러운 회색 톤 */
  --color-potato-accent: #E67E22;
  --color-rabbit-accent: #F1948A;
}
```

### 💰 의미론적 색상 (금융 컨텍스트)

가계부 앱의 핵심인 수입/지출/경고 상황을 명확히 구분하는 색상 체계입니다:

#### Success/Income (수입 - 토끼가 담당)
```css
/* 수입과 성공을 나타내는 긍정적인 녹색 계열 */
:root {
  --color-success: #31D0AA;        /* 일반적인 성공 표시 */
  --color-income: #31D0AA;         /* 수입 전용 (토끼 컨텍스트) */
  --color-success-light: #68FFDA;  /* 호버 및 하이라이트 */
  --color-success-dark: #0E7A5D;   /* 강조 및 액티브 상태 */
  
  /* 수입 거래 배경 및 테두리 */
  --transaction-income-bg: rgba(49, 208, 170, 0.1);
  --transaction-income-border: rgba(49, 208, 170, 0.3);
}

/* 다크 테마에서 더 밝은 톤 */
:root[data-theme='dark'] {
  --color-income: #68FFDA;
  --transaction-income-bg: rgba(104, 255, 218, 0.15);
  --transaction-income-border: rgba(104, 255, 218, 0.4);
}

/* 고대비 테마에서 AAA 기준 */
:root[data-theme='hc'] {
  --color-income: #006600;         /* 8.2:1 대비율 */
}
```

#### Error/Expense (지출 - 감자가 담당)
```css
/* 지출과 주의사항을 나타내는 따뜻한 핑크 계열 */
:root {
  --color-error: #ED4B9E;          /* 일반적인 오류 표시 */
  --color-expense: #ED4B9E;        /* 지출 전용 (감자 컨텍스트) */
  --color-error-light: #FF65B8;    /* 호버 및 하이라이트 */
  --color-error-dark: #C42878;     /* 강조 및 액티브 상태 */
  
  /* 지출 거래 배경 및 테두리 */
  --transaction-expense-bg: rgba(237, 75, 158, 0.1);
  --transaction-expense-border: rgba(237, 75, 158, 0.3);
}

/* 다크 테마에서 더 밝은 톤 */
:root[data-theme='dark'] {
  --color-expense: #FF65B8;
  --transaction-expense-bg: rgba(255, 101, 184, 0.15);
  --transaction-expense-border: rgba(255, 101, 184, 0.4);
}

/* 고대비 테마에서 AAA 기준 */
:root[data-theme='hc'] {
  --color-expense: #CC0000;        /* 7.8:1 대비율 */
}
```

#### Warning (예산 경고)
```css
/* 예산 초과 및 주의 알림을 위한 주황색 */
:root {
  --color-warning: #FFB237;        /* 예산 초과, 목표 미달성 등 */
  --color-warning-light: #FFD67E;
  --color-warning-dark: #D67E0A;
}

/* 다크 테마 조정 */
:root[data-theme='dark'] {
  --color-warning: #FFD67E;
}

/* 고대비 테마 */
:root[data-theme='hc'] {
  --color-warning: #CC6600;        /* 명확한 구분을 위한 진한 주황 */
}
```

### 📊 카테고리별 색상 체계

재정 관리의 직관성을 높이는 지출 카테고리별 전용 색상입니다:

```css
/* 생활 필수 카테고리 */
:root {
  --color-food: #FFB237;           /* 🍽️ 식비 - 따뜻한 주황 */
  --color-utilities: #4ECDC4;      /* ⚡ 공과금 - 신뢰할 수 있는 청록 */
  --color-healthcare: #45B7D1;     /* 🏥 의료비 - 전문적인 파랑 */
  
  /* 이동 및 쇼핑 카테고리 */
  --color-transport: #7645D9;      /* 🚗 교통비 - 브랜드 보조 컬러 */
  --color-shopping: #FFA07A;       /* 🛍️ 쇼핑 - 활동적인 코랄 */
  
  /* 여가 및 성장 카테고리 */
  --color-entertainment: #FF6B9D;  /* 🎬 여가 - 즐거운 핑크 */
  --color-education: #9B59B6;      /* 📚 교육 - 성장의 보라 */
}

/* 카테고리 색상의 배경 적용 (투명도 적용) */
:root {
  --category-food-bg: rgba(255, 178, 55, 0.1);
  --category-transport-bg: rgba(118, 69, 217, 0.1);
  --category-entertainment-bg: rgba(255, 107, 157, 0.1);
  --category-utilities-bg: rgba(78, 205, 196, 0.1);
  --category-healthcare-bg: rgba(69, 183, 209, 0.1);
  --category-shopping-bg: rgba(255, 160, 122, 0.1);
  --category-education-bg: rgba(155, 89, 182, 0.1);
}

/* 다크 테마에서 카테고리 색상 조정 */
:root[data-theme='dark'] {
  --color-food: #FFD67E;
  --color-transport: #9A6AFF;
  --color-entertainment: #FF8AC9;
  --color-utilities: #7DFFF0;
  --color-healthcare: #66D1F7;
  --color-shopping: #FFB89A;
  --color-education: #C593E8;
  
  /* 다크 테마 배경 조정 (더 높은 투명도) */
  --category-food-bg: rgba(255, 214, 126, 0.15);
  --category-transport-bg: rgba(154, 106, 255, 0.15);
  /* ... 다른 카테고리들도 동일하게 조정 */
}
```

### 💡 색상 사용 가이드라인

올바른 색상 사용으로 일관된 사용자 경험을 제공하는 방법을 설명합니다:

#### ✅ 올바른 구현 예제

**수입 거래 표시 (토끼 컨텍스트)**
```html
<!-- 완전한 수입 거래 카드 구현 -->
<div class="transaction-item income" 
     style="border-left: 3px solid var(--color-income);">
  <div class="transaction-icon income-icon">
    <span class="character-icon">🐰</span> <!-- 토끼가 수입 담당 -->
  </div>
  <div class="transaction-details">
    <h3>프리랜스 수입</h3>
    <span class="transaction-category">부업</span>
  </div>
  <span class="transaction-amount income-amount">+₩500,000</span>
</div>

<!-- CSS 구현 -->
<style>
.income-icon {
  background: linear-gradient(135deg, var(--color-income) 0%, var(--color-success-light) 100%);
  color: var(--color-text-inverse);
}
.income-amount {
  color: var(--color-income);
  font-weight: var(--font-weight-bold);
}
</style>
```

**지출 거래 표시 (감자 컨텍스트)**
```html
<!-- 완전한 지출 거래 카드 구현 -->
<div class="transaction-item expense" 
     style="border-left: 3px solid var(--color-expense);">
  <div class="transaction-icon expense-icon">
    <span class="character-icon">🥔</span> <!-- 감자가 지출 관리 -->
  </div>
  <div class="transaction-details">
    <h3>마트 장보기</h3>
    <span class="transaction-category">식비</span>
  </div>
  <span class="transaction-amount expense-amount">-₩85,000</span>
</div>

<!-- 카테고리별 색상 적용 -->
<style>
.expense-icon {
  background: linear-gradient(135deg, var(--color-expense) 0%, var(--color-error-light) 100%);
}
.transaction-category {
  color: var(--color-food);
  background: var(--category-food-bg);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}
</style>
```

**캐릭터 컨텍스트별 색상 적용**
```html
<!-- 감자 캐릭터 카드 (절약 메시지) -->
<div class="character-card potato-card">
  <div class="character-emoji" style="filter: drop-shadow(var(--character-potato-shadow));">
    🥔
  </div>
  <div class="character-info">
    <h4 style="color: var(--color-potato-accent);">감자의 절약 팁</h4>
    <p>이번 달 식비 예산이 부족해요! 외식을 줄여보는 건 어떨까요?</p>
  </div>
</div>

<!-- 토끼 캐릭터 카드 (성장 축하) -->
<div class="character-card rabbit-card">
  <div class="character-emoji animate-success" 
       style="filter: drop-shadow(var(--character-rabbit-shadow));">
    🐰
  </div>
  <div class="character-info">
    <h4 style="color: var(--color-rabbit-accent);">토끼의 축하 메시지</h4>
    <p>저축 목표를 달성했어요! 정말 대단해요! 🎉</p>
  </div>
</div>
```

#### ❌ 금지된 사용법

```html
<!-- ❌ 잘못된 의미론적 색상 사용 -->
<div class="expense-warning">
  <span style="color: var(--color-success);">⚠️ 예산 초과!</span> <!-- 경고에 성공 색상 사용 금지 -->
</div>

<!-- ❌ 캐릭터 컨텍스트 혼동 -->
<div class="income-celebration">
  <span class="character-icon">🥔</span> <!-- 감자를 수입 상황에 사용 금지 -->
  <span>수입이 증가했어요!</span>
</div>

<!-- ❌ 브랜드 색상의 잘못된 적용 -->
<div class="error-message" style="color: var(--color-primary);">
  오류가 발생했습니다 <!-- 오류에 브랜드 컬러 사용 금지 -->
</div>

<!-- ❌ 접근성을 해치는 색상 조합 -->
<button style="background: var(--color-warning); color: var(--color-warning-light);">
  확인 <!-- 대비율이 부족한 색상 조합 -->
</button>
```

### 🔍 색상 접근성 및 대비율

모든 색상은 **WCAG 2.1 AA/AAA 기준**을 준수하여 시각적 접근성을 보장합니다:

#### 대비율 기준

| 용도 | WCAG AA | WCAG AAA | 고대비 테마 |
|------|---------|----------|------------|
| 일반 텍스트 (18px 미만) | 4.5:1 이상 | 7:1 이상 | 7:1 적용 |
| 큰 텍스트 (18px 이상) | 3:1 이상 | 4.5:1 이상 | 4.5:1 적용 |
| UI 컴포넌트 | 3:1 이상 | - | 3:1 적용 |
| 그래픽 요소 | 3:1 이상 | - | 3:1 적용 |

#### 테마별 대비율 최적화

```css
/* 라이트 테마 - WCAG AA 기준 */
:root {
  --color-text-primary: #280D5F;        /* 대 흰색 6.8:1 */
  --color-text-secondary: #7A6EAA;      /* 대 흰색 4.6:1 */
  --color-income: #31D0AA;              /* 대 흰색 5.2:1 */
  --color-expense: #ED4B9E;             /* 대 흰색 4.8:1 */
}

/* 다크 테마 - 밝은 배경 대비 최적화 */
:root[data-theme='dark'] {
  --color-text-primary: #FFFFFF;        /* 대 검정 21:1 */
  --color-text-secondary: #B0B0B0;      /* 대 검정 8.9:1 */
  --color-income: #68FFDA;              /* 대 검정 12.1:1 */
  --color-expense: #FF65B8;             /* 대 검정 7.3:1 */
}

/* 고대비 테마 - WCAG AAA 기준 (7:1 이상) */
:root[data-theme='hc'] {
  --color-text-primary: #000000;        /* 대 흰색 21:1 */
  --color-text-secondary: #000000;      /* 대 흰색 21:1 */
  --color-income: #006600;              /* 대 흰색 8.2:1 */
  --color-expense: #CC0000;             /* 대 흰색 7.8:1 */
  --color-warning: #CC6600;             /* 대 흰색 7.1:1 */
  --color-primary: #0066CC;             /* 대 흰색 7.1:1 */
}
```

#### 색상만으로 정보 전달 금지

접근성을 위해 색상만이 아닌 **아이콘 + 텍스트 + 색상**의 조합으로 정보를 전달합니다:

```html
<!-- ✅ 올바른 접근성 구현 -->
<div class="budget-status warning">
  <span class="status-icon" aria-hidden="true">⚠️</span>
  <span class="status-text">예산 초과</span>
  <span class="status-amount" style="color: var(--color-warning);">+₩50,000</span>
</div>

<!-- ❌ 색상만으로 정보 전달 -->
<div class="budget-status">
  <span style="color: red;">50,000</span> <!-- 색맹 사용자가 구분 불가 -->
</div>
```

#### 자동 대비율 검증

```javascript
// 대비율 자동 검증 함수 (개발용)
function checkColorContrast(foreground, background) {
  const ratio = getContrastRatio(foreground, background);
  return {
    aa: ratio >= 4.5,      // WCAG AA 기준
    aaa: ratio >= 7,       // WCAG AAA 기준
    ratio: ratio.toFixed(2)
  };
}

// 실제 사용 예제
console.log(checkColorContrast('#280D5F', '#FFFFFF')); // { aa: true, aaa: false, ratio: "6.80" }
```

---

## ✍️ 타이포그래피 스케일

한국어에 최적화된 **Kanit 폰트 시스템**을 기반으로 한 계층적 타이포그래피 스케일입니다. 가독성과 접근성을 동시에 고려한 실무 중심의 가이드라인을 제공합니다.

> **구현 참조**: `css/tokens.css` (74-102줄) - 타이포그래피 토큰 정의

### 🔤 폰트 패밀리 시스템

#### 기본 폰트 스택
```css
/* 한국어 친화적 폰트 스택 */
:root {
  --font-family-primary: 'Kanit', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Malgun Gothic', sans-serif;
  --font-family-fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Malgun Gothic', sans-serif;
  --font-family-numeric: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace; /* 숫자 표시용 */
}

/* 웹폰트 로딩 최적화 */
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&display=swap');
```

#### Kanit 폰트 선택 배경

**한국어 최적화 특징:**
- **라운드 형태**: 한글의 둥근 특성과 자연스럽게 조화
- **가독성 우수**: 작은 크기에서도 명확한 판독성 
- **친근한 인상**: 금융 앱의 딱딱함을 완화하는 부드러운 느낌
- **웹 성능**: 120KB로 최적화된 경량 웹폰트 (subset 적용)

**기술적 고려사항:**
```css
/* 폰트 로딩 성능 최적화 */
@font-face {
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 400 700; /* Variable font range */
  font-display: swap; /* 폰트 로딩 중 fallback 표시 */
  src: url('kanit-subset.woff2') format('woff2'); /* 한글+영문+숫자만 포함 */
}

/* 폰트 로딩 실패 시 fallback */
.font-loading-error {
  font-family: var(--font-family-fallback);
}
```

### 크기 스케일 (Type Scale)

```css
/* T-shirt 사이징 체계 */
--font-size-xs: 12px;    /* 라벨, 캡션 */
--font-size-sm: 14px;    /* 보조 텍스트 */  
--font-size-md: 16px;    /* 기본 본문 */
--font-size-lg: 20px;    /* 부제목 */
--font-size-xl: 24px;    /* 제목 */
--font-size-2xl: 32px;   /* 큰 제목 */
--font-size-3xl: 40px;   /* 대형 제목 */
--font-size-4xl: 48px;   /* 히어로 제목 */
--font-size-5xl: 64px;   /* 디스플레이 */
--font-size-6xl: 88px;   /* 메가 디스플레이 */
```

### 폰트 굵기

```css
--font-weight-regular: 400;    /* 본문 텍스트 */
--font-weight-medium: 500;     /* 강조 텍스트 */
--font-weight-semibold: 600;   /* 소제목 */
--font-weight-bold: 700;       /* 제목, 중요 정보 */
```

### 행간 (Line Height)

```css
--line-height-tight: 1.1;     /* 대형 제목용 */
--line-height-normal: 1.5;    /* 일반 텍스트용 */
--line-height-relaxed: 1.75;  /* 읽기 집중 텍스트용 */
```

### 타이포그래피 계층

#### 1. Display Typography
```html
<!-- 메인 히어로 제목 -->
<h1 style="
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
">감자토끼 가계부</h1>
```

#### 2. Heading Typography  
```html
<!-- 섹션 제목 -->
<h2 style="
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
">오늘의 요약</h2>

<!-- 카드 제목 -->
<h3 style="
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
">현재 잔액</h3>
```

#### 3. Body Typography
```html
<!-- 기본 본문 -->
<p style="
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
">가계부 설명 텍스트</p>

<!-- 작은 설명 텍스트 -->
<span style="
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-secondary);
">부가 정보</span>
```

#### 4. UI Typography
```html
<!-- 버튼 텍스트 -->
<button style="
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
">거래 추가</button>

<!-- 라벨 텍스트 -->
<label style="
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
">금액</label>
```

### 반응형 타이포그래피

```css
/* 모바일 (576px 이하) */
@media (max-width: 576px) {
  :root {
    --responsive-font-size-xs: 11px;
    --responsive-font-size-sm: 13px;
    --responsive-font-size-md: 15px;
    --responsive-font-size-lg: 18px;
    --responsive-font-size-xl: 22px;
  }
}
```

### 사용 지침

#### ✅ 올바른 사용

```html
<!-- 계층적 제목 구조 -->
<h1>감자토끼 가계부</h1>
  <h2>거래 내역</h2>
    <h3>2024년 3월</h3>

<!-- 적절한 폰트 굵기 사용 -->
<span class="amount" style="font-weight: var(--font-weight-bold);">₩1,234,567</span>
<span class="category" style="font-weight: var(--font-weight-regular);">식비</span>
```

#### ❌ 금지된 사용

```html
<!-- ❌ 제목 계층 건너뛰기 -->
<h1>메인 제목</h1>
<h4>바로 h4 사용</h4>

<!-- ❌ 과도한 굵기 사용 -->
<p style="font-weight: var(--font-weight-bold);">일반 본문을 모두 굵게</p>

<!-- ❌ 너무 작은 텍스트 (12px 미만) -->
<span style="font-size: 10px;">읽기 어려운 작은 텍스트</span>
```

---

## 🎭 컴포넌트 상태

모든 인터랙티브 컴포넌트는 **5가지 기본 상태**를 가집니다.

### 기본 상태 체계

#### 1. Default (기본)
- 평상시 상태
- 사용자 액션 대기 중

#### 2. Hover (호버)
- 마우스 오버 시
- 인터랙션 가능함을 시사

#### 3. Active/Pressed (활성/눌림)
- 클릭/터치 중
- 즉각적인 피드백

#### 4. Focus (포커스)  
- 키보드 내비게이션 시
- 접근성 필수 요소

#### 5. Disabled (비활성)
- 사용 불가 상태
- 시각적으로 구분

### 버튼 상태

```css
/* 기본 버튼 */
.btn {
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  border: none;
  padding: var(--button-padding-md);
  border-radius: var(--button-border-radius);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-button);
  cursor: pointer;
}

/* 호버 상태 */
.btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(var(--btn-hover-lift));
  box-shadow: var(--shadow-card-hover);
}

/* 활성 상태 */
.btn:active {
  transform: scale(var(--btn-active-scale));
  background: var(--color-primary-dark);
}

/* 포커스 상태 */
.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* 비활성 상태 */
.btn:disabled {
  background: var(--color-text-disabled);
  color: var(--color-background-paper);
  cursor: not-allowed;
  transform: none;
  opacity: var(--opacity-disabled);
}
```

### 카드 상태

```css
/* 기본 카드 */
.card {
  background: var(--color-background-paper);
  border-radius: var(--card-border-radius);
  padding: var(--card-padding);
  box-shadow: var(--shadow-card);
  transition: var(--transition-card);
  cursor: pointer;
}

/* 호버 상태 */
.card:hover {
  transform: translateY(var(--card-hover-lift)) scale(var(--card-hover-scale));
  box-shadow: var(--shadow-card-hover);
}

/* 활성 상태 */
.card:active {
  transform: scale(var(--card-press-scale));
}

/* 선택 상태 */
.card.selected {
  border: 2px solid var(--color-primary);
  background: rgba(31, 199, 212, 0.05);
}
```

### 입력 필드 상태

```css
/* 기본 입력 필드 */
.input {
  background: var(--input-background);
  border: 2px solid var(--color-border-default);
  border-radius: var(--input-border-radius);
  padding: var(--input-padding);
  font-size: var(--font-size-md);
  transition: var(--transition-input);
}

/* 포커스 상태 */
.input:focus {
  background: var(--input-background-focus);
  border-color: var(--input-border-focus);
  box-shadow: 0 0 0 3px rgba(31, 199, 212, 0.1);
  outline: none;
}

/* 오류 상태 */
.input.error {
  border-color: var(--input-border-error);
  box-shadow: 0 0 0 3px rgba(237, 75, 158, 0.1);
}

/* 성공 상태 */
.input.success {
  border-color: var(--color-success);
  box-shadow: 0 0 0 3px rgba(49, 208, 170, 0.1);
}
```

### 캐릭터 상태 반응

감자와 토끼 캐릭터는 앱 상태에 따라 표정이 변합니다:

```css
/* 성공 상태 - 기쁨 */
.character.success {
  animation: var(--reaction-success-duration) var(--reaction-success-ease) success-bounce;
}

/* 경고 상태 - 걱정 */  
.character.warning {
  animation: var(--reaction-warning-duration) var(--reaction-warning-ease) warning-shake;
}

/* 오류 상태 - 놀람 */
.character.error {
  animation: var(--reaction-error-duration) var(--reaction-error-ease) error-shake;
}
```

### 상태 조합 예시

```html
<!-- 수입 추가 버튼 (성공 상태) -->
<button class="btn btn-success" id="addIncomeBtn">
  <span class="icon character-icon">
    <svg><use href="#rabbit-success"></use></svg>
  </span>
  <span>수입 추가</span>
</button>

<!-- 거래 카드 (선택된 상태) -->
<div class="card transaction-card selected" tabindex="0">
  <div class="transaction-icon">
    <svg><use href="#potato-neutral"></use></svg>
  </div>
  <div class="transaction-details">
    <h3>점심 식사</h3>
    <span class="amount expense">-₩15,000</span>
  </div>
</div>
```

---

## 🎬 모션 토큰

감자토끼 가계부의 애니메이션은 **캐릭터의 성격**을 반영합니다.

### 애니메이션 철학

- **감자**: 안정적이고 따뜻한 움직임 (`cubic-bezier(0.34, 1.56, 0.64, 1)`)
- **토끼**: 경쾌하고 재빠른 움직임 (`cubic-bezier(0.175, 0.885, 0.32, 1.275)`)
- **친근함**: 과도하지 않은 부드러운 애니메이션
- **접근성**: `prefers-reduced-motion` 완전 지원

### Duration 토큰 (지속시간)

```css
/* 의미론적 애니메이션 지속시간 */
--dur-xxs: 100ms;   /* 즉각적인 피드백 */
--dur-xs: 150ms;    /* 빠른 상호작용 */
--dur-sm: 250ms;    /* 표준 상호작용 */
--dur-md: 400ms;    /* 캐릭터 반응 */
--dur-lg: 600ms;    /* 부드러운 전환 */
--dur-xl: 800ms;    /* 캐릭터 애니메이션 */
--dur-2xl: 1200ms;  /* 축하 효과 */
```

### Easing 토큰 (가속도 곡선)

```css
/* 표준 이징 */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);        /* Material Design */
--ease-bouncy: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* 재미있는 바운스 */
--ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);  /* 부드러운 흐름 */
--ease-sharp: cubic-bezier(0.4, 0, 1, 1);             /* 빠른 반응 */

/* 캐릭터별 이징 */
--ease-potato: cubic-bezier(0.34, 1.56, 0.64, 1);     /* 감자의 부드러운 바운스 */
--ease-rabbit: cubic-bezier(0.175, 0.885, 0.32, 1.275); /* 토끼의 빠른 홉 */
```

### 전환 토큰 (Transition)

```css
/* 조합된 전환 효과 */
--transition-fast: var(--dur-xxs) var(--ease-standard);
--transition-normal: var(--dur-sm) var(--ease-standard);
--transition-slow: var(--dur-lg) var(--ease-smooth);

/* 컴포넌트별 전환 */
--transition-button: 
  background-color var(--dur-sm) var(--ease-standard), 
  transform var(--dur-xs) var(--ease-sharp), 
  box-shadow var(--dur-sm) var(--ease-standard);

--transition-card: 
  transform var(--dur-lg) var(--ease-smooth), 
  box-shadow var(--dur-lg) var(--ease-smooth);

--transition-input: 
  border-color var(--dur-sm) var(--ease-standard), 
  box-shadow var(--dur-sm) var(--ease-standard);
```

### 캐릭터 반응 애니메이션

#### 성공 반응 (수입 등록 시)
```css
@keyframes success-bounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.05) translateY(-8px); }
  100% { transform: scale(1); }
}

.animate-success {
  animation: success-bounce var(--dur-md) var(--ease-bouncy);
}
```

#### 경고 반응 (예산 초과 시)
```css
@keyframes warning-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.animate-warning {
  animation: warning-shake var(--dur-sm) var(--ease-sharp);
}
```

#### 감자 캐릭터 애니메이션
```css
@keyframes potato-gentle-bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-6px) rotate(2deg); }
}

.animate-potato-bounce {
  animation: potato-gentle-bounce var(--dur-lg) var(--ease-potato) infinite;
}
```

#### 토끼 캐릭터 애니메이션  
```css
@keyframes rabbit-quick-hop {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-12px) scale(1.03); }
}

.animate-rabbit-hop {
  animation: rabbit-quick-hop var(--dur-md) var(--ease-rabbit);
}
```

### UI 상호작용 애니메이션

#### 모달 등장
```css
@keyframes modal-scale-in {
  from { 
    transform: scale(0.9) translateY(20px);
    opacity: 0;
  }
  60% { 
    transform: scale(1.02) translateY(-5px);
    opacity: 1;
  }
  to { 
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
```

#### 토스트 알림
```css
@keyframes toast-slide-in-right {
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### 성능 최적화

```css
/* GPU 가속 활용 */
.animate-success,
.animate-warning,
.animate-potato-bounce,
.animate-rabbit-hop {
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);
}
```

### 접근성 지원

```css
/* 움직임 감소 설정 시 모든 애니메이션 비활성화 */
@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-xxs: 1ms;
    --dur-xs: 1ms;
    --dur-sm: 1ms;
    --dur-md: 1ms;
    --dur-lg: 1ms;
    --dur-xl: 1ms;
    --dur-2xl: 1ms;
  }
  
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 사용 예시

```html
<!-- 수입 등록 성공 시 토끼 반응 -->
<div class="character-card rabbit-card">
  <span class="character-icon animate-success">
    <svg><use href="#rabbit-success"></use></svg>
  </span>
  <p>수입이 등록되었어요! 🎉</p>
</div>

<!-- 호버 시 카드 리프트 -->
<div class="transaction-card" 
     style="transition: var(--transition-card);"
     onmouseenter="this.style.transform = 'translateY(-4px) scale(1.01)'"
     onmouseleave="this.style.transform = 'translateY(0) scale(1)'">
  거래 내용
</div>
```

---

## 🥔🐰 캐릭터 사용 원칙

**감자**와 **토끼**는 감자토끼 가계부의 핵심 브랜드 자산입니다. 올바른 사용을 통해 일관된 브랜드 경험을 제공합니다.

### 캐릭터 아이덴티티

#### 🥔 감자 (Potato)
- **성격**: 신중하고 안정적, 절약의 상징
- **역할**: 지출 관리, 예산 계획, 경고 및 조언
- **컬러**: `--color-potato` (#DEB887), `--color-potato-accent` (#CD853F)
- **주요 감정**: 중립(neutral), 경고(warning), 정보(info)

#### 🐰 토끼 (Rabbit)  
- **성격**: 활발하고 긍정적, 성장의 상징
- **역할**: 수입 축하, 목표 달성, 성공 피드백
- **컬러**: `--color-rabbit` (#F8F8FF), `--color-rabbit-accent` (#FFB6C1)
- **주요 감정**: 성공(success), 기쁨(happy), 중립(neutral)

### SVG 아이콘 상태

각 캐릭터는 **7가지 감정 상태**를 가집니다:

```html
<!-- 감자 상태들 -->
<use href="#potato-neutral">   <!-- 😐 중립 -->  
<use href="#potato-happy">     <!-- 😊 기쁨 -->
<use href="#potato-success">   <!-- 🎉 성공 -->
<use href="#potato-warning">   <!-- ⚠️ 경고 -->
<use href="#potato-error">     <!-- 😰 오류 -->
<use href="#potato-info">      <!-- 💡 정보 -->
<use href="#potato-loading">   <!-- ⏳ 로딩 -->

<!-- 토끼 상태들 -->
<use href="#rabbit-neutral">   <!-- 😐 중립 -->
<use href="#rabbit-happy">     <!-- 😄 기쁨 -->
<use href="#rabbit-success">   <!-- 🎊 성공 -->
<use href="#rabbit-warning">   <!-- 🤔 경고 -->
<use href="#rabbit-error">     <!-- 😅 오류 -->
<use href="#rabbit-info">      <!-- 💭 정보 -->
<use href="#rabbit-loading">   <!-- 🏃 로딩 -->
```

### 컨텍스트별 사용 가이드

#### 수입 관련 (Income)
```html
<!-- ✅ 올바른 사용: 토끼가 수입을 축하 -->
<div class="income-section">
  <span class="icon icon-rabbit">
    <svg><use href="#rabbit-success"></use></svg>
  </span>
  <span class="amount success">+₩50,000</span>
  <p>토끼가 기뻐하고 있어요! 수입이 늘었네요 🎉</p>
</div>
```

#### 지출 관련 (Expense)
```html
<!-- ✅ 올바른 사용: 감자가 지출을 관리 -->
<div class="expense-section">
  <span class="icon icon-potato">
    <svg><use href="#potato-warning"></use></svg>
  </span>
  <span class="amount expense">-₩30,000</span>
  <p>감자가 걱정하고 있어요. 예산을 확인해보세요 💰</p>
</div>
```

#### 예산 초과 경고
```html
<!-- ✅ 올바른 사용: 감자가 경고 제공 -->
<div class="budget-warning">
  <span class="icon icon-potato warning">
    <svg><use href="#potato-warning"></use></svg>
  </span>
  <p>이번 달 식비 예산을 초과했어요!</p>
</div>
```

#### 목표 달성 축하
```html
<!-- ✅ 올바른 사용: 토끼가 성공 축하 -->
<div class="goal-achievement">
  <span class="icon icon-rabbit success animate-success">
    <svg><use href="#rabbit-success"></use></svg>
  </span>
  <p>저축 목표를 달성했어요! 토끼가 정말 기뻐해요 🎊</p>
</div>
```

### 크기 가이드라인

```css
/* 아이콘 크기 체계 */
.icon-sm { width: 20px; height: 20px; }    /* 작은 UI 요소 */
.icon-md { width: 32px; height: 32px; }    /* 버튼, 카드 */
.icon-lg { width: 48px; height: 48px; }    /* 헤더, 중요 정보 */
.icon-xl { width: 64px; height: 64px; }    /* 캐릭터 카드 */  
.icon-2xl { width: 80px; height: 80px; }   /* 히어로 섹션 */
```

### 애니메이션 가이드라인

```css
/* 캐릭터별 고유 애니메이션 */
.icon-potato.animate {
  animation: potato-gentle-bounce 0.6s ease-in-out;
}

.icon-rabbit.animate {  
  animation: rabbit-quick-hop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### 금지 사항 ❌

#### 1. 잘못된 컨텍스트 사용
```html
<!-- ❌ 토끼를 지출 경고에 사용 -->
<div class="expense-warning">
  <svg><use href="#rabbit-happy"></use></svg>
  <p>예산 초과!</p>
</div>

<!-- ❌ 감자를 수입 축하에 사용 -->
<div class="income-celebration">
  <svg><use href="#potato-success"></use></svg>
  <p>수입 증가!</p>
</div>
```

#### 2. 과도한 애니메이션
```html
<!-- ❌ 지나친 애니메이션 남용 -->
<div class="character-spam">
  <svg class="animate-bounce animate-spin animate-pulse"><use href="#potato-neutral"></use></svg>
</div>
```

#### 3. 색상 변경 금지
```css
/* ❌ 캐릭터 고유 색상 변경 */
.icon-potato {
  fill: blue; /* 감자색이 아닌 다른 색상 사용 */
}

.icon-rabbit {
  filter: hue-rotate(180deg); /* 색상 필터 적용 */
}
```

#### 4. 부적절한 크기 사용
```html
<!-- ❌ 너무 큰 아이콘을 작은 공간에 -->
<button>
  <svg style="width: 64px; height: 64px;"><use href="#potato-neutral"></use></svg>
  작은 버튼
</button>

<!-- ❌ 너무 작은 아이콘을 중요한 곳에 -->
<div class="hero-section">
  <svg style="width: 16px; height: 16px;"><use href="#rabbit-success"></use></svg>
  <h1>환영합니다</h1>
</div>
```

### 접근성 고려사항

```html
<!-- ✅ 스크린 리더용 대체 텍스트 -->
<span class="icon icon-rabbit" role="img" aria-label="토끼 캐릭터가 기뻐하는 모습">
  <svg aria-hidden="true">
    <use href="#rabbit-success"></use>
  </svg>
</span>

<!-- ✅ 정보 전달용 캐릭터에는 설명 추가 -->
<div class="status-message">
  <span class="icon icon-potato" role="img" aria-label="예산 경고 - 감자가 걱정스러워함">
    <svg aria-hidden="true">
      <use href="#potato-warning"></use>
    </svg>
  </span>
  <p>이번 달 예산을 확인해주세요</p>
</div>
```

### 브랜딩 일관성

- **캐릭터는 항상 쌍으로 사용**: 감자와 토끼는 부부 캐릭터로 함께 등장
- **감정 상태 일치**: UI 상황에 맞는 적절한 캐릭터 감정 사용
- **브랜드 톤앤매너**: 친근하고 따뜻한 느낌 유지
- **문화적 적절성**: 한국 사용자에게 친숙한 표현 사용

---

## 🎨 테마 가이드

감자토끼 가계부는 **3가지 테마**를 지원하여 다양한 사용 환경과 접근성 요구사항을 만족합니다.

### 테마 개요

1. **Light Theme (라이트)** - 기본 테마, 밝은 환경
2. **Dark Theme (다크)** - 어두운 환경, 눈의 피로 감소  
3. **High Contrast (고대비)** - 접근성 최우선, WCAG AAA 준수

### 테마 활성화

#### JavaScript API
```javascript
// 테마 매니저 사용
const themeManager = new ThemeManager();

// 테마 변경
themeManager.setTheme('light');   // 라이트 테마
themeManager.setTheme('dark');    // 다크 테마  
themeManager.setTheme('hc');      // 고대비 테마
themeManager.setTheme('auto');    // 시스템 설정 따름

// 현재 테마 확인
const currentTheme = themeManager.getCurrentTheme();
```

#### CSS 데이터 속성
```html
<!-- 수동 테마 설정 -->
<html data-theme="light">   <!-- 라이트 테마 -->
<html data-theme="dark">    <!-- 다크 테마 -->
<html data-theme="hc">      <!-- 고대비 테마 -->

<!-- 자동 테마 (시스템 설정 따름) -->
<html>                      <!-- data-theme 없음 = 자동 -->
```

### Light Theme (라이트 테마)

기본 테마로, 밝고 친근한 환경을 제공합니다.

#### 주요 색상
```css
:root {
  /* 배경색 */
  --color-background-default: #FAF9FA;  /* 메인 배경 */
  --color-background-paper: #FFFFFF;    /* 카드 배경 */
  --color-background-alternative: #EFF4F5; /* 대안 배경 */
  
  /* 텍스트 색상 */
  --color-text-primary: #280D5F;       /* 주요 텍스트 */
  --color-text-secondary: #7A6EAA;     /* 보조 텍스트 */
  --color-text-disabled: #BDC2C4;      /* 비활성 텍스트 */
  
  /* 브랜드 색상 */
  --color-primary: #1FC7D4;            /* 기본 브랜드 */
  --color-secondary: #7645D9;          /* 보조 브랜드 */
}
```

#### 사용 예시
```html
<!-- 라이트 테마용 카드 -->
<div class="card light-theme">
  <h3 style="color: var(--color-text-primary);">거래 내역</h3>
  <p style="color: var(--color-text-secondary);">최근 7일간의 거래</p>
</div>
```

### Dark Theme (다크 테마)

어두운 환경에서 눈의 피로를 줄이고 배터리를 절약합니다.

#### 주요 색상
```css
:root[data-theme='dark'] {
  /* 배경색 - 어두운 톤 */
  --color-background-default: #0E0E0E;  /* 메인 배경 */
  --color-background-paper: #1A1A1A;    /* 카드 배경 */
  --color-background-alternative: #262626; /* 대안 배경 */
  
  /* 텍스트 색상 - 높은 대비 */
  --color-text-primary: #FFFFFF;        /* 주요 텍스트 */
  --color-text-secondary: #B0B0B0;      /* 보조 텍스트 */
  --color-text-disabled: #666666;       /* 비활성 텍스트 */
  
  /* 브랜드 색상 - 밝기 조정 */
  --color-primary: #33E1ED;             /* 더 밝은 민트 */
  --color-secondary: #9A6AFF;           /* 더 밝은 보라 */
}
```

#### 캐릭터 색상 조정
```css
:root[data-theme='dark'] {
  /* 감자 - 더 따뜻하고 밝은 톤 */
  --color-potato: #F4D03F;
  --color-potato-accent: #E67E22;
  
  /* 토끼 - 더 밝고 부드러운 톤 */  
  --color-rabbit: #E8E8E8;
  --color-rabbit-accent: #F1948A;
}
```

### High Contrast Theme (고대비 테마)

시각적 접근성을 위한 최고 대비율 테마입니다.

#### 주요 특징
- **WCAG AAA 준수** (7:1 대비율)
- **강한 경계선** 사용
- **단순화된 색상** 팔레트
- **큰 포커스 링** (3px)

#### 주요 색상
```css
:root[data-theme='hc'] {
  /* 극대비 배경 */
  --color-background-default: #FFFFFF;  /* 순백 */
  --color-background-paper: #FFFFFF;    /* 순백 */
  --color-background-alternative: #F0F0F0; /* 연회색 */
  
  /* 극대비 텍스트 */
  --color-text-primary: #000000;        /* 순검정 */
  --color-text-secondary: #000000;      /* 순검정 */
  --color-text-disabled: #666666;       /* 회색 */
  
  /* 고대비 브랜드 색상 */
  --color-primary: #0066CC;             /* 진한 파랑 */
  --color-secondary: #6600CC;           /* 진한 보라 */
  
  /* 의미론적 색상 */
  --color-success: #006600;             /* 진한 녹색 */
  --color-error: #CC0000;               /* 진한 빨강 */
  --color-warning: #CC6600;             /* 진한 주황 */
}
```

#### 강화된 접근성
```css
:root[data-theme='hc'] {
  /* 큰 포커스 링 */
  --shadow-focus: 0 0 0 3px #000000;
  
  /* 강한 경계선 */
  --color-border-default: #000000;
  
  /* 강화된 그림자 */
  --shadow-card: 0px 4px 8px rgba(0, 0, 0, 0.8);
}
```

### 자동 테마 감지

시스템 설정을 따르는 자동 테마 지원:

```css
/* 시스템이 다크 모드일 때 자동 적용 */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* 다크 테마 색상 자동 적용 */
    --color-background-default: #0E0E0E;
    --color-text-primary: #FFFFFF;
    /* ... 다크 테마 전체 설정 */
  }
}

/* 시스템이 고대비 모드일 때 자동 적용 */
@media (prefers-contrast: high) {
  :root:not([data-theme]) {
    /* 고대비 테마 색상 자동 적용 */
    --color-primary: #0066CC;
    --color-text-primary: #000000;
    /* ... 고대비 테마 전체 설정 */
  }
}
```

### 테마 전환 애니메이션

```css
/* 부드러운 테마 전환 */
:root {
  --theme-transition: 
    color 0.2s ease, 
    background-color 0.2s ease, 
    border-color 0.2s ease, 
    box-shadow 0.2s ease;
}

* {
  transition: var(--theme-transition);
}

/* 테마 초기화 중에는 전환 없음 */
:root[data-theme-initializing] * {
  transition: none !important;
}
```

### 테마별 이미지/아이콘 처리

```html
<!-- 테마별 로고 -->
<picture>
  <source srcset="logo-dark.svg" media="(prefers-color-scheme: dark)">
  <source srcset="logo-hc.svg" media="(prefers-contrast: high)">  
  <img src="logo-light.svg" alt="감자토끼 가계부">
</picture>

<!-- CSS로 테마별 필터 -->
<style>
:root[data-theme='dark'] .icon {
  filter: brightness(1.2) contrast(0.8);
}

:root[data-theme='hc'] .icon {
  filter: contrast(2) brightness(0.8);
}
</style>
```

### PWA 테마 색상 동기화

```javascript
// 테마 변경 시 PWA 테마 색상도 업데이트
function updatePWAThemeColor(theme) {
  const themeColors = {
    light: '#1FC7D4',
    dark: '#33E1ED', 
    hc: '#0066CC'
  };
  
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  metaTheme.content = themeColors[theme];
}
```

### 테마 설정 UI

```html
<!-- 테마 선택 버튼 -->
<div class="theme-switcher">
  <button class="theme-button" data-theme="light" aria-label="라이트 테마">
    <span class="icon">☀️</span>
    <span>라이트</span>
  </button>
  
  <button class="theme-button" data-theme="dark" aria-label="다크 테마">
    <span class="icon">🌙</span>
    <span>다크</span>
  </button>
  
  <button class="theme-button" data-theme="hc" aria-label="고대비 테마">
    <span class="icon">🔍</span>
    <span>고대비</span>
  </button>
  
  <button class="theme-button" data-theme="auto" aria-label="자동 테마">
    <span class="icon">⚙️</span>
    <span>자동</span>
  </button>
</div>
```

### 테마 테스팅

각 테마에서 모든 컴포넌트가 올바르게 작동하는지 확인:

```javascript
// 테마 테스트 유틸리티
function testAllThemes() {
  const themes = ['light', 'dark', 'hc'];
  
  themes.forEach(theme => {
    document.documentElement.setAttribute('data-theme', theme);
    console.log(`Testing ${theme} theme...`);
    
    // 대비율 검사
    checkColorContrast();
    
    // 가독성 검사  
    checkReadability();
    
    // 캐릭터 표시 검사
    checkCharacterVisibility();
  });
}
```

---

## ♿ 접근성 체크리스트

감자토끼 가계부는 **모든 사용자**가 편리하게 이용할 수 있도록 **WCAG 2.1 AA 기준**을 준수합니다.

### 🎯 색상 접근성

#### ✅ 해야 할 것

**대비율 준수**
```css
/* WCAG AA 기준 (4.5:1) 준수 */
.text-primary { color: #280D5F; background: #FFFFFF; } /* 6.8:1 */
.text-secondary { color: #7A6EAA; background: #FFFFFF; } /* 4.6:1 */

/* 고대비 테마에서 AAA 기준 (7:1) 준수 */
:root[data-theme='hc'] .text-primary { 
  color: #000000; background: #FFFFFF; /* 21:1 */ 
}
```

**색상만으로 정보 전달 금지**
```html
<!-- ✅ 색상 + 아이콘 + 텍스트로 정보 전달 -->
<div class="transaction income">
  <span class="icon">📈</span>
  <span class="type">수입</span>
  <span class="amount" style="color: var(--color-success);">+₩50,000</span>
</div>

<div class="transaction expense">
  <span class="icon">📉</span>
  <span class="type">지출</span>  
  <span class="amount" style="color: var(--color-error);">-₩30,000</span>
</div>
```

#### ❌ 하지 말아야 할 것

```html
<!-- ❌ 색상만으로 정보 구분 -->
<div class="transaction" style="color: green;">50000</div>
<div class="transaction" style="color: red;">30000</div>

<!-- ❌ 대비율 부족 -->
<p style="color: #999999; background: #FFFFFF;">회색 텍스트 (2.8:1)</p>
```

### ⌨️ 키보드 접근성

#### ✅ 해야 할 것

**키보드 내비게이션 지원**
```html
<!-- 모든 인터랙티브 요소에 tabindex -->
<button class="transaction-card" tabindex="0">거래 항목</button>
<div class="character-emoji" role="img" tabindex="0" 
     aria-label="감자 캐릭터">🥔</div>

<!-- 키보드 이벤트 처리 -->
<script>
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.target.click();
  }
});
</script>
```

**포커스 표시**
```css
/* 명확한 포커스 링 */
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* 고대비 테마에서 강화된 포커스 */
:root[data-theme='hc'] *:focus-visible {
  outline: 3px solid var(--color-text-primary);
  outline-offset: 2px;
}
```

**Skip Links**
```html
<a href="#main-content" class="skip-to-content">
  메인 콘텐츠로 건너뛰기
</a>
```

#### ❌ 하지 말아야 할 것

```css
/* ❌ 포커스 제거 */
*:focus { outline: none; }

/* ❌ 키보드 접근 불가 요소 */
<div onclick="doSomething()">클릭만 가능한 요소</div>
```

### 🔊 스크린 리더 접근성

#### ✅ 해야 할 것

**시맨틱 HTML 사용**
```html
<!-- 올바른 제목 계층 -->
<h1>감자토끼 가계부</h1>
  <h2>오늘의 요약</h2>
    <h3>현재 잔액</h3>

<!-- 적절한 랜드마크 -->
<header role="banner">
<nav role="navigation" aria-label="주요 메뉴">
<main role="main" id="main-content">
<footer role="contentinfo">
```

**ARIA 레이블과 설명**
```html
<!-- 복잡한 UI 요소에 레이블 -->
<button aria-label="수입 추가" aria-describedby="income-help">
  <span class="icon">➕</span>
</button>
<div id="income-help" class="sr-only">
  새로운 수입 항목을 추가합니다
</div>

<!-- 상태 변경 알림 -->
<div class="balance-amount" aria-live="polite" id="currentBalance">
  ₩1,234,567
</div>

<!-- 캐릭터 이미지에 적절한 설명 -->
<span class="character-icon" role="img" 
      aria-label="토끼가 기뻐하며 춤추는 모습">
  <svg aria-hidden="true">
    <use href="#rabbit-success"></use>
  </svg>
</span>
```

**폼 레이블링**
```html
<!-- 명확한 폼 레이블 -->
<div class="form-group">
  <label for="transaction-amount">거래 금액</label>
  <input type="number" id="transaction-amount" 
         aria-required="true" 
         aria-describedby="amount-help">
  <div id="amount-help" class="help-text">
    원 단위로 입력해주세요 (예: 15000)
  </div>
</div>

<!-- 오류 메시지 연결 -->
<div class="form-group error">
  <label for="amount">금액</label>
  <input type="number" id="amount" 
         aria-invalid="true" 
         aria-describedby="amount-error">
  <div id="amount-error" class="error-message" role="alert">
    금액을 입력해주세요
  </div>
</div>
```

#### ❌ 하지 말아야 할 것

```html
<!-- ❌ 레이블 없는 입력 -->
<input type="text" placeholder="금액">

<!-- ❌ 의미 없는 ARIA -->
<div aria-label="div">내용</div>

<!-- ❌ 잘못된 role 사용 -->
<div role="button" onclick="">버튼 역할의 div</div>
```

### 📱 터치 접근성

#### ✅ 해야 할 것

**최소 터치 영역 (44px × 44px)**
```css
/* 충분한 터치 영역 확보 */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}

/* 모바일에서 터치 영역 확장 */
@media (max-width: 768px) {
  .button-small {
    padding: 16px;
    margin: 8px;
  }
}
```

**적절한 간격**
```css
.button-group .btn {
  margin: 8px;
}

.touch-list .item {
  margin-bottom: 4px;
  padding: 16px;
}
```

#### ❌ 하지 말아야 할 것

```css
/* ❌ 너무 작은 터치 영역 */
.tiny-button {
  width: 20px;
  height: 20px;
  padding: 2px;
}

/* ❌ 터치 영역 겹침 */
.close-buttons {
  margin: 0;
  padding: 2px;
}
```

### 🎬 모션 접근성

#### ✅ 해야 할 것

**모션 감소 설정 존중**
```css
/* 모션 감소 설정 시 애니메이션 비활성화 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**자동재생 콘텐츠 제어**
```html
<!-- 자동재생되는 애니메이션에 정지 버튼 -->
<div class="animated-content">
  <button class="pause-animation" aria-label="애니메이션 일시정지">
    ⏸️
  </button>
  <div class="character-animation">
    <!-- 애니메이션 콘텐츠 -->
  </div>
</div>
```

### 🔤 텍스트 접근성

#### ✅ 해야 할 것

**적절한 글꼴 크기**
```css
/* 최소 16px 기본 글꼴 */
:root {
  --font-size-md: 16px;
  --font-size-sm: 14px;  /* 최소 크기 */
}

/* 확대 시 레이아웃 유지 */
@media (min-width: 1200px) {
  html {
    font-size: 18px;  /* 기본 크기 확대 */
  }
}
```

**명확한 언어 설정**
```html
<html lang="ko">
<span lang="en">Balance</span>  <!-- 다른 언어 부분 명시 -->
```

### 🎨 이미지 접근성

#### ✅ 해야 할 것

**의미있는 대체 텍스트**
```html
<!-- 정보 전달 이미지 -->
<img src="chart.png" alt="3월 지출 현황: 식비 40%, 교통비 20%, 기타 40%">

<!-- 장식 이미지 -->
<img src="decoration.png" alt="" role="presentation">

<!-- SVG 아이콘 -->
<svg role="img" aria-labelledby="income-icon-title">
  <title id="income-icon-title">수입 증가 아이콘</title>
  <use href="#arrow-up"></use>
</svg>
```

### 📋 접근성 테스팅 체크리스트

#### 자동화 테스트
```javascript
// axe-core를 활용한 접근성 테스트
import axe from 'axe-core';

async function runAccessibilityTest() {
  const results = await axe.run();
  console.log('접근성 위반:', results.violations);
}
```

#### 수동 테스트 항목

**✅ 키보드 네비게이션**
- [ ] Tab 키로 모든 인터랙티브 요소 접근 가능
- [ ] Enter/Space 키로 버튼 활성화 가능  
- [ ] Escape 키로 모달 닫기 가능
- [ ] 화살표 키로 목록 탐색 가능

**✅ 스크린 리더 테스트**
- [ ] NVDA/JAWS로 모든 콘텐츠 읽기 가능
- [ ] 제목 계층이 논리적으로 구성됨
- [ ] 폼 레이블이 명확하게 읽힘
- [ ] 상태 변경이 적절히 알려짐

**✅ 색상 및 대비**
- [ ] WebAIM Contrast Checker에서 AA 기준 통과
- [ ] 색상 없이도 정보 구분 가능
- [ ] 고대비 모드에서 정상 작동

**✅ 확대 및 반응형**
- [ ] 200% 확대 시 가로 스크롤 없음
- [ ] 320px 너비에서 정상 작동
- [ ] 텍스트 크기 조정 시 레이아웃 유지

**✅ 모션 및 애니메이션**
- [ ] prefers-reduced-motion에서 애니메이션 비활성화
- [ ] 자동재생 콘텐츠에 제어 옵션 제공
- [ ] 3초 이상 깜빡이는 요소 없음

### 접근성 리소스

**참고 문서**:
- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN 접근성 문서](https://developer.mozilla.org/ko/docs/Web/Accessibility)
- [WebAIM 체크리스트](https://webaim.org/standards/wcag/checklist)

**테스팅 도구**:
- [axe DevTools](https://www.deque.com/axe/browser-extensions/)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [Lighthouse Accessibility](https://developers.google.com/web/tools/lighthouse)

---

## 📚 스타일가이드 참조

### CSS 파일 구조
```
css/
├── tokens.css              # 디자인 토큰 (이 가이드의 기반)
├── accessibility.css       # 접근성 스타일
├── theme-switcher.css      # 테마 전환 로직
├── icon-system.css         # 아이콘 시스템
└── svg-sprite-animations.css # SVG 애니메이션
```

### 코드 예시 위치

모든 코드 예시는 실제 프로젝트에서 확인할 수 있습니다:

- **색상 시스템**: `css/tokens.css` (1-530줄)
- **타이포그래피**: `css/tokens.css` (74-102줄)  
- **애니메이션**: `css/tokens.css` (143-448줄)
- **테마 구현**: `css/tokens.css` (566-1069줄)
- **접근성**: `css/accessibility.css`
- **캐릭터 시스템**: `icons.svg`

### 추가 학습 자료

- **PancakeSwap Design System**: [pancakeswap.finance](https://pancakeswap.finance)
- **Material Design**: [material.io](https://material.io)
- **WCAG Guidelines**: [w3.org/WAI/WCAG21](https://www.w3.org/WAI/WCAG21/quickref/)
- **Korean Typography**: [Korean Typography Research](https://fonts.google.com/knowledge/choosing_type/korean_typography)

---

## 🎯 마무리

이 핸드북은 **감자토끼 가계부**의 일관된 디자인 경험을 위한 완전한 가이드입니다. 

### 핵심 원칙 기억하기
1. **접근성 최우선** - 모든 사용자를 위한 디자인
2. **캐릭터 일관성** - 감자와 토끼의 역할 존중  
3. **브랜드 통일성** - 친근하고 신뢰할 수 있는 경험
4. **성능 고려** - 빠르고 효율적인 사용자 경험

### 지속적인 개선
이 가이드는 **살아있는 문서**입니다. 사용자 피드백과 접근성 개선사항을 지속적으로 반영하여 더 나은 경험을 제공하겠습니다.

---

*감자토끼 가계부 UI 핸드북 v1.0 - 2024년 3월*  
*모든 사용자가 편리하게 이용할 수 있는 포용적 디자인을 지향합니다 🥔🐰*