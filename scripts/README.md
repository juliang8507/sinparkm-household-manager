# 감자토끼 가계부 PWA 에셋 생성기

감자토끼 가계부 앱을 위한 PWA 아이콘, 스플래시 스크린, 숏컷 아이콘을 자동으로 생성하는 Node.js 스크립트입니다.

## 🎯 기능

- **PWA 아이콘 생성**: 72×72부터 512×512까지 다양한 크기의 앱 아이콘
- **스플래시 스크린**: iOS, Android 다양한 디바이스 크기별 스플래시 이미지
- **테마 지원**: Light, Dark, High Contrast 3가지 테마별 에셋
- **숏컷 아이콘**: 수입/지출/내역 앱 숏컷용 아이콘
- **자동 HTML 업데이트**: 매니페스트 링크 자동 추가

## 📦 설치 및 실행

### 1. 의존성 설치
```bash
cd scripts
npm install
# 또는
npm run setup
```

### 2. 에셋 생성 실행
```bash
npm run generate
# 또는
node generate-pwa-assets.js
```

## 📁 생성되는 파일 구조

```
assets/
├── icons/
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── shortcut-income.png
│   ├── shortcut-expense.png
│   └── shortcut-history.png
└── splash/
    ├── splash-iphone5-light.png
    ├── splash-iphone5-dark.png
    ├── splash-iphone5-hc.png
    ├── splash-iphone6-light.png
    └── ... (다양한 디바이스 × 3가지 테마)
```

## 🎨 디자인 특징

### 캐릭터 디자인
- **감자**: 갈색(#D4A574) 타원형 캐릭터, 왼쪽 배치
- **토끼**: 흰색(#F0F0F0) 타원형 캐릭터, 귀 포함, 오른쪽 배치

### 테마별 색상
- **Light**: Primary #1FC7D4, Background #FAF9FA
- **Dark**: Primary #33E1ED, Background #0E0E0E  
- **High Contrast**: Primary #0066CC, Background #FFFFFF

### 아이콘 크기별 최적화
- **작은 아이콘(16-96px)**: 캐릭터만 표시
- **큰 아이콘(128px+)**: 캐릭터 + "가계부" 텍스트 추가

## 🔧 커스터마이징

### 색상 변경
`PWAAssetGenerator` 클래스의 `themes` 객체에서 테마별 색상을 수정할 수 있습니다:

```javascript
this.themes = {
  light: {
    primary: '#1FC7D4',    // 메인 색상
    background: '#FAF9FA', // 배경 색상  
    text: '#280D5F'        // 텍스트 색상
  }
  // ...
};
```

### 아이콘 크기 추가
`iconSizes` 배열에 새로운 크기를 추가하면 자동으로 생성됩니다:

```javascript
this.iconSizes = [72, 96, 128, 144, 152, 192, 384, 512, 1024]; // 1024 추가
```

### 스플래시 크기 추가
`splashSizes` 배열에 새로운 디바이스 크기를 추가할 수 있습니다:

```javascript
this.splashSizes = [
  // 기존 크기들...
  { width: 428, height: 926, name: 'iphone13pro' } // iPhone 13 Pro
];
```

## 🚀 PWA 테마 동기화 기능

생성된 에셋들은 앱의 테마 시스템과 연동되어 다음 기능을 제공합니다:

- **런타임 매니페스트 업데이트**: `js/theme-switcher.js`를 통한 동적 테마 색상 변경
- **메타 태그 동기화**: `<meta name="theme-color">` 실시간 업데이트
- **Service Worker 연동**: PWA 캐시 및 테마 변경 알림

## 📱 지원 플랫폼

- **iOS**: iPhone 5/SE부터 iPad Pro까지
- **Android**: 다양한 화면 크기 (Small/Medium/Large)
- **Desktop PWA**: Windows, macOS, Linux

## 🔍 트러블슈팅

### Canvas 설치 오류
Canvas 라이브러리 설치 시 네이티브 모듈 컴파일 오류가 발생할 수 있습니다:

**Windows:**
```bash
npm install --global --production windows-build-tools
npm install canvas
```

**macOS:**
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
npm install canvas
```

**Ubuntu/Debian:**
```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
npm install canvas
```

### Sharp 설치 오류
Sharp 라이브러리 설치 시 플랫폼별 바이너리 다운로드 오류:

```bash
npm install --platform=linux --arch=x64 sharp
# 또는 강제 재빌드
npm rebuild sharp
```

## 📄 라이선스

MIT License - 자유롭게 사용하고 수정할 수 있습니다.