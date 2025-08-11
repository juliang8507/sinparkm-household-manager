# 감자·토끼 캐릭터 SVG 아이콘 시스템

감자토끼 가계부 앱을 위한 포괄적인 캐릭터 기반 아이콘 시스템입니다. 6가지 표정을 가진 감자·토끼 캐릭터와 빈 상태 일러스트를 제공합니다.

## 📁 파일 구조

```
potato-rabbit-icons/
├── design-system.md           # 디자인 원칙과 가이드라인
├── PotatoRabbitIcons.tsx      # React 컴포넌트
├── README.md                  # 이 파일
├── 
├── 감자 캐릭터 SVG (6개)
├── potato-neutral.svg         # 기본 평온한 감자
├── potato-success.svg         # 기쁜 감자 (성공)
├── potato-warning.svg         # 걱정하는 감자 (주의)
├── potato-info.svg           # 호기심 많은 감자 (정보)
├── potato-error.svg          # 당황한 감자 (오류)
├── potato-loading.svg        # 졸린 감자 (로딩)
├── 
├── 토끼 캐릭터 SVG (6개)
├── rabbit-neutral.svg        # 기본 평온한 토끼
├── rabbit-success.svg        # 활기찬 토끼 (성공)
├── rabbit-warning.svg        # 경계하는 토끼 (주의)  
├── rabbit-info.svg          # 궁금한 토끼 (정보)
├── rabbit-error.svg         # 놀란 토끼 (오류)
├── rabbit-loading.svg       # 사색하는 토끼 (로딩)
├── 
└── 빈 상태 일러스트 (3개)
    ├── empty-transactions.svg    # 거래 내역 없음
    ├── empty-meals.svg          # 식사 기록 없음
    └── loading-state.svg        # 로딩 중 상태
```

## 🎨 디자인 특징

