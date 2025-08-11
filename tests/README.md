# 🥔🐰 감자토끼 가계부 - 종합 테스트 스위트

**Korean Household Budget App - Comprehensive Testing Suite**

이 프로젝트는 감자토끼 가계부 앱을 위한 포괄적인 테스트 시스템입니다. 시각적 회귀 테스트, 접근성 검증, 키보드 내비게이션, 다중 테마 지원을 포함한 완전한 품질 보증을 제공합니다.

## 📋 테스트 범위

### 🎨 **시각적 회귀 테스트 (Visual Regression Testing)**
- **스크린샷 생성 및 비교**: 3가지 테마 x 2가지 뷰포트 조합
- **테마 지원**: Light, Dark, High Contrast 테마
- **반응형 테스트**: Mobile (375x667) 및 Desktop (1280x720)
- **차이점 감지**: Pixelmatch를 사용한 정확한 시각적 차이 분석
- **베이스라인 관리**: 자동 베이스라인 생성 및 업데이트

### ♿ **접근성 테스트 (Accessibility Testing)**
- **WCAG 2.1 준수**: AA/AAA 레벨 접근성 검증
- **대비 비율 테스트**: 4.5:1 (AA), 7:1 (AAA) 대비 검증
- **스크린 리더 지원**: ARIA 라벨, 랜드마크, 시맨틱 마크업 검증
- **폼 접근성**: 라벨 연결, 오류 메시지, 필드 검증
- **고대비 테마**: 특별한 접근성 요구사항 검증

### ⌨️ **키보드 내비게이션 테스트 (Keyboard Navigation Testing)**
- **완전한 키보드 지원**: Tab, Shift+Tab, Enter, Space, 화살표 키
- **포커스 트랩**: 모달 및 드롭다운에서의 포커스 관리
- **건너뛰기 링크**: 메인 콘텐츠로 바로가기 기능
- **사용자 플로우**: 전체 앱 기능의 키보드 전용 사용 테스트

### 🎨 **테마 테스트 (Theme Testing)**
- **다중 테마 지원**: Light, Dark, High Contrast 테마
- **테마 전환**: 부드러운 테마 변경 및 지속성 테스트
- **시스템 테마 감지**: `prefers-color-scheme` 미디어 쿼리 대응
- **PWA 테마 동기화**: 매니페스트 및 메타 테마 색상 업데이트
- **컴포넌트 일관성**: 모든 UI 컴포넌트의 테마 적용 검증

## 🛠 기술 스택

- **테스트 프레임워크**: Jest
- **브라우저 자동화**: Puppeteer + Stealth Plugin
- **접근성 검사**: axe-core
- **시각적 비교**: Pixelmatch + PNG.js
- **이미지 처리**: Sharp
- **한국어 폰트 지원**: Google Fonts (Kanit)

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 전체 테스트 실행
```bash
# 모든 테스트 스위트 실행
npm run test:all

# 개별 테스트 실행
npm run test:visual      # 시각적 회귀 테스트
npm run test:a11y        # 접근성 테스트
npm run test:keyboard    # 키보드 내비게이션 테스트
npm run test:themes      # 테마 테스트
```

### 3. 개발 모드 테스트
```bash
# Watch 모드로 테스트 실행
npm run test:watch

# 커버리지 포함 테스트
npm run test:coverage
```

### 4. CI/CD 테스트
```bash
# CI 환경용 테스트 (headless)
npm run test:ci
```

### 5. 종합 테스트 실행기
```bash
# 모든 테스트 + 리포트 생성
node tests/run-all-tests.js
```

## 📊 테스트 리포트

테스트 실행 후 다음 위치에 리포트가 생성됩니다:

- **종합 HTML 리포트**: `tests/reports/comprehensive-test-report.html`
- **접근성 리포트**: `tests/accessibility-reports/`
- **키보드 네비게이션 리포트**: `tests/reports/keyboard_*.json`
- **테마 테스트 리포트**: `tests/reports/theme_*.json`
- **스크린샷**: `tests/screenshots/`

## 📂 디렉토리 구조

