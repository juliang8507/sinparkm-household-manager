# 🥔🐰 GitHub 업로드 가이드

## 📋 업로드해야 할 핵심 파일 목록

### 1. 필수 설정 파일
- ✅ `package.json`
- ✅ `package-lock.json` 
- ✅ `netlify.toml`
- ✅ `manifest.json`
- ✅ `sw.js`
- ✅ `server.js`

### 2. 메인 HTML/CSS/JS 파일
- ✅ `index.html` + `index.css` + `index.js`
- ✅ `transaction-form.html` + `transaction-form.css` + `transaction-form.js`
- ✅ `transaction-history.html` + `transaction-history.css` + `transaction-history.js`
- ✅ `meal-planning.html` + `meal-planning.css` + `meal-planning.js`

### 3. React 컴포넌트 (전체 src/ 폴더)
- ✅ `src/App.jsx`
- ✅ `src/components/` (atoms, molecules, organisms)
- ✅ `src/pages/` (모든 페이지 컴포넌트)
- ✅ `src/hooks/` (커스텀 훅)
- ✅ `src/utils/` (유틸리티 함수)

### 4. 스타일 시스템
- ✅ `css/` 폴더 전체 (테마, 애니메이션, 토큰)
- ✅ `js/` 폴더 전체 (헬퍼 함수들)

### 5. 아이콘 및 리소스
- ✅ `icons.svg`
- ✅ `potato-rabbit-icons/` 폴더 전체

### 6. 성능 최적화
- ✅ `performance/` 폴더 (Critical CSS, 최적화 스크립트)
- ✅ `scripts/` 폴더 (빌드 도구)

### 7. 테스트 파일 (선택적)
- ✅ `tests/` 폴더 (E2E, 접근성, 키보드 테스트)
- ✅ `playwright.config.js`
- ✅ `jest.config.js`

## 🚀 업로드 방법

### Option 1: 웹 인터페이스 사용
1. https://github.com/juliang8507/sinparkm-household-manager 접속
2. "Upload files" 버튼 클릭
3. 위 파일들을 드래그앤드롭
4. 커밋 메시지 작성 후 커밋

### Option 2: Git 명령어 (토큰 필요)
```bash
# GitHub Personal Access Token 설정 후
git add .
git commit -m "🥔🐰 감자토끼 가계부 - 전체 파일 업로드"
git push -u origin main
```

## 📝 권장 커밋 메시지
```
🥔🐰 감자토끼 가계부 - 전체 프로젝트 업로드

- 통합 가계부-식단표-냉장고 관리 웹앱
- React 컴포넌트 기반 구조
- Netlify 배포 최적화 완료 
- PWA 지원 및 성능 최적화 포함
- 접근성 및 다중 테마 시스템 완료

✅ 웹사이트: https://kihoon-eunsung.netlify.app
```

## ✅ 확인 사항
- [ ] 모든 HTML 파일이 업로드됨
- [ ] CSS/JS 파일들이 올바른 위치에 있음
- [ ] React 컴포넌트(src/)가 완전히 업로드됨
- [ ] package.json과 netlify.toml 존재 확인
- [ ] 아이콘 파일들이 업로드됨