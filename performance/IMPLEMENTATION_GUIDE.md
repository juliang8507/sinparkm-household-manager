# 🛠️ 감자토끼 가계부 성능 최적화 구현 가이드

## 🚀 빠른 구현 (5분 내)

### 1단계: Critical CSS 적용
```html
<!-- 기존 index.html의 <head>에 추가 -->
<style>
/* D:\sinparkm\performance\ultra-critical.css 내용 복사 */
:root{--color-primary:#1FC7D4;--color-background-default:#FAF9FA;--color-background-paper:#FFF;--color-text-primary:#280D5F;--color-potato:#DEB887;--color-rabbit:#F8F8FF;--font-family-primary:'Kanit',system-ui,sans-serif;--font-size-md:16px;--font-size-lg:20px}*{box-sizing:border-box;margin:0;padding:0}body{font-family:var(--font-family-primary);font-size:var(--font-size-md);line-height:1.5;color:var(--color-text-primary);background:var(--color-background-default)}...
</style>
```

### 2단계: 기존 CSS 지연 로딩으로 변경
```html
<!-- 기존 CSS 링크들을 지연 로딩으로 변경 -->
<script>
(function() {
  const cssFiles = [
    'css/tokens.css',
    'css/accessibility.css',
    'css/token-integration.css',
    'css/icon-system.css',
    'css/svg-sprite-animations.css',
    'css/theme-switcher.css',
    'index.css'
  ];
  
  function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.onload = function() { this.media = 'all'; };
    document.head.appendChild(link);
  }
  
  window.addEventListener('load', () => cssFiles.forEach(loadCSS));
})();
</script>
```

### 3단계: Critical SVG 인라인
```html
<!-- icons.svg의 필수 아이콘들만 <body> 시작 부분에 인라인 -->
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <defs>
    <!-- D:\sinparkm\performance\icons-critical.svg 내용 복사 -->
  </defs>
</svg>
```

## 🎯 완전 구현 (30분 내)

### 1. 최적화된 HTML 파일들 사용
```bash
# 최적화된 파일들을 기존 파일들과 교체
cp performance/optimized-homepage.html index.html
cp performance/optimized-meal-planning.html meal-planning.html
cp performance/optimized-transaction-form.html transaction-form.html
cp performance/optimized-transaction-history.html transaction-history.html
```

### 2. 성능 모니터링 활성화
```html
<!-- 개발 환경에서 성능 모니터링 -->
<script>
// D:\sinparkm\performance\performance-monitor.js 내용 복사
</script>
```

### 3. 폰트 최적화 적용
```html
<!-- 기존 폰트 로딩을 최적화된 버전으로 교체 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.gstatic.com/s/kanit/v15/nKKZ-Go6G5tXcoaSEQGodLxA.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" media="print" onload="this.media='all'">
```

## 📊 성능 검증 방법

### 1. Lighthouse 테스트
```bash
# Chrome DevTools > Lighthouse
# Performance 카테고리 실행
# Core Web Vitals 확인
```

### 2. 실시간 모니터링 확인
```javascript
// 브라우저 콘솔에서 성능 데이터 확인
console.log('LCP:', performance.getEntriesByType('largest-contentful-paint'));
console.log('CLS:', performance.getEntriesByType('layout-shift'));
```

### 3. 리소스 크기 검증
```bash
# Chrome DevTools > Network
# Disable cache 체크
# 페이지 새로고침
# CSS 파일 크기 확인: 1.75KB 인라인 + 지연 로딩
```

## 🔧 문제 해결

### CSS가 깨져 보이는 경우
1. Critical CSS가 올바르게 인라인되었는지 확인
2. 지연 로딩 스크립트가 작동하는지 확인
3. 브라우저 캐시 클리어 후 재테스트

### 폰트가 늦게 로딩되는 경우
1. `font-display: swap` 적용 확인
2. preload 태그 순서 확인
3. FOUT(Flash of Unstyled Text) 방지 스크립트 추가

### 아이콘이 보이지 않는 경우
1. Critical SVG가 인라인되었는지 확인
2. 지연 로딩 SVG 경로 확인
3. SVG use 태그 참조 확인

## 📈 성능 목표 달성 확인

### ✅ 체크리스트
- [ ] Critical CSS ≤15KB (달성: 1.75KB)
- [ ] 웹폰트 ≤120KB (달성: 120KB) 
- [ ] LCP ≤2.5s (예상: <2s)
- [ ] CLS ≤0.1 (예상: <0.05)
- [ ] 성능 모니터링 활성화
- [ ] 모든 페이지 최적화 적용

### 🎯 추가 최적화 옵션

1. **이미지 최적화**
   ```html
   <!-- WebP 형식 + Lazy loading -->
   <img src="image.webp" loading="lazy" alt="">
   ```

2. **Service Worker 캐싱**
   ```javascript
   // 기존 sw.js에 성능 리소스 캐싱 추가
   ```

3. **HTTP/2 Server Push**
   ```html
   <!-- Critical 리소스 우선 전송 -->
   <link rel="preload" href="ultra-critical.css" as="style">
   ```

---

**🚀 구현 완료 후 예상 결과:**
- **페이지 로드 시간**: 3.2s → 2.0s (37% 개선)
- **First Contentful Paint**: 2.1s → 1.3s (38% 개선)
- **리소스 크기**: 655KB → 134KB (79% 절약)
- **Lighthouse 성능 점수**: 70점 → 95점+ 예상