### 감자 캐릭터
- **색상**: 오렌지/갈색 톤 (#D4A574, #8B4513)
- **성격**: 온화하고 안정적
- **특징**: 동글동글한 형태, 표면 점무늬
- **용도**: 안정성, 신뢰감을 나타내는 상황

### 토끼 캐릭터  
- **색상**: 회색/흰색 톤 (#E0E0E0, #808080, #FFB6C1)
- **성격**: 활발하고 호기심 많음
- **특징**: 긴 귀, 둥근 얼굴, Y자 모양 코
- **용도**: 활동성, 민첩함을 나타내는 상황

## 🎭 표정 시스템

| 표정 | 감자 | 토끼 | 사용 상황 |
|------|------|------|-----------|
| **neutral** | 평온한 감자 | 평온한 토끼 | 기본 상태, 대기 |
| **success** | 기쁜 감자<br/>반달 눈, 큰 미소 | 활기찬 토끼<br/>귀 위로, 활짝 웃음 | 성공, 완료, 긍정 |
| **warning** | 걱정하는 감자<br/>찡그린 눈썹 | 경계하는 토끼<br/>귀 앞으로, 작은 입 | 주의, 경고, 확인 필요 |
| **info** | 호기심 많은 감자<br/>한 눈 윙크 | 궁금한 토끼<br/>머리 기울임 | 정보, 도움말, 팁 |
| **error** | 당황한 감자<br/>큰 눈, 벌어진 입 | 놀란 토끼<br/>귀 뒤로, 땀방울 | 오류, 실패, 문제 |
| **loading** | 졸린 감자<br/>눈 감음, Z 표시 | 사색하는 토끼<br/>한 귀 내림, 생각 구름 | 로딩, 처리 중 |

## 🚀 사용 방법

### React 컴포넌트 사용

```tsx
import { PotatoIcon, RabbitIcon, CharacterIcon, EmptyStateIcon } from './PotatoRabbitIcons';

// 개별 캐릭터 사용
<PotatoIcon emotion="success" size={32} />
<RabbitIcon emotion="warning" size={24} />

// 통합 컴포넌트 사용
<CharacterIcon character="potato" emotion="info" size={48} />
<CharacterIcon character="rabbit" emotion="loading" size={36} />

// 빈 상태 일러스트
<EmptyStateIcon type="transactions" size={120} />
<EmptyStateIcon type="meals" size={100} />
<EmptyStateIcon type="loading" size={80} />
```

### 직접 SVG 사용

```html
<!-- HTML에서 직접 사용 -->
<img src="./potato-success.svg" alt="기쁜 감자" width="24" height="24">

<!-- CSS에서 배경 이미지로 사용 -->
.success-icon {
  background-image: url('./potato-success.svg');
  width: 24px;
  height: 24px;
}
```

### CSS 커스터마이징

```css
/* 색상 변경 */
.potato-icon path[fill="#D4A574"] {
  fill: #E6B89C; /* 더 밝은 감자 색상 */
}

/* 크기 반응형 */
.character-icon {
  width: 1.5rem;
  height: 1.5rem;
}

@media (min-width: 768px) {
  .character-icon {
    width: 2rem;
    height: 2rem;
  }
}
```

## 🎯 사용 가이드라인

### 상황별 캐릭터 선택

**감자 캐릭터 사용 권장 상황:**
- 안정적인 상태 표시 (저축, 예산 관리)
- 신뢰성이 중요한 메시지
- 차분한 분위기의 성공/완료 상태

**토끼 캐릭터 사용 권장 상황:**
- 동적인 액션 (거래 입력, 분석)
- 사용자 참여가 필요한 상황
- 빠른 반응이나 알림이 필요한 경우

### 표정 선택 가이드

| 시나리오 | 추천 캐릭터 | 표정 | 이유 |
|----------|-------------|------|------|
| 거래 저장 완료 | 감자 | success | 안정적인 저장 완료 |
| 새 기능 안내 | 토끼 | info | 호기심과 관심 유도 |
| 예산 초과 경고 | 감자 | warning | 신중한 관리 필요성 |
| 네트워크 오류 | 토끼 | error | 빠른 문제 인식 |
| 데이터 로딩 중 | 감자 | loading | 안정적인 처리 중 |

### 접근성 고려사항

```tsx
// 적절한 aria-label 제공
<PotatoIcon 
  emotion="success" 
  aria-label="거래가 성공적으로 저장되었습니다" 
/>

// 색상에 의존하지 않는 의미 전달
<div className="alert warning">
  <RabbitIcon emotion="warning" />
  <span>예산 초과 주의!</span>
</div>
```

## 🔧 기술 사양

- **크기**: 24x24px (기본), 확대 가능한 벡터
- **형식**: SVG, React TSX 컴포넌트
- **색상 공간**: sRGB
- **브라우저 지원**: 모든 모던 브라우저
- **접근성**: WCAG 2.1 AA 준수

## 🎨 확장 가이드

### 새로운 표정 추가

1. 기존 SVG 파일을 복사하여 새 파일 생성
2. 눈, 입, 귀(토끼) 부분만 수정
3. React 컴포넌트에 새 표정 추가
4. TypeScript 타입에 새 표정 추가

```tsx
// 타입 확장
export type EmotionType = 'neutral' | 'success' | 'warning' | 'info' | 'error' | 'loading' | 'excited';

// 컴포넌트에 새 표정 추가
const expressions = {
  // ... 기존 표정들
  excited: (
    // 새로운 SVG 요소들
  )
};
```

### 새로운 빈 상태 추가

1. 120x120 viewBox로 새 SVG 생성
2. 감자+토끼가 함께 있는 장면 디자인
3. EmptyStateType에 새 타입 추가
4. 컴포넌트에 새 상태 구현

## 📝 라이선스

이 아이콘 시스템은 감자토끼 가계부 프로젝트를 위해 제작되었습니다.

## 🤝 기여 방법

1. 새로운 표정이나 상태가 필요한 경우 이슈 생성
2. 디자인 일관성 유지
3. 접근성 가이드라인 준수
4. 적절한 테스트와 문서화

---

**Happy Budgeting with Potato & Rabbit! 🥔🐰**