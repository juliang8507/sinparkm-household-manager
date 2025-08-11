# 다중 테마 시스템 가이드

감자·토끼 가계부의 다중 테마 시스템 사용법과 구현 가이드입니다.

## 🎨 지원하는 테마

### 1. 라이트 테마 (Light Theme)
- **데이터 속성**: `data-theme='light'`
- **색상 구성**: 밝은 배경, 어두운 텍스트
- **사용 상황**: 밝은 환경, 기본 설정
- **WCAG 레벨**: AA (4.5:1 대비)

### 2. 다크 테마 (Dark Theme)
- **데이터 속성**: `data-theme='dark'`
- **색상 구성**: 어두운 배경, 밝은 텍스트
- **사용 상황**: 어두운 환경, 야간 사용
- **WCAG 레벨**: AA (4.5:1 대비)

### 3. 고대비 테마 (High Contrast)
- **데이터 속성**: `data-theme='hc'`
- **색상 구성**: 최대 대비, 선명한 경계
- **사용 상황**: 시각적 접근성 필요
- **WCAG 레벨**: AAA (7:1 대비)

## 🚀 빠른 시작

### 1. CSS 파일 포함
```html
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/theme-controls.css">
```

### 2. JavaScript 추가
```html
<script src="css/theme-manager.js"></script>
```

### 3. 기본 사용법
```javascript
// 테마 설정
window.themeManager.setTheme('dark');

// 테마 순환
window.themeManager.cycleTheme();

// 라이트/다크 토글
window.themeManager.toggleDarkMode();
```

## 🔧 자동 테마 감지

### 시스템 설정 감지
```javascript
// 시스템 설정 확인
const systemPreference = window.themeManager.getSystemPreference();
console.log(systemPreference); // 'light', 'dark', 'hc'

// 시스템 설정으로 재설정
window.themeManager.resetToSystemPreference();
```

### CSS 미디어 쿼리
```css
/* 자동 다크 모드 (시스템 설정) */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* 다크 테마 변수들 */
  }
}

/* 자동 고대비 모드 */
@media (prefers-contrast: high) {
  :root:not([data-theme]) {
    /* 고대비 테마 변수들 */
  }
}
```

## 🎛️ 테마 컨트롤 UI

### 간단한 토글 버튼
```html
<button class="theme-toggle" id="themeToggle" aria-label="테마 전환">
  <span class="theme-toggle-icon">🌞</span>
</button>
```

### 고급 테마 선택기
```html
<div class="theme-selector">
  <button class="theme-selector-button" aria-expanded="false">
    <span class="theme-selector-icon">🌞</span>
    <span class="theme-selector-text">라이트 테마</span>
    <span class="theme-selector-arrow">▼</span>
  </button>
  <div class="theme-selector-dropdown">
    <button class="theme-selector-option" data-theme="light">
      <span class="theme-selector-option-icon">🌞</span>
      <div>라이트 테마</div>
    </button>
    <!-- 다른 옵션들... -->
  </div>
</div>
```

## 🌈 색상 토큰 사용법

### CSS 변수 사용
```css
.my-component {
  background: var(--color-background-paper);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-default);
  box-shadow: var(--shadow-card);
}
```

### JavaScript에서 색상 접근
```javascript
// 현재 테마의 색상 값 가져오기
const primaryColor = window.themeManager.getThemeColor('primary');
const backgroundColor = window.themeManager.getThemeColor('background-paper');
```

## 📱 반응형 및 접근성

### 포커스 링 자동 계산
```css
/* 테마별 포커스 스타일 자동 적용 */
:root[data-theme='light'] *:focus-visible {
  outline: 2px solid var(--color-primary);
}

:root[data-theme='dark'] *:focus-visible {
  outline: 2px solid var(--color-primary-light);
}

:root[data-theme='hc'] *:focus-visible {
  outline: 3px solid var(--color-text-primary);
}
```

### 모션 설정 존중
```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
```

## 🔄 테마 전환 이벤트