```
tests/
├── accessibility/           # 접근성 테스트
│   └── a11y-compliance.test.js
├── keyboard/               # 키보드 네비게이션 테스트
│   └── keyboard-navigation.test.js
├── themes/                 # 테마 테스트
│   └── theme-testing.test.js
├── visual/                 # 시각적 회귀 테스트
│   └── visual-regression.test.js
├── utils/                  # 유틸리티
│   └── test-reporter.js
├── setup/                  # 테스트 설정
│   ├── global-setup.js
│   ├── global-teardown.js
│   └── jest.setup.js
├── screenshots/            # 스크린샷 저장소
│   ├── baseline/          # 베이스라인 이미지
│   ├── current/           # 현재 테스트 이미지
│   └── diffs/            # 차이점 이미지
├── reports/               # 테스트 리포트
├── accessibility-reports/ # 접근성 상세 리포트
└── README.md             # 이 파일
```

## ⚙️ 설정

### Jest 설정 (`jest.config.js`)
- 다중 프로젝트 설정으로 테스트 타입별 분리
- Puppeteer 환경 설정
- 커버리지 임계값 설정
- 한국어 폰트 지원

### Puppeteer 설정 (`jest-puppeteer.config.js`)
- 한국어 폰트 렌더링 최적화
- 브라우저 인스턴스 설정
- 뷰포트 및 디바이스 에뮬레이션

## 🎯 테스트 시나리오

### 페이지별 테스트 범위
1. **홈페이지** (`index.html`)
   - 대시보드 레이아웃
   - 네비게이션 메뉴
   - 테마 스위처

2. **거래 등록** (`transaction-form.html`)
   - 폼 검증
   - 입력 필드 접근성
   - 키보드 네비게이션

3. **거래 내역** (`transaction-history.html`)
   - 테이블 접근성
   - 정렬 및 필터링
   - 페이지네이션

4. **식단 계획** (`meal-planning.html`)
   - 캘린더 인터페이스
   - 드래그 앤 드롭
   - 모바일 최적화

### 뷰포트별 테스트
- **Mobile**: 375x667 (iPhone SE 기준)
- **Tablet**: 768x1024 (iPad 기준)  
- **Desktop**: 1280x720 (표준 데스크톱)
- **Large Desktop**: 1920x1080 (대형 모니터)

## 🔧 사용자 정의

### 새로운 테스트 추가
1. 해당 테스트 타입 디렉토리에 `.test.js` 파일 생성
2. `describe` 블록에 테스트 타입 이름 포함
3. `global.testUtils` 활용

### 베이스라인 업데이트
```bash
# 시각적 베이스라인 초기화
rm -rf tests/screenshots/baseline/*
npm run test:visual
```

### 테마 추가
1. `tests/themes/theme-testing.test.js`의 `themes` 객체에 추가
2. CSS 토큰 정의 확인
3. 대비 비율 요구사항 설정

## 📈 성능 최적화

- **병렬 실행**: Jest 워커를 통한 병렬 테스트
- **스크린샷 캐싱**: 중복 스크린샷 방지
- **브라우저 재사용**: 테스트 간 브라우저 인스턴스 최적화
- **선택적 실행**: 변경된 부분만 테스트

## 🚨 문제 해결

### 일반적인 문제

**한국어 폰트가 렌더링되지 않는 경우**
```bash
# 시스템에 필요한 폰트가 설치되어 있는지 확인
# Windows: 제어판 > 폰트
# macOS: 폰트 관리자
# Linux: fc-list | grep -i korean
```

**스크린샷 차이가 계속 발생하는 경우**
```bash
# 애니메이션 비활성화 확인
# 동적 콘텐츠 숨기기 설정 확인
# 베이스라인 재생성 고려
```

**접근성 테스트 실패**
- axe-core 규칙 업데이트 확인
- WCAG 버전 호환성 검토
- 사용자 정의 규칙 적용

### 디버깅 모드

```bash
# 브라우저 창을 열어서 테스트 확인
CI=false npm run test:visual

# 자세한 로그 출력
DEBUG=true npm test
```

## 🤝 기여하기

1. 이슈 등록 또는 기능 요청
2. 포크 후 브랜치 생성
3. 테스트 추가/수정
4. Pull Request 생성

### 테스트 작성 가이드라인
- 명확한 테스트 이름 사용
- 한국어 설명 포함
- 예상/실제 결과 명시
- 에러 메시지 국제화

## 📞 지원

- **이슈 트래킹**: GitHub Issues
- **문서**: `tests/` 디렉토리 내 README 파일들
- **예제**: 기존 테스트 파일 참조

## 📄 라이선스

MIT License - 자세한 내용은 프로젝트 루트의 LICENSE 파일 참조

---

**🥔🐰 감자토끼 가계부 테스팅 스위트 v1.0.0**  
*완벽한 품질의 한국형 가계부 앱을 위한 종합 테스트 솔루션*