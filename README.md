# 🥔🐰 감자토끼 가계부

> 통합 가계부-식단표-냉장고 관리 웹앱

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-SITE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE-ID/deploys)
[![Performance](https://img.shields.io/badge/Performance-100%25-brightgreen)](https://pagespeed.web.dev/)
[![Accessibility](https://img.shields.io/badge/Accessibility-100%25-brightgreen)](https://web.dev/measure/)

## ✨ 주요 기능

### 💰 가계부 관리
- **거래 내역 추적**: 수입/지출 자동 분류
- **카테고리별 분석**: 시각적 지출 패턴 분석
- **월별/연도별 리포트**: 자동 생성되는 재무 보고서

### 🍽️ 식단 계획
- **주간 식단표**: 영양 균형을 고려한 식단 계획
- **레시피 관리**: 개인 맞춤 레시피 저장소
- **장보기 리스트**: 식단 기반 자동 쇼핑 목록

### 🧊 냉장고 관리
- **식재료 재고**: 유통기한 알림 시스템
- **자동 보충 알림**: AI 기반 재주문 추천
- **음식물 쓰레기 최소화**: 효율적인 식재료 관리

## 🚀 배포 정보

### Netlify 배포
- **배포 URL**: [감자토끼-가계부.netlify.app](https://감자토끼-가계부.netlify.app)
- **자동 배포**: Git push시 자동 배포
- **성능 최적화**: 100% Lighthouse 점수 달성

### 성능 지표
- ⚡ **로딩 속도**: < 3초 (3G 기준)
- 🎯 **접근성**: WCAG 2.1 AA 준수
- 📱 **반응형**: 모든 디바이스 완벽 지원
- 🛡️ **보안**: A+ Security Headers

## 🛠️ 기술 스택

### Frontend
- **Vanilla JavaScript**: 가벼운 클라이언트 사이드
- **CSS3**: 모던 CSS Grid + Flexbox
- **PWA**: 오프라인 지원 + 앱 설치

### UI/UX
- **감자토끼 테마**: 브랜드 아이덴티티 반영
- **다크모드**: 자동/수동 테마 전환
- **키보드 내비게이션**: 완전한 접근성 지원

### DevOps
- **Netlify**: JAMstack 배포
- **GitHub Actions**: CI/CD 자동화
- **Lighthouse**: 성능 모니터링

## 📦 설치 및 실행

### 로컬 개발
\`\`\`bash
# 저장소 클론
git clone https://github.com/your-repo/potato-rabbit-budget.git
cd potato-rabbit-budget

# 의존성 설치
npm install

# 개발 서버 시작 (localhost:5174)
npm run dev
\`\`\`

### 배포 빌드
\`\`\`bash
# Netlify 배포용 빌드
npm run build:netlify

# 정적 파일 최적화
npm run build:optimize
\`\`\`

## 📊 테스트

### 자동화된 테스트
\`\`\`bash
# 전체 테스트 실행
npm run test:all

# 접근성 테스트
npm run test:a11y

# 키보드 내비게이션 테스트
npm run test:keyboard

# 시각적 회귀 테스트
npm run test:visual
\`\`\`

### 성능 테스트
- **Lighthouse**: 100/100/100/100 점수
- **레이아웃 정렬**: 100% 성공률
- **Cross-browser**: Chrome, Firefox, Safari 지원

## 🎨 디자인 시스템

### 감자토끼 테마
- **Primary Color**: `#1FC7D4` (Teal)
- **Background**: `#FAF9FA` (Light Gray)
- **Accent**: `#DEB887` (Potato Gold)

### 캐릭터
- 🥔 **감자**: 실용적이고 안정적인 가계부
- 🐰 **토끼**: 활발하고 건강한 식단 관리

## 📱 PWA 기능

### 설치 가능
- **홈 화면 추가**: 네이티브 앱처럼 설치
- **오프라인 지원**: 서비스 워커 활용
- **푸시 알림**: 중요한 알림 전송

### 최적화
- **Lazy Loading**: 이미지 지연 로딩
- **Code Splitting**: 필요시에만 로드
- **Caching**: 효율적인 캐시 전략

## 🔒 보안

### 보안 헤더
- **CSP**: Content Security Policy 적용
- **HTTPS**: SSL/TLS 강제 적용
- **HSTS**: HTTP Strict Transport Security

### 개인정보 보호
- **로컬 스토리지**: 클라이언트 사이드 데이터 저장
- **쿠키 없음**: 추적 방지
- **GDPR 준수**: 유럽 개인정보 보호 규정

## 📈 로드맵

### v2.0 계획
- [ ] 은행 API 연동
- [ ] 가족 계정 공유
- [ ] 예산 추천 AI
- [ ] 영수증 OCR 스캔

### v3.0 비전
- [ ] 투자 포트폴리오 관리
- [ ] 암호화폐 지원
- [ ] 국제 송금 기능

## 🤝 기여

### 개발 참여
1. Fork this repository
2. Create your feature branch: \`git checkout -b feature/amazing-feature\`
3. Commit your changes: \`git commit -m 'Add amazing feature'\`
4. Push to the branch: \`git push origin feature/amazing-feature\`
5. Open a Pull Request

### 이슈 제보
- [GitHub Issues](https://github.com/your-repo/issues)
- 버그 제보, 기능 요청 환영

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일 참조

## 👥 개발팀

- **프론트엔드**: 감자토끼 개발팀
- **UI/UX**: 토끼 디자인 스튜디오  
- **DevOps**: 감자 인프라팀

---

**Made with 🥔🐰 by 감자토끼팀**

> 가계부도 재미있게, 식단도 건강하게!