### 이벤트 리스닝
```javascript
document.addEventListener('themechange', (event) => {
  console.log('새 테마:', event.detail.theme);
  console.log('이전 테마:', event.detail.previousTheme);
  
  // 테마 변경에 따른 추가 작업
  updateCharacterColors(event.detail.theme);
});
```

### 크로스 탭 동기화
테마 변경이 모든 열린 탭에 자동으로 동기화됩니다.

## 🎯 컴포넌트별 테마 적용

### 감자·토끼 캐릭터
```css
.potato-character {
  color: var(--color-potato);
  background: var(--color-potato-accent);
  box-shadow: var(--character-potato-shadow);
}

.rabbit-character {
  color: var(--color-rabbit);
  background: var(--color-rabbit-accent);
  box-shadow: var(--character-rabbit-shadow);
}
```

### 트랜잭션 카드
```css
.transaction-income {
  background: var(--transaction-income-bg);
  border: 1px solid var(--transaction-income-border);
}

.transaction-expense {
  background: var(--transaction-expense-bg);
  border: 1px solid var(--transaction-expense-border);
}
```

### 카테고리 색상
```css
.category-food {
  background: var(--category-food-bg);
  color: var(--color-food);
}

.category-transport {
  background: var(--category-transport-bg);
  color: var(--color-transport);
}
```

## 🛠️ 커스텀 테마 추가

### 1. CSS 변수 정의
```css
:root[data-theme='custom'] {
  /* 모든 색상 토큰 재정의 */
  --color-primary: #YOUR_COLOR;
  --color-background-default: #YOUR_BG;
  /* ... 기타 변수들 */
}
```

### 2. ThemeManager 확장
```javascript
// 새 테마 등록
window.themeManager.themes.push('custom');

// 테마 이름 매핑 추가
const themeNames = {
  // 기존 테마들...
  custom: '커스텀 테마'
};
```

## 📊 접근성 정보 확인

```javascript
const a11yInfo = window.themeManager.getAccessibilityInfo();
console.log(a11yInfo);
/* 출력:
{
  theme: 'dark',
  isDark: true,
  isHighContrast: false,
  prefersReducedMotion: false,
  systemPreference: 'dark',
  wcagLevel: 'AA'
}
*/
```

## 🔍 디버깅

### 개발 모드 표시기
CSS에 포함된 디버깅 표시기가 현재 활성 테마를 화면에 표시합니다.

```css
/* 프로덕션에서는 제거 */
:root[data-theme='light']::before {
  content: '🌞 Light Theme Active';
  /* 스타일링... */
}
```

### 콘솔 로깅
```javascript
// 테마 변경 시 자동 로깅
window.themeManager.setTheme('dark');
// Console: "Theme applied: dark"
```

## 🚫 주의사항

1. **CSS 변수 누락**: 모든 테마에서 동일한 변수를 정의해야 합니다.
2. **컨트라스트 비율**: 고대비 테마는 7:1, 일반 테마는 4.5:1을 유지하세요.
3. **포커스 표시**: 모든 인터랙티브 요소에 적절한 포커스 스타일을 제공하세요.
4. **테스트**: 모든 테마에서 UI 컴포넌트가 올바르게 작동하는지 확인하세요.

## 🔧 문제 해결

### 테마가 적용되지 않을 때
```javascript
// 테마 매니저 초기화 확인
if (!window.themeManager) {
  console.error('ThemeManager not initialized');
}

// 현재 테마 확인
console.log('Current theme:', window.themeManager?.getTheme());

// DOM 속성 확인
console.log('data-theme:', document.documentElement.getAttribute('data-theme'));
```

### 색상이 올바르게 표시되지 않을 때
```javascript
// CSS 변수 값 확인
const rootStyles = getComputedStyle(document.documentElement);
console.log('Primary color:', rootStyles.getPropertyValue('--color-primary'));
```

## 📚 추가 리소스

- [WCAG 색상 대비 가이드라인](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS 커스텀 프로퍼티 (변수) 가이드](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [prefers-color-scheme 미디어 쿼리](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

---

**💡 팁**: 테마 시스템을 사용할 때는 항상 접근성을 고려하고, 다양한 사용자 환경에서 테스트해보세요!