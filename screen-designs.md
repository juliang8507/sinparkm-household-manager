# 📱 부부 가계부 앱 화면 설계

감자🥔 & 토끼🐰 테마 기반 모바일 우선 화면 구성 상세 설계

## 🏠 1. 홈 대시보드

### 구조 및 레이아웃
```html
<div class="home-dashboard">
  <!-- 헤더 영역 -->
  <header class="home-dashboard__header">
    <div class="couple-greeting">
      <div class="couple-greeting__avatars">
        <div class="avatar avatar--potato">
          <span class="character--potato">🥔</span>
          <span class="avatar__name">철수</span>
        </div>
        <div class="couple-greeting__heart">💕</div>
        <div class="avatar avatar--rabbit">
          <span class="character--rabbit">🐰</span>
          <span class="avatar__name">영희</span>
        </div>
      </div>
      <div class="couple-greeting__message">
        <h2 class="text-heading-2">우리 가계부</h2>
        <p class="text-caption text-medium">오늘도 알뜰살뜰! 💪</p>
      </div>
    </div>
  </header>

  <!-- 메인 콘텐츠 -->
  <main class="home-dashboard__content">
    <!-- 월 요약 카드 -->
    <section class="summary-card card card--gradient">
      <div class="summary-card__header">
        <h3 class="text-heading-2">이번 달 요약</h3>
        <button class="btn btn--outline btn--sm">상세보기</button>
      </div>
      
      <div class="summary-card__metrics">
        <div class="metric">
          <div class="metric__value metric__value--income">
            +6,300,000원
          </div>
          <div class="metric__label">수입</div>
        </div>
        
        <div class="metric__divider"></div>
        
        <div class="metric">
          <div class="metric__value metric__value--expense">
            -1,250,000원
          </div>
          <div class="metric__label">지출</div>
        </div>
        
        <div class="metric__divider"></div>
        
        <div class="metric">
          <div class="metric__value metric__value--balance">
            5,050,000원
          </div>
          <div class="metric__label">잔액</div>
        </div>
      </div>
    </section>

    <!-- 오늘 식단 카드 -->
    <section class="today-meal-card card">
      <div class="today-meal-card__header">
        <h3 class="text-heading-2">🍽️ 오늘의 식단</h3>
        <span class="today-meal-card__date">1월 15일 (월)</span>
      </div>
      
      <div class="meal-timeline">
        <div class="meal-timeline__item">
          <div class="meal-timeline__time">아침</div>
          <div class="meal-timeline__menu">토스트와 우유</div>
        </div>
        <div class="meal-timeline__item">
          <div class="meal-timeline__time">점심</div>
          <div class="meal-timeline__menu">김치찌개</div>
        </div>
        <div class="meal-timeline__item">
          <div class="meal-timeline__time">저녁</div>
          <div class="meal-timeline__menu">치킨볶음밥</div>
        </div>
      </div>
      
      <button class="btn btn--potato btn--sm today-meal-card__action">
        식단 수정하기
      </button>
    </section>

    <!-- 이번 주 지출 카드 -->
    <section class="week-expense-card card">
      <div class="week-expense-card__header">
        <h3 class="text-heading-2">💰 이번 주 지출</h3>
        <div class="week-expense-card__period">1/15 - 1/21</div>
      </div>
      
      <div class="expense-chart">
        <div class="expense-chart__visualization">
          <!-- 도넛 차트 또는 바 차트 영역 -->
          <canvas class="expense-chart__canvas" width="120" height="120"></canvas>
          <div class="expense-chart__center">
            <div class="expense-chart__total">450,000원</div>
            <div class="expense-chart__label">이번 주 지출</div>
          </div>
        </div>
        
        <div class="expense-chart__legend">
          <div class="legend-item">
            <div class="legend-item__color" style="background: #FF6B6B"></div>
            <span class="legend-item__label">식비 45%</span>
          </div>
          <div class="legend-item">
            <div class="legend-item__color" style="background: #4ECDC4"></div>
            <span class="legend-item__label">교통비 20%</span>
          </div>
          <div class="legend-item">
            <div class="legend-item__color" style="background: #45B7D1"></div>
            <span class="legend-item__label">생활용품 15%</span>
          </div>
          <div class="legend-item">
            <div class="legend-item__color" style="background: #CCCCCC"></div>
            <span class="legend-item__label">기타 20%</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 최근 거래 카드 -->
    <section class="recent-transactions-card card">
      <div class="recent-transactions-card__header">
        <h3 class="text-heading-2">📋 최근 거래</h3>
        <button class="btn btn--outline btn--sm">전체보기</button>
      </div>
      
      <div class="transaction-list transaction-list--compact">
        <div class="transaction-item">
          <div class="transaction-item__icon">🍽️</div>
          <div class="transaction-item__details">
            <div class="transaction-item__description">마트에서 장보기</div>
            <div class="transaction-item__meta">
              <span class="transaction-item__user user-badge user-badge--potato">철수</span>
              <span class="transaction-item__time">2시간 전</span>
            </div>
          </div>
          <div class="transaction-item__amount transaction-item__amount--expense">
            -50,000원
          </div>
        </div>
        
        <div class="transaction-item">
          <div class="transaction-item__icon">🛍️</div>
          <div class="transaction-item__details">
            <div class="transaction-item__description">옷 쇼핑</div>
            <div class="transaction-item__meta">
              <span class="transaction-item__user user-badge user-badge--rabbit">영희</span>
              <span class="transaction-item__time">어제</span>
            </div>
          </div>
          <div class="transaction-item__amount transaction-item__amount--expense">
            -120,000원
          </div>
        </div>
        
        <div class="transaction-item">
          <div class="transaction-item__icon">💰</div>
          <div class="transaction-item__details">
            <div class="transaction-item__description">월급</div>
            <div class="transaction-item__meta">
              <span class="transaction-item__user user-badge user-badge--potato">철수</span>
              <span class="transaction-item__time">3일 전</span>
            </div>
          </div>
          <div class="transaction-item__amount transaction-item__amount--income">
            +3,500,000원
          </div>
        </div>
      </div>
    </section>

    <!-- 장보기 알림 카드 -->
    <section class="grocery-reminder-card card card--minimal">
      <div class="grocery-reminder-card__content">
        <div class="grocery-reminder-card__icon">
          <span class="character--rabbit">🐰</span>
        </div>
        <div class="grocery-reminder-card__message">
          <h4 class="text-body-lg">장보기 목록이 있어요!</h4>
          <p class="text-caption text-medium">우유, 양파 외 2개 항목</p>
        </div>
      </div>
      <button class="btn btn--rabbit btn--sm">목록 확인</button>
    </section>
  </main>

  <!-- 플로팅 액션 버튼 -->
  <button class="btn btn--floating btn--primary home-dashboard__fab">
    <svg class="icon-plus" width="24" height="24">
      <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
    </svg>
  </button>
</div>
```

### CSS 스타일 구조
```css
/* 홈 대시보드 컨테이너 */
.home-dashboard {
  min-height: 100vh;
  background: var(--background-cream);
  padding-bottom: calc(var(--space-20) + env(safe-area-inset-bottom));
}

.home-dashboard__header {
  padding: var(--space-6) var(--space-4);
  background: var(--gradient-morning);
  border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
  margin-bottom: var(--space-6);
}

.home-dashboard__content {
  padding: 0 var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* 커플 인사말 영역 */
.couple-greeting {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.couple-greeting__avatars {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.avatar__name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-dark);
}

/* 요약 카드 */
.summary-card__metrics {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-6);
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.metric__value {
  font-size: var(--text-xl);
  font-weight: 700;
  line-height: 1.2;
}

.metric__value--income { color: var(--income-green); }
.metric__value--expense { color: var(--expense-coral); }
.metric__value--balance { color: var(--text-dark); }

/* 식단 타임라인 */
.meal-timeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin: var(--space-4) 0;
}

.meal-timeline__item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3);
  background: var(--background-cream);
  border-radius: var(--radius-md);
}

.meal-timeline__time {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-medium);
  min-width: 40px;
}

.meal-timeline__menu {
  font-size: var(--text-base);
  color: var(--text-dark);
}

/* 지출 차트 */
.expense-chart {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  margin-top: var(--space-4);
}

.expense-chart__visualization {
  position: relative;
  flex-shrink: 0;
}

.expense-chart__center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.expense-chart__legend {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
}

.legend-item__color {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-sm);
}

/* 플로팅 액션 버튼 */
.home-dashboard__fab {
  bottom: calc(var(--space-20) + env(safe-area-inset-bottom));
  right: var(--space-6);
}
```

## 💰 2. 카테고리별 거래 입력 화면

### 구조 및 레이아웃
```html
<div class="transaction-input">
  <!-- 상단 바 -->
  <header class="transaction-input__header">
    <button class="btn btn--icon" aria-label="뒤로가기">
      <svg class="icon-arrow-left" width="24" height="24">
        <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor"/>
      </svg>
    </button>
    <h1 class="text-heading-1">거래 입력</h1>
    <div class="transaction-input__header-spacer"></div>
  </header>

  <main class="transaction-input__content">
    <!-- 사용자 선택 -->
    <section class="user-selector card">
      <h3 class="text-heading-2">누구의 거래인가요?</h3>
      <div class="user-selector__options">
        <label class="user-option">
          <input type="radio" name="user" value="husband" class="user-option__input">
          <div class="user-option__content user-option__content--potato">
            <div class="character--potato">🥔</div>
            <span class="user-option__name">철수</span>
          </div>
        </label>
        
        <label class="user-option">
          <input type="radio" name="user" value="wife" class="user-option__input">
          <div class="user-option__content user-option__content--rabbit">
            <div class="character--rabbit">🐰</div>
            <span class="user-option__name">영희</span>
          </div>
        </label>
      </div>
    </section>

    <!-- 거래 타입 선택 -->
    <section class="transaction-type-selector card">
      <h3 class="text-heading-2">거래 유형</h3>
      <div class="transaction-type-selector__options">
        <label class="transaction-type-option">
          <input type="radio" name="type" value="expense" class="transaction-type-option__input">
          <div class="transaction-type-option__content transaction-type-option__content--expense">
            <div class="transaction-type-option__icon">💸</div>
            <span class="transaction-type-option__label">지출</span>
          </div>
        </label>
        
        <label class="transaction-type-option">
          <input type="radio" name="type" value="income" class="transaction-type-option__input">
          <div class="transaction-type-option__content transaction-type-option__content--income">
            <div class="transaction-type-option__icon">💰</div>
            <span class="transaction-type-option__label">수입</span>
          </div>
        </label>
      </div>
    </section>

    <!-- 카테고리 선택 (지출일 때만 표시) -->
    <section class="category-selector card" data-show-when="expense">
      <h3 class="text-heading-2">카테고리 선택</h3>
      <div class="category-grid">
        <button class="category-item" data-category="food">
          <div class="category-item__icon" style="background-color: #FF6B6B">🍽️</div>
          <span class="category-item__name">식비</span>
        </button>
        
        <button class="category-item" data-category="transport">
          <div class="category-item__icon" style="background-color: #4ECDC4">🚗</div>
          <span class="category-item__name">교통비</span>
        </button>
        
        <button class="category-item" data-category="household">
          <div class="category-item__icon" style="background-color: #45B7D1">🏠</div>
          <span class="category-item__name">생활용품</span>
        </button>
        
        <button class="category-item" data-category="medical">
          <div class="category-item__icon" style="background-color: #96CEB4">💊</div>
          <span class="category-item__name">의료비</span>
        </button>
        
        <button class="category-item" data-category="entertainment">
          <div class="category-item__icon" style="background-color: #FFEAA7">🎮</div>
          <span class="category-item__name">여가/오락</span>
        </button>
        
        <button class="category-item" data-category="shopping">
          <div class="category-item__icon" style="background-color: #DDA0DD">🛍️</div>
          <span class="category-item__name">쇼핑</span>
        </button>
        
        <button class="category-item" data-category="beauty">
          <div class="category-item__icon" style="background-color: #FFB6C1">💄</div>
          <span class="category-item__name">미용</span>
        </button>
        
        <button class="category-item" data-category="education">
          <div class="category-item__icon" style="background-color: #98D8C8">📚</div>
          <span class="category-item__name">교육</span>
        </button>
        
        <button class="category-item category-item--add">
          <div class="category-item__icon category-item__icon--add">
            <svg class="icon-plus" width="24" height="24">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <span class="category-item__name">카테고리 추가</span>
        </button>
      </div>
    </section>

    <!-- 금액 입력 -->
    <section class="amount-input-section card">
      <h3 class="text-heading-2">금액</h3>
      <div class="amount-input-container">
        <div class="currency-symbol">₩</div>
        <input type="text" 
               class="amount-input" 
               placeholder="0" 
               inputmode="numeric"
               pattern="[0-9,]*">
      </div>
      
      <div class="quick-amounts">
        <button class="quick-amount-btn" data-amount="10000">1만원</button>
        <button class="quick-amount-btn" data-amount="50000">5만원</button>
        <button class="quick-amount-btn" data-amount="100000">10만원</button>
        <button class="quick-amount-btn" data-amount="500000">50만원</button>
      </div>
    </section>

    <!-- 메모 입력 -->
    <section class="memo-input-section card">
      <h3 class="text-heading-2">메모</h3>
      <div class="input-group">
        <input type="text" 
               class="input memo-input" 
               placeholder="어디서 뭘 샀는지 메모해보세요"
               maxlength="100">
        <div class="memo-input__counter">
          <span class="memo-input__current">0</span>/<span class="memo-input__max">100</span>
        </div>
      </div>
    </section>
  </main>

  <!-- 하단 액션 버튼 -->
  <footer class="transaction-input__footer">
    <button class="btn btn--primary btn--large transaction-input__submit">
      거래 저장하기
    </button>
  </footer>
</div>
```

### CSS 스타일 구조
```css
/* 거래 입력 컨테이너 */
.transaction-input {
  min-height: 100vh;
  background: var(--background-cream);
  display: flex;
  flex-direction: column;
}

.transaction-input__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--surface-white);
  border-bottom: 1px solid var(--border-light);
}

.transaction-input__content {
  flex: 1;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* 사용자 선택 */
.user-selector__options {
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-4);
}

.user-option {
  flex: 1;
  cursor: pointer;
}

.user-option__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.user-option__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.user-option__input:checked + .user-option__content--potato {
  border-color: var(--potato-primary);
  background: var(--potato-50);
}

.user-option__input:checked + .user-option__content--rabbit {
  border-color: var(--rabbit-primary);
  background: var(--rabbit-50);
}

/* 거래 타입 선택 */
.transaction-type-selector__options {
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-4);
}

.transaction-type-option {
  flex: 1;
  cursor: pointer;
}

.transaction-type-option__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.transaction-type-option__input:checked + .transaction-type-option__content--expense {
  border-color: var(--expense-coral);
  background: rgba(255, 179, 179, 0.1);
}

.transaction-type-option__input:checked + .transaction-type-option__content--income {
  border-color: var(--income-green);
  background: rgba(168, 230, 163, 0.1);
}

/* 카테고리 그리드 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-2);
  background: var(--surface-white);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
}

.category-item:hover,
.category-item--selected {
  border-color: var(--potato-primary);
  box-shadow: var(--shadow-md);
}

.category-item__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  font-size: 1.5rem;
}

.category-item__icon--add {
  background: var(--border-light);
  color: var(--text-medium);
}

/* 금액 입력 */
.amount-input-container {
  position: relative;
  margin-top: var(--space-4);
}

.currency-symbol {
  position: absolute;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-medium);
}

.amount-input {
  width: 100%;
  padding: var(--space-4) var(--space-4) var(--space-4) calc(var(--space-4) + 1.5rem);
  font-size: var(--text-2xl);
  font-weight: 600;
  text-align: right;
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  background: var(--surface-white);
}

.quick-amounts {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.quick-amount-btn {
  flex: 1;
  padding: var(--space-2) var(--space-3);
  background: var(--background-cream);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-base);
}

.quick-amount-btn:hover {
  background: var(--potato-100);
  border-color: var(--potato-primary);
}

/* 하단 액션 */
.transaction-input__footer {
  padding: var(--space-4);
  background: var(--surface-white);
  border-top: 1px solid var(--border-light);
}

.btn--large {
  width: 100%;
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-lg);
}
```

## 📊 3. 거래 내역 리스트

### 구조 및 레이아웃
```html
<div class="transaction-history">
  <!-- 상단 바 -->
  <header class="transaction-history__header">
    <button class="btn btn--icon" aria-label="뒤로가기">
      <svg class="icon-arrow-left" width="24" height="24">
        <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor"/>
      </svg>
    </button>
    <h1 class="text-heading-1">거래 내역</h1>
    <button class="btn btn--icon" aria-label="필터">
      <svg class="icon-filter" width="24" height="24">
        <path d="M4 6h16M6 12h12M8 18h8" stroke="currentColor"/>
      </svg>
    </button>
  </header>

  <!-- 필터 섹션 -->
  <section class="filter-section card">
    <div class="filter-tabs">
      <button class="filter-tab filter-tab--active">전체</button>
      <button class="filter-tab">수입</button>
      <button class="filter-tab">지출</button>
    </div>
    
    <div class="filter-controls">
      <div class="date-filter">
        <button class="date-filter-btn">
          <span class="date-filter-btn__icon">📅</span>
          <span class="date-filter-btn__text">이번 달</span>
          <svg class="icon-chevron-down" width="16" height="16">
            <path d="M4 6l4 4 4-4" stroke="currentColor"/>
          </svg>
        </button>
      </div>
      
      <div class="user-filter">
        <button class="user-filter-btn">
          <span class="user-filter-btn__avatar">
            <span class="character--potato">🥔</span>
            <span class="character--rabbit">🐰</span>
          </span>
          <span class="user-filter-btn__text">모든 사용자</span>
          <svg class="icon-chevron-down" width="16" height="16">
            <path d="M4 6l4 4 4-4" stroke="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  </section>

  <!-- 월간 요약 -->
  <section class="monthly-summary card card--minimal">
    <div class="monthly-summary__content">
      <div class="monthly-summary__title">
        <h3 class="text-heading-2">1월 요약</h3>
        <div class="monthly-summary__character">
          <span class="character--potato">🥔</span>
          <span class="character--rabbit">🐰</span>
        </div>
      </div>
      
      <div class="monthly-summary__stats">
        <div class="stat">
          <div class="stat__value stat__value--income">+6,300,000</div>
          <div class="stat__label">수입</div>
        </div>
        <div class="stat">
          <div class="stat__value stat__value--expense">-1,250,000</div>
          <div class="stat__label">지출</div>
        </div>
        <div class="stat">
          <div class="stat__value stat__value--balance">5,050,000</div>
          <div class="stat__label">잔액</div>
        </div>
      </div>
    </div>
  </section>

  <!-- 거래 목록 -->
  <main class="transaction-history__content">
    <!-- 날짜별 그룹 -->
    <div class="transaction-group">
      <div class="transaction-group__header">
        <div class="transaction-group__date">
          <span class="transaction-group__day">오늘</span>
          <span class="transaction-group__full-date">1월 15일 (월)</span>
        </div>
        <div class="transaction-group__summary">
          <span class="transaction-group__expense">-75,000원</span>
        </div>
      </div>
      
      <div class="transaction-list">
        <div class="transaction-item swipeable">
          <div class="transaction-item__main">
            <div class="transaction-item__icon">🍽️</div>
            <div class="transaction-item__details">
              <div class="transaction-item__description">마트에서 장보기</div>
              <div class="transaction-item__meta">
                <span class="transaction-item__category">식비</span>
                <span class="transaction-item__user user-badge user-badge--potato">철수</span>
                <span class="transaction-item__time">14:30</span>
              </div>
            </div>
            <div class="transaction-item__amount transaction-item__amount--expense">
              -50,000원
            </div>
          </div>
          
          <!-- 스와이프 액션 (숨겨짐) -->
          <div class="swipeable__actions">
            <button class="swipe-action swipe-action--edit">
              <svg class="icon-edit" width="20" height="20">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor"/>
                <path d="m18.5 2.5-7 7" stroke="currentColor"/>
              </svg>
            </button>
            <button class="swipe-action swipe-action--delete">
              <svg class="icon-trash" width="20" height="20">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="transaction-item swipeable">
          <div class="transaction-item__main">
            <div class="transaction-item__icon">🚗</div>
            <div class="transaction-item__details">
              <div class="transaction-item__description">지하철 교통카드 충전</div>
              <div class="transaction-item__meta">
                <span class="transaction-item__category">교통비</span>
                <span class="transaction-item__user user-badge user-badge--potato">철수</span>
                <span class="transaction-item__time">09:15</span>
              </div>
            </div>
            <div class="transaction-item__amount transaction-item__amount--expense">
              -25,000원
            </div>
          </div>
          
          <div class="swipeable__actions">
            <button class="swipe-action swipe-action--edit">
              <svg class="icon-edit" width="20" height="20">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor"/>
                <path d="m18.5 2.5-7 7" stroke="currentColor"/>
              </svg>
            </button>
            <button class="swipe-action swipe-action--delete">
              <svg class="icon-trash" width="20" height="20">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 또 다른 날짜 그룹 -->
    <div class="transaction-group">
      <div class="transaction-group__header">
        <div class="transaction-group__date">
          <span class="transaction-group__day">어제</span>
          <span class="transaction-group__full-date">1월 14일 (일)</span>
        </div>
        <div class="transaction-group__summary">
          <span class="transaction-group__income">+2,800,000원</span>
          <span class="transaction-group__expense">-157,000원</span>
        </div>
      </div>
      
      <div class="transaction-list">
        <div class="transaction-item swipeable">
          <div class="transaction-item__main">
            <div class="transaction-item__icon">💰</div>
            <div class="transaction-item__details">
              <div class="transaction-item__description">월급</div>
              <div class="transaction-item__meta">
                <span class="transaction-item__category">급여</span>
                <span class="transaction-item__user user-badge user-badge--rabbit">영희</span>
                <span class="transaction-item__time">09:00</span>
              </div>
            </div>
            <div class="transaction-item__amount transaction-item__amount--income">
              +2,800,000원
            </div>
          </div>
        </div>
        
        <div class="transaction-item swipeable">
          <div class="transaction-item__main">
            <div class="transaction-item__icon">🛍️</div>
            <div class="transaction-item__details">
              <div class="transaction-item__description">옷 쇼핑</div>
              <div class="transaction-item__meta">
                <span class="transaction-item__category">쇼핑</span>
                <span class="transaction-item__user user-badge user-badge--rabbit">영희</span>
                <span class="transaction-item__time">15:20</span>
              </div>
            </div>
            <div class="transaction-item__amount transaction-item__amount--expense">
              -120,000원
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- 무한 스크롤 로딩 -->
  <div class="transaction-history__loading">
    <div class="loading-spinner">
      <div class="spinner"></div>
      <span class="loading-text">더 많은 거래 내역을 불러오고 있어요...</span>
    </div>
  </div>
</div>
```

### CSS 스타일 구조
```css
/* 거래 내역 컨테이너 */
.transaction-history {
  min-height: 100vh;
  background: var(--background-cream);
  padding-bottom: calc(var(--space-20) + env(safe-area-inset-bottom));
}

.transaction-history__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--surface-white);
  border-bottom: 1px solid var(--border-light);
  position: sticky;
  top: 0;
  z-index: 10;
}

.transaction-history__content {
  padding: 0 var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* 필터 섹션 */
.filter-section {
  margin: var(--space-4);
  margin-bottom: 0;
}

.filter-tabs {
  display: flex;
  gap: var(--space-1);
  margin-bottom: var(--space-4);
}

.filter-tab {
  flex: 1;
  padding: var(--space-3) var(--space-4);
  background: transparent;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
}

.filter-tab--active {
  background: var(--potato-primary);
  border-color: var(--potato-primary);
  color: var(--text-dark);
}

.filter-controls {
  display: flex;
  gap: var(--space-3);
}

.date-filter,
.user-filter {
  flex: 1;
}

.date-filter-btn,
.user-filter-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  background: var(--background-cream);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-base);
}

/* 월간 요약 */
.monthly-summary__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.monthly-summary__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.monthly-summary__stats {
  display: flex;
  justify-content: space-around;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.stat__value {
  font-size: var(--text-lg);
  font-weight: 700;
}

/* 거래 그룹 */
.transaction-group {
  background: var(--surface-white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.transaction-group__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--background-cream);
  border-bottom: 1px solid var(--border-light);
}

.transaction-group__date {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.transaction-group__day {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-dark);
}

.transaction-group__full-date {
  font-size: var(--text-sm);
  color: var(--text-medium);
}

.transaction-group__summary {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-1);
  font-size: var(--text-sm);
  font-weight: 600;
}

.transaction-group__income {
  color: var(--income-green);
}

.transaction-group__expense {
  color: var(--expense-coral);
}

/* 거래 항목 */
.transaction-item {
  position: relative;
  background: var(--surface-white);
  border-bottom: 1px solid var(--border-light);
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-item__main {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  transition: transform var(--transition-base);
}

.transaction-item__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-cream);
  border-radius: var(--radius-full);
  font-size: 1.5rem;
  flex-shrink: 0;
}

.transaction-item__details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.transaction-item__description {
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--text-dark);
}

.transaction-item__meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
}

.transaction-item__category {
  color: var(--text-medium);
}

.transaction-item__time {
  color: var(--text-light);
}

.transaction-item__amount {
  font-size: var(--text-lg);
  font-weight: 700;
  flex-shrink: 0;
}

.transaction-item__amount--income {
  color: var(--income-green);
}

.transaction-item__amount--expense {
  color: var(--expense-coral);
}

/* 사용자 뱃지 */
.user-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 500;
}

.user-badge--potato {
  background: var(--potato-100);
  color: var(--potato-700);
}

.user-badge--rabbit {
  background: var(--rabbit-100);
  color: var(--rabbit-700);
}

/* 스와이프 액션 */
.swipeable__actions {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-4);
  opacity: 0;
  transform: translateX(100%);
  transition: all var(--transition-base);
}

.swipeable--swiping .swipeable__actions {
  opacity: 1;
  transform: translateX(0);
}

.swipe-action {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
}

.swipe-action--edit {
  background: var(--potato-primary);
  color: var(--text-dark);
}

.swipe-action--delete {
  background: var(--expense-coral);
  color: white;
}
```

## 🍽️ 4. 식단 계획/레시피 화면 (탭 전환)

### 구조 및 레이아웃
```html
<div class="meal-recipe-screen">
  <!-- 상단 바 -->
  <header class="meal-recipe-screen__header">
    <button class="btn btn--icon" aria-label="뒤로가기">
      <svg class="icon-arrow-left" width="24" height="24">
        <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor"/>
      </svg>
    </button>
    <h1 class="text-heading-1">식단 & 레시피</h1>
    <button class="btn btn--icon" aria-label="더보기">
      <svg class="icon-more" width="24" height="24">
        <circle cx="12" cy="12" r="1"/>
        <circle cx="19" cy="12" r="1"/>
        <circle cx="5" cy="12" r="1"/>
      </svg>
    </button>
  </header>

  <!-- 탭 네비게이션 -->
  <nav class="tab-navigation">
    <button class="tab-navigation__tab tab-navigation__tab--active" data-tab="meal-plan">
      <span class="tab-navigation__icon">📅</span>
      <span class="tab-navigation__label">식단계획</span>
    </button>
    <button class="tab-navigation__tab" data-tab="recipes">
      <span class="tab-navigation__icon">📖</span>
      <span class="tab-navigation__label">레시피</span>
    </button>
  </nav>

  <!-- 식단 계획 탭 콘텐츠 -->
  <main class="tab-content tab-content--active" data-content="meal-plan">
    <!-- 주간 식단 네비게이션 -->
    <section class="week-navigation card">
      <div class="week-navigation__header">
        <button class="week-navigation__arrow" aria-label="이전 주">
          <svg class="icon-chevron-left" width="20" height="20">
            <path d="M15 18l-6-6 6-6" stroke="currentColor"/>
          </svg>
        </button>
        <h3 class="week-navigation__title">
          <span class="week-navigation__month">1월</span>
          <span class="week-navigation__week">3주차</span>
        </h3>
        <button class="week-navigation__arrow" aria-label="다음 주">
          <svg class="icon-chevron-right" width="20" height="20">
            <path d="M9 18l6-6-6-6" stroke="currentColor"/>
          </svg>
        </button>
      </div>
      
      <div class="week-navigation__characters">
        <div class="character--potato">🥔</div>
        <div class="week-navigation__heart">💕</div>
        <div class="character--rabbit">🐰</div>
      </div>
    </section>

    <!-- 식단 달력 -->
    <section class="meal-calendar">
      <div class="meal-day-card card">
        <div class="meal-day-card__header">
          <div class="meal-day-card__date">
            <span class="meal-day-card__day">월</span>
            <span class="meal-day-card__number">15</span>
          </div>
          <div class="meal-day-card__status meal-day-card__status--planned">
            <span class="status-dot"></span>
            <span class="status-text">계획완료</span>
          </div>
        </div>
        
        <div class="meal-day-card__meals">
          <div class="meal-item">
            <div class="meal-item__icon">🌅</div>
            <div class="meal-item__details">
              <div class="meal-item__time">아침</div>
              <div class="meal-item__menu">토스트와 우유</div>
            </div>
            <button class="meal-item__action" aria-label="아침 메뉴 수정">
              <svg class="icon-edit" width="16" height="16">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor"/>
              </svg>
            </button>
          </div>
          
          <div class="meal-item">
            <div class="meal-item__icon">☀️</div>
            <div class="meal-item__details">
              <div class="meal-item__time">점심</div>
              <div class="meal-item__menu">김치찌개</div>
              <button class="meal-item__recipe-link">레시피 보기</button>
            </div>
            <button class="meal-item__action" aria-label="점심 메뉴 수정">
              <svg class="icon-edit" width="16" height="16">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor"/>
              </svg>
            </button>
          </div>
          
          <div class="meal-item">
            <div class="meal-item__icon">🌙</div>
            <div class="meal-item__details">
              <div class="meal-item__time">저녁</div>
              <div class="meal-item__menu">치킨볶음밥</div>
              <button class="meal-item__recipe-link">레시피 보기</button>
            </div>
            <button class="meal-item__action" aria-label="저녁 메뉴 수정">
              <svg class="icon-edit" width="16" height="16">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div class="meal-day-card card">
        <div class="meal-day-card__header">
          <div class="meal-day-card__date">
            <span class="meal-day-card__day">화</span>
            <span class="meal-day-card__number">16</span>
          </div>
          <div class="meal-day-card__status meal-day-card__status--partial">
            <span class="status-dot"></span>
            <span class="status-text">일부계획</span>
          </div>
        </div>
        
        <div class="meal-day-card__meals">
          <div class="meal-item">
            <div class="meal-item__icon">🌅</div>
            <div class="meal-item__details">
              <div class="meal-item__time">아침</div>
              <div class="meal-item__menu">시리얼</div>
            </div>
            <button class="meal-item__action" aria-label="아침 메뉴 수정">
              <svg class="icon-edit" width="16" height="16">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor"/>
              </svg>
            </button>
          </div>
          
          <div class="meal-item meal-item--empty">
            <div class="meal-item__icon">☀️</div>
            <div class="meal-item__details">
              <div class="meal-item__time">점심</div>
              <div class="meal-item__empty-state">
                <span class="character--potato">🥔</span>
                <span class="meal-item__empty-text">점심 메뉴를 정해주세요!</span>
              </div>
            </div>
            <button class="meal-item__action meal-item__action--add" aria-label="점심 메뉴 추가">
              <svg class="icon-plus" width="16" height="16">
                <path d="M12 5v14M5 12h14" stroke="currentColor"/>
              </svg>
            </button>
          </div>
          
          <div class="meal-item">
            <div class="meal-item__icon">🌙</div>
            <div class="meal-item__details">
              <div class="meal-item__time">저녁</div>
              <div class="meal-item__menu">파스타</div>
              <button class="meal-item__recipe-link">레시피 보기</button>
            </div>
            <button class="meal-item__action" aria-label="저녁 메뉴 수정">
              <svg class="icon-edit" width="16" height="16">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- 레시피 탭 콘텐츠 -->
  <main class="tab-content" data-content="recipes">
    <!-- 레시피 검색 -->
    <section class="recipe-search card">
      <div class="input-group">
        <div class="input-group__icon">🔍</div>
        <input type="text" 
               class="input input--with-icon" 
               placeholder="레시피를 검색해보세요">
      </div>
      
      <div class="recipe-search__filters">
        <button class="filter-chip filter-chip--active">전체</button>
        <button class="filter-chip">한식</button>
        <button class="filter-chip">양식</button>
        <button class="filter-chip">중식</button>
        <button class="filter-chip">일식</button>
      </div>
    </section>

    <!-- 레시피 목록 -->
    <section class="recipe-list">
      <div class="recipe-card card">
        <div class="recipe-card__image">
          <div class="recipe-card__image-placeholder">
            <span class="recipe-card__emoji">🍲</span>
          </div>
          <div class="recipe-card__difficulty">
            <span class="difficulty-badge difficulty-badge--easy">쉬움</span>
          </div>
        </div>
        
        <div class="recipe-card__content">
          <div class="recipe-card__header">
            <h3 class="recipe-card__title">김치찌개</h3>
            <div class="recipe-card__rating">
              <div class="rating-stars">
                <span class="star star--filled">★</span>
                <span class="star star--filled">★</span>
                <span class="star star--filled">★</span>
                <span class="star star--filled">★</span>
                <span class="star star--half">★</span>
              </div>
              <span class="rating-count">(24)</span>
            </div>
          </div>
          
          <p class="recipe-card__description">
            맛있는 김치찌개 만들기. 돼지고기와 두부가 들어간 정통 한식 레시피입니다.
          </p>
          
          <div class="recipe-card__meta">
            <div class="recipe-meta-item">
              <span class="recipe-meta-item__icon">⏱️</span>
              <span class="recipe-meta-item__text">30분</span>
            </div>
            <div class="recipe-meta-item">
              <span class="recipe-meta-item__icon">👥</span>
              <span class="recipe-meta-item__text">2인분</span>
            </div>
            <div class="recipe-meta-item">
              <span class="recipe-meta-item__icon">🥕</span>
              <span class="recipe-meta-item__text">재료 4개</span>
            </div>
          </div>
          
          <div class="recipe-card__actions">
            <button class="btn btn--outline btn--sm recipe-card__favorite">
              <svg class="icon-heart" width="16" height="16">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor"/>
              </svg>
              즐겨찾기
            </button>
            <button class="btn btn--potato btn--sm">레시피 보기</button>
          </div>
        </div>
      </div>
      
      <div class="recipe-card card">
        <div class="recipe-card__image">
          <div class="recipe-card__image-placeholder">
            <span class="recipe-card__emoji">🍳</span>
          </div>
          <div class="recipe-card__difficulty">
            <span class="difficulty-badge difficulty-badge--medium">보통</span>
          </div>
        </div>
        
        <div class="recipe-card__content">
          <div class="recipe-card__header">
            <h3 class="recipe-card__title">치킨볶음밥</h3>
            <div class="recipe-card__rating">
              <div class="rating-stars">
                <span class="star star--filled">★</span>
                <span class="star star--filled">★</span>
                <span class="star star--filled">★</span>
                <span class="star star--filled">★</span>
                <span class="star">★</span>
              </div>
              <span class="rating-count">(18)</span>
            </div>
          </div>
          
          <p class="recipe-card__description">
            간단한 치킨볶음밥 레시피. 남은 밥으로 만들 수 있는 맛있는 한 그릇 요리예요.
          </p>
          
          <div class="recipe-card__meta">
            <div class="recipe-meta-item">
              <span class="recipe-meta-item__icon">⏱️</span>
              <span class="recipe-meta-item__text">20분</span>
            </div>
            <div class="recipe-meta-item">
              <span class="recipe-meta-item__icon">👥</span>
              <span class="recipe-meta-item__text">2인분</span>
            </div>
            <div class="recipe-meta-item">
              <span class="recipe-meta-item__icon">🥕</span>
              <span class="recipe-meta-item__text">재료 4개</span>
            </div>
          </div>
          
          <div class="recipe-card__actions">
            <button class="btn btn--outline btn--sm recipe-card__favorite recipe-card__favorite--active">
              <svg class="icon-heart" width="16" height="16">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>
              </svg>
              즐겨찾기
            </button>
            <button class="btn btn--rabbit btn--sm">레시피 보기</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 레시피 추가 버튼 -->
    <button class="btn btn--floating btn--primary recipe-fab">
      <svg class="icon-plus" width="24" height="24">
        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
      </svg>
    </button>
  </main>
</div>
```

### CSS 스타일 구조
```css
/* 식단 레시피 화면 컨테이너 */
.meal-recipe-screen {
  min-height: 100vh;
  background: var(--background-cream);
  padding-bottom: calc(var(--space-20) + env(safe-area-inset-bottom));
}

.meal-recipe-screen__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--surface-white);
  border-bottom: 1px solid var(--border-light);
}

/* 탭 네비게이션 */
.tab-navigation {
  display: flex;
  background: var(--surface-white);
  border-bottom: 1px solid var(--border-light);
  position: sticky;
  top: 0;
  z-index: 5;
}

.tab-navigation__tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-4);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
}

.tab-navigation__tab::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: transparent;
  transition: background var(--transition-base);
}

.tab-navigation__tab--active {
  color: var(--potato-600);
}

.tab-navigation__tab--active::after {
  background: var(--gradient-sunset);
}

.tab-navigation__icon {
  font-size: 1.25rem;
}

.tab-navigation__label {
  font-size: var(--text-sm);
  font-weight: 500;
}

/* 탭 콘텐츠 */
.tab-content {
  display: none;
  padding: var(--space-4);
  animation: fadeIn 0.3s ease-out;
}

.tab-content--active {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* 주간 네비게이션 */
.week-navigation__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.week-navigation__title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.week-navigation__month {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-dark);
}

.week-navigation__week {
  font-size: var(--text-sm);
  color: var(--text-medium);
}

.week-navigation__characters {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  justify-content: center;
}

.week-navigation__heart {
  font-size: 1.2rem;
  animation: pulse 2s infinite;
}

/* 식단 달력 */
.meal-calendar {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.meal-day-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--border-light);
}

.meal-day-card__date {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.meal-day-card__day {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-medium);
}

.meal-day-card__number {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-dark);
}

.meal-day-card__status {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
}

.meal-day-card__status--planned .status-dot {
  background: var(--income-green);
}

.meal-day-card__status--partial .status-dot {
  background: var(--warning-yellow);
}

/* 식사 아이템 */
.meal-day-card__meals {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.meal-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--background-cream);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.meal-item__icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-white);
  border-radius: var(--radius-full);
  font-size: 1.25rem;
  flex-shrink: 0;
}

.meal-item__details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.meal-item__time {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-medium);
}

.meal-item__menu {
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--text-dark);
}

.meal-item__recipe-link {
  font-size: var(--text-xs);
  color: var(--potato-600);
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-top: var(--space-1);
}

.meal-item__action {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-base);
  flex-shrink: 0;
}

.meal-item__action:hover {
  border-color: var(--potato-primary);
  background: var(--potato-50);
}

/* 빈 상태 식사 아이템 */
.meal-item--empty {
  border: 1px dashed var(--border-light);
  background: var(--surface-white);
}

.meal-item__empty-state {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.meal-item__empty-text {
  font-size: var(--text-sm);
  color: var(--text-medium);
  font-style: italic;
}

.meal-item__action--add {
  background: var(--potato-primary);
  border-color: var(--potato-primary);
  color: var(--text-dark);
}

/* 레시피 검색 */
.recipe-search__filters {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-4);
  overflow-x: auto;
  padding-bottom: var(--space-2);
}

.filter-chip {
  white-space: nowrap;
  padding: var(--space-2) var(--space-4);
  background: var(--surface-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-base);
}

.filter-chip--active {
  background: var(--rabbit-primary);
  border-color: var(--rabbit-primary);
  color: var(--text-dark);
}

/* 레시피 카드 */
.recipe-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.recipe-card {
  overflow: hidden;
  transition: all var(--transition-base);
}

.recipe-card:hover {
  box-shadow: var(--shadow-floating);
}

.recipe-card__image {
  position: relative;
  height: 160px;
  background: var(--background-cream);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  overflow: hidden;
}

.recipe-card__image-placeholder {
  width: 80px;
  height: 80px;
  background: var(--surface-white);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.recipe-card__difficulty {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
}

.difficulty-badge {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
}

.difficulty-badge--easy {
  background: var(--income-green);
  color: white;
}

.difficulty-badge--medium {
  background: var(--warning-yellow);
  color: var(--text-dark);
}

.recipe-card__content {
  padding: var(--space-4);
}

.recipe-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}

.recipe-card__title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-dark);
}

.recipe-card__rating {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
}

.rating-stars {
  display: flex;
  gap: 1px;
}

.star {
  color: var(--border-light);
}

.star--filled,
.star--half {
  color: var(--warning-yellow);
}

.recipe-card__description {
  font-size: var(--text-sm);
  color: var(--text-medium);
  line-height: 1.5;
  margin-bottom: var(--space-4);
}

.recipe-card__meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.recipe-meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  color: var(--text-medium);
}

.recipe-card__actions {
  display: flex;
  gap: var(--space-3);
}

.recipe-card__favorite--active {
  color: var(--expense-coral);
  border-color: var(--expense-coral);
}

/* 레시피 플로팅 버튼 */
.recipe-fab {
  position: fixed;
  bottom: calc(var(--space-20) + env(safe-area-inset-bottom));
  right: var(--space-6);
}
```

## 🛒 5. 장보기 목록 체크화면

### 구조 및 레이아웃
```html
<div class="grocery-screen">
  <!-- 상단 바 -->
  <header class="grocery-screen__header">
    <button class="btn btn--icon" aria-label="뒤로가기">
      <svg class="icon-arrow-left" width="24" height="24">
        <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor"/>
      </svg>
    </button>
    <h1 class="text-heading-1">장보기 목록</h1>
    <button class="btn btn--icon" aria-label="목록 정리">
      <svg class="icon-refresh" width="24" height="24">
        <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor"/>
        <path d="m21 9-3-3-3 3M3 15l3 3 3-3" stroke="currentColor"/>
      </svg>
    </button>
  </header>

  <!-- 장보기 진행상황 -->
  <section class="grocery-progress card card--gradient">
    <div class="grocery-progress__characters">
      <div class="character--potato">🥔</div>
      <div class="grocery-progress__heart">💕</div>
      <div class="character--rabbit">🐰</div>
    </div>
    
    <div class="grocery-progress__content">
      <h2 class="grocery-progress__title">오늘의 장보기</h2>
      <div class="grocery-progress__stats">
        <div class="progress-stat">
          <div class="progress-stat__value">3</div>
          <div class="progress-stat__label">완료</div>
        </div>
        <div class="progress-stat__divider">/</div>
        <div class="progress-stat">
          <div class="progress-stat__value">8</div>
          <div class="progress-stat__label">전체</div>
        </div>
      </div>
      
      <div class="grocery-progress__bar">
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width: 37.5%"></div>
        </div>
        <span class="progress-percentage">37.5% 완료!</span>
      </div>
    </div>
  </section>

  <!-- 빠른 추가 입력 -->
  <section class="quick-add card">
    <div class="quick-add__header">
      <h3 class="text-heading-2">빠른 추가</h3>
      <div class="quick-add__characters">
        <span class="character--rabbit character--rabbit-small">🐰</span>
      </div>
    </div>
    
    <form class="quick-add__form">
      <div class="quick-add__input-group">
        <div class="input-group">
          <input type="text" 
                 class="input quick-add__input" 
                 placeholder="장볼 것을 입력하세요 (예: 우유, 계란, 빵)"
                 maxlength="50">
          <button type="submit" class="btn btn--rabbit quick-add__submit">
            추가
          </button>
        </div>
      </div>
      
      <div class="quick-add__suggestions">
        <button type="button" class="suggestion-chip">🥛 우유</button>
        <button type="button" class="suggestion-chip">🍞 빵</button>
        <button type="button" class="suggestion-chip">🥚 계란</button>
        <button type="button" class="suggestion-chip">🧅 양파</button>
        <button type="button" class="suggestion-chip">🥕 당근</button>
      </div>
    </form>
  </section>

  <!-- 장보기 목록 -->
  <main class="grocery-list">
    <!-- 필요한 항목들 -->
    <section class="grocery-section">
      <div class="grocery-section__header">
        <h3 class="grocery-section__title">
          <span class="grocery-section__icon">📝</span>
          <span class="grocery-section__text">장보기 필요 (5개)</span>
        </h3>
        <button class="grocery-section__action" aria-label="모두 선택">
          <span class="text-caption">모두 선택</span>
        </button>
      </div>
      
      <div class="grocery-items">
        <div class="grocery-item swipeable">
          <div class="grocery-item__main">
            <label class="grocery-item__checkbox">
              <input type="checkbox" class="grocery-item__input">
              <div class="grocery-item__checkmark">
                <svg class="icon-check" width="16" height="16">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
            </label>
            
            <div class="grocery-item__content">
              <div class="grocery-item__name">우유</div>
              <div class="grocery-item__quantity">2개</div>
            </div>
            
            <div class="grocery-item__actions">
              <button class="quantity-btn quantity-btn--minus" aria-label="수량 감소">
                <svg class="icon-minus" width="16" height="16">
                  <path d="M5 12h14" stroke="currentColor"/>
                </svg>
              </button>
              <span class="quantity-display">2</span>
              <button class="quantity-btn quantity-btn--plus" aria-label="수량 증가">
                <svg class="icon-plus" width="16" height="16">
                  <path d="M12 5v14M5 12h14" stroke="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- 스와이프 액션 -->
          <div class="swipeable__actions">
            <button class="swipe-action swipe-action--edit">
              <svg class="icon-edit" width="20" height="20">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor"/>
              </svg>
            </button>
            <button class="swipe-action swipe-action--delete">
              <svg class="icon-trash" width="20" height="20">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="grocery-item swipeable">
          <div class="grocery-item__main">
            <label class="grocery-item__checkbox">
              <input type="checkbox" class="grocery-item__input">
              <div class="grocery-item__checkmark">
                <svg class="icon-check" width="16" height="16">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
            </label>
            
            <div class="grocery-item__content">
              <div class="grocery-item__name">양파</div>
              <div class="grocery-item__quantity">3개</div>
            </div>
            
            <div class="grocery-item__actions">
              <button class="quantity-btn quantity-btn--minus" aria-label="수량 감소">
                <svg class="icon-minus" width="16" height="16">
                  <path d="M5 12h14" stroke="currentColor"/>
                </svg>
              </button>
              <span class="quantity-display">3</span>
              <button class="quantity-btn quantity-btn--plus" aria-label="수량 증가">
                <svg class="icon-plus" width="16" height="16">
                  <path d="M12 5v14M5 12h14" stroke="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="swipeable__actions">
            <button class="swipe-action swipe-action--edit">
              <svg class="icon-edit" width="20" height="20">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor"/>
              </svg>
            </button>
            <button class="swipe-action swipe-action--delete">
              <svg class="icon-trash" width="20" height="20">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 완료된 항목들 -->
    <section class="grocery-section grocery-section--completed">
      <div class="grocery-section__header">
        <h3 class="grocery-section__title">
          <span class="grocery-section__icon">✅</span>
          <span class="grocery-section__text">완료 (3개)</span>
        </h3>
        <button class="grocery-section__action" aria-label="목록 접기">
          <svg class="icon-chevron-up" width="20" height="20">
            <path d="M18 15l-6-6-6 6" stroke="currentColor"/>
          </svg>
        </button>
      </div>
      
      <div class="grocery-items grocery-items--completed">
        <div class="grocery-item grocery-item--checked swipeable">
          <div class="grocery-item__main">
            <label class="grocery-item__checkbox">
              <input type="checkbox" class="grocery-item__input" checked>
              <div class="grocery-item__checkmark grocery-item__checkmark--checked">
                <svg class="icon-check" width="16" height="16">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
            </label>
            
            <div class="grocery-item__content">
              <div class="grocery-item__name">쌀</div>
              <div class="grocery-item__quantity">1개</div>
            </div>
            
            <div class="grocery-item__completed-time">
              <span class="time-badge">방금 전</span>
            </div>
          </div>
        </div>
        
        <div class="grocery-item grocery-item--checked swipeable">
          <div class="grocery-item__main">
            <label class="grocery-item__checkbox">
              <input type="checkbox" class="grocery-item__input" checked>
              <div class="grocery-item__checkmark grocery-item__checkmark--checked">
                <svg class="icon-check" width="16" height="16">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
            </label>
            
            <div class="grocery-item__content">
              <div class="grocery-item__name">계란</div>
              <div class="grocery-item__quantity">1개</div>
            </div>
            
            <div class="grocery-item__completed-time">
              <span class="time-badge">5분 전</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- 하단 액션 -->
  <footer class="grocery-screen__footer">
    <div class="grocery-footer-actions">
      <button class="btn btn--outline grocery-footer-actions__clear">
        완료 항목 정리
      </button>
      <button class="btn btn--primary grocery-footer-actions__shopping">
        <span class="grocery-footer-actions__icon">🛒</span>
        장보기 시작!
      </button>
    </div>
  </footer>
</div>
```

### CSS 스타일 구조
```css
/* 장보기 화면 컨테이너 */
.grocery-screen {
  min-height: 100vh;
  background: var(--background-cream);
  padding-bottom: calc(var(--space-20) + env(safe-area-inset-bottom));
}

.grocery-screen__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--surface-white);
  border-bottom: 1px solid var(--border-light);
}

.grocery-list {
  padding: 0 var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* 진행상황 카드 */
.grocery-progress {
  margin: var(--space-4);
  text-align: center;
}

.grocery-progress__characters {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.grocery-progress__heart {
  font-size: 1.2rem;
  animation: pulse 2s infinite;
}

.grocery-progress__title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: var(--space-3);
}

.grocery-progress__stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.progress-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.progress-stat__value {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-dark);
}

.progress-stat__label {
  font-size: var(--text-sm);
  color: var(--text-medium);
}

.progress-stat__divider {
  font-size: var(--text-xl);
  color: var(--text-medium);
  margin: 0 var(--space-2);
}

.grocery-progress__bar {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.progress-bar {
  height: 8px;
  background: var(--border-light);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: var(--gradient-sunset);
  transition: width 0.5s ease;
}

.progress-percentage {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-dark);
}

/* 빠른 추가 */
.quick-add {
  margin: 0 var(--space-4);
  margin-bottom: 0;
}

.quick-add__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.character--rabbit-small {
  font-size: 1.2rem;
}

.quick-add__input-group {
  position: relative;
  margin-bottom: var(--space-3);
}

.quick-add__input {
  padding-right: calc(var(--space-4) + 60px);
}

.quick-add__submit {
  position: absolute;
  right: var(--space-2);
  top: 50%;
  transform: translateY(-50%);
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
}

.quick-add__suggestions {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  padding-bottom: var(--space-2);
}

.suggestion-chip {
  white-space: nowrap;
  padding: var(--space-2) var(--space-3);
  background: var(--background-cream);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-base);
}

.suggestion-chip:hover {
  background: var(--rabbit-100);
  border-color: var(--rabbit-primary);
}

/* 장보기 섹션 */
.grocery-section {
  background: var(--surface-white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.grocery-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--background-cream);
  border-bottom: 1px solid var(--border-light);
}

.grocery-section__title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-dark);
}

.grocery-section__action {
  font-size: var(--text-sm);
  color: var(--potato-600);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-2);
}

.grocery-section--completed .grocery-section__header {
  background: var(--income-green);
  color: white;
}

.grocery-section--completed .grocery-section__title {
  color: white;
}

.grocery-section--completed .grocery-section__action {
  color: white;
}

/* 장보기 아이템 */
.grocery-items {
  display: flex;
  flex-direction: column;
}

.grocery-item {
  position: relative;
  background: var(--surface-white);
  border-bottom: 1px solid var(--border-light);
  transition: all var(--transition-base);
}

.grocery-item:last-child {
  border-bottom: none;
}

.grocery-item__main {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
}

.grocery-item__checkbox {
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
}

.grocery-item__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.grocery-item__checkmark {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-light);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
}

.grocery-item__input:checked + .grocery-item__checkmark {
  background: var(--income-green);
  border-color: var(--income-green);
  color: white;
}

.grocery-item__checkmark--checked {
  background: var(--income-green);
  border-color: var(--income-green);
  color: white;
}

.grocery-item__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.grocery-item__name {
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--text-dark);
  transition: all var(--transition-base);
}

.grocery-item__quantity {
  font-size: var(--text-sm);
  color: var(--text-medium);
}

.grocery-item--checked .grocery-item__name {
  text-decoration: line-through;
  color: var(--text-light);
}

.grocery-item--checked .grocery-item__quantity {
  color: var(--text-light);
}

/* 수량 조절 */
.grocery-item__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-cream);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-base);
}

.quantity-btn:hover {
  background: var(--potato-100);
  border-color: var(--potato-primary);
}

.quantity-display {
  min-width: 20px;
  text-align: center;
  font-weight: 600;
  color: var(--text-dark);
}

/* 완료 시간 */
.grocery-item__completed-time {
  flex-shrink: 0;
}

.time-badge {
  padding: var(--space-1) var(--space-2);
  background: var(--income-green);
  color: white;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 500;
}

/* 하단 액션 */
.grocery-screen__footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-4);
  background: var(--surface-white);
  border-top: 1px solid var(--border-light);
  padding-bottom: calc(var(--space-4) + env(safe-area-inset-bottom));
}

.grocery-footer-actions {
  display: flex;
  gap: var(--space-3);
}

.grocery-footer-actions__clear {
  flex: 0.4;
}

.grocery-footer-actions__shopping {
  flex: 0.6;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.grocery-footer-actions__icon {
  font-size: 1.2rem;
}
```

## 😊 6. 빈 상태 메시지 디자인

### 구조 및 레이아웃
```html
<!-- 다양한 빈 상태 컴포넌트들 -->

<!-- 1. 거래내역이 없을 때 -->
<div class="empty-state empty-state--transactions">
  <div class="empty-state__illustration">
    <div class="empty-state__characters">
      <div class="character--potato character--potato-confused">🥔</div>
      <div class="empty-state__speech-bubble">
        <div class="speech-bubble">
          <p class="speech-bubble__text">아직 거래 내역이 없네요!</p>
        </div>
      </div>
    </div>
  </div>
  
  <div class="empty-state__content">
    <h3 class="empty-state__title">거래 내역이 없어요</h3>
    <p class="empty-state__description">
      첫 거래를 추가해서 가계부를 시작해보세요.<br>
      수입과 지출을 기록하면 더 나은 가계 관리를 할 수 있어요!
    </p>
    <button class="btn btn--primary empty-state__action">
      첫 거래 추가하기
    </button>
  </div>
</div>

<!-- 2. 식단 계획이 없을 때 -->
<div class="empty-state empty-state--meals">
  <div class="empty-state__illustration">
    <div class="empty-state__characters">
      <div class="character--rabbit character--rabbit-thinking">🐰</div>
      <div class="empty-state__thought-bubble">
        <div class="thought-bubble">
          <p class="thought-bubble__text">오늘 뭐 먹지?</p>
        </div>
      </div>
    </div>
    <div class="empty-state__floating-icons">
      <span class="floating-icon floating-icon--1">🍽️</span>
      <span class="floating-icon floating-icon--2">🥗</span>
      <span class="floating-icon floating-icon--3">🍚</span>
    </div>
  </div>
  
  <div class="empty-state__content">
    <h3 class="empty-state__title">식단 계획을 세워보세요</h3>
    <p class="empty-state__description">
      일주일 식단을 미리 계획하면<br>
      장보기도 쉬워지고 음식 낭비도 줄일 수 있어요!
    </p>
    <button class="btn btn--rabbit empty-state__action">
      이번 주 식단 계획하기
    </button>
  </div>
</div>

<!-- 3. 레시피가 없을 때 -->
<div class="empty-state empty-state--recipes">
  <div class="empty-state__illustration">
    <div class="empty-state__characters">
      <div class="character--potato character--potato-chef">🥔</div>
      <div class="character--rabbit character--rabbit-excited">🐰</div>
    </div>
    <div class="empty-state__cooking-items">
      <span class="cooking-item cooking-item--pot">🍲</span>
      <span class="cooking-item cooking-item--book">📖</span>
      <span class="cooking-item cooking-item--chef-hat">👨‍🍳</span>
    </div>
  </div>
  
  <div class="empty-state__content">
    <h3 class="empty-state__title">나만의 레시피북을 만들어보세요</h3>
    <p class="empty-state__description">
      자주 만드는 요리의 레시피를 저장해두면<br>
      다음에 요리할 때 편리해요!
    </p>
    <div class="empty-state__actions">
      <button class="btn btn--outline empty-state__action">
        레시피 검색하기
      </button>
      <button class="btn btn--potato empty-state__action">
        나만의 레시피 추가
      </button>
    </div>
  </div>
</div>

<!-- 4. 장보기 목록이 없을 때 -->
<div class="empty-state empty-state--grocery">
  <div class="empty-state__illustration">
    <div class="empty-state__characters">
      <div class="character--rabbit character--rabbit-shopping">🐰</div>
      <div class="empty-state__shopping-cart">🛒</div>
    </div>
    <div class="empty-state__floating-items">
      <span class="floating-item floating-item--1">🥛</span>
      <span class="floating-item floating-item--2">🥕</span>
      <span class="floating-item floating-item--3">🍞</span>
      <span class="floating-item floating-item--4">🧅</span>
    </div>
  </div>
  
  <div class="empty-state__content">
    <h3 class="empty-state__title">장보기 목록을 만들어보세요</h3>
    <p class="empty-state__description">
      필요한 물건들을 미리 적어두면<br>
      마트에서 빠뜨리지 않고 쇼핑할 수 있어요!
    </p>
    <button class="btn btn--primary empty-state__action">
      장보기 목록 만들기
    </button>
  </div>
</div>

<!-- 5. 검색 결과가 없을 때 -->
<div class="empty-state empty-state--search">
  <div class="empty-state__illustration">
    <div class="empty-state__characters">
      <div class="character--potato character--potato-detective">🥔</div>
      <div class="empty-state__search-glass">🔍</div>
    </div>
    <div class="empty-state__question-marks">
      <span class="question-mark question-mark--1">?</span>
      <span class="question-mark question-mark--2">?</span>
      <span class="question-mark question-mark--3">?</span>
    </div>
  </div>
  
  <div class="empty-state__content">
    <h3 class="empty-state__title">검색 결과가 없어요</h3>
    <p class="empty-state__description">
      다른 검색어로 다시 시도해보세요.<br>
      혹시 오타는 없었나요?
    </p>
    <button class="btn btn--outline empty-state__action">
      검색어 다시 입력
    </button>
  </div>
</div>

<!-- 6. 네트워크 오류 -->
<div class="empty-state empty-state--error">
  <div class="empty-state__illustration">
    <div class="empty-state__characters">
      <div class="character--potato character--potato-sad">🥔</div>
      <div class="character--rabbit character--rabbit-worried">🐰</div>
    </div>
    <div class="empty-state__error-symbol">⚠️</div>
  </div>
  
  <div class="empty-state__content">
    <h3 class="empty-state__title">앗, 문제가 발생했어요</h3>
    <p class="empty-state__description">
      네트워크 연결을 확인하고<br>
      잠시 후 다시 시도해주세요.
    </p>
    <button class="btn btn--outline empty-state__action">
      다시 시도하기
    </button>
  </div>
</div>
```

### CSS 스타일 구조
```css
/* 빈 상태 컨테이너 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-12) var(--space-4);
  min-height: 400px;
}

.empty-state__illustration {
  position: relative;
  margin-bottom: var(--space-8);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.empty-state__characters {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  position: relative;
}

/* 캐릭터 변형 */
.character--potato-confused,
.character--potato-chef,
.character--potato-detective,
.character--potato-sad {
  font-size: 3rem;
  animation: potato-wiggle 3s ease-in-out infinite;
}

.character--rabbit-thinking,
.character--rabbit-excited,
.character--rabbit-shopping,
.character--rabbit-worried {
  font-size: 3rem;
  animation: rabbit-bounce 2.5s ease-in-out infinite;
}

@keyframes potato-wiggle {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
}

@keyframes rabbit-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* 말풍선 */
.speech-bubble,
.thought-bubble {
  position: relative;
  background: var(--surface-white);
  border: 2px solid var(--potato-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  box-shadow: var(--shadow-md);
  animation: bubble-float 2s ease-in-out infinite;
}

.thought-bubble {
  border-style: dashed;
  border-color: var(--rabbit-primary);
}

.speech-bubble::after,
.thought-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid var(--potato-primary);
}

.thought-bubble::after {
  border-top-color: var(--rabbit-primary);
}

.speech-bubble__text,
.thought-bubble__text {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-dark);
  margin: 0;
  white-space: nowrap;
}

@keyframes bubble-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* 플로팅 아이콘들 */
.empty-state__floating-icons,
.empty-state__floating-items,
.empty-state__cooking-items {
  position: absolute;
  width: 200px;
  height: 200px;
  pointer-events: none;
}

.floating-icon,
.floating-item,
.cooking-item {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.7;
}

.floating-icon--1,
.floating-item--1 {
  top: 20%;
  left: 10%;
  animation: float-1 3s ease-in-out infinite;
}

.floating-icon--2,
.floating-item--2 {
  top: 30%;
  right: 15%;
  animation: float-2 2.5s ease-in-out infinite;
}

.floating-icon--3,
.floating-item--3 {
  bottom: 25%;
  left: 20%;
  animation: float-3 3.5s ease-in-out infinite;
}

.floating-item--4 {
  bottom: 15%;
  right: 10%;
  animation: float-1 2.8s ease-in-out infinite;
}

@keyframes float-1 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(5deg); }
  66% { transform: translateY(-5px) rotate(-3deg); }
}

@keyframes float-2 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-5deg); }
}

@keyframes float-3 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  40% { transform: translateY(-8px) rotate(3deg); }
  80% { transform: translateY(-12px) rotate(-2deg); }
}

/* 쿠킹 아이템 */
.cooking-item--pot {
  top: 10%;
  left: 20%;
  animation: cooking-steam 2s ease-in-out infinite;
}

.cooking-item--book {
  bottom: 30%;
  right: 20%;
  animation: page-flip 3s ease-in-out infinite;
}

.cooking-item--chef-hat {
  top: 20%;
  right: 10%;
  animation: float-2 2.5s ease-in-out infinite;
}

@keyframes cooking-steam {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
  50% { transform: translateY(-10px) scale(1.1); opacity: 1; }
}

@keyframes page-flip {
  0%, 100% { transform: rotateY(0); }
  50% { transform: rotateY(10deg); }
}

/* 에러/검색 요소 */
.empty-state__search-glass {
  font-size: 2rem;
  animation: search-move 2s ease-in-out infinite;
}

.empty-state__error-symbol {
  font-size: 2.5rem;
  color: var(--expense-coral);
  animation: error-pulse 1.5s ease-in-out infinite;
}

@keyframes search-move {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(10px); }
}

@keyframes error-pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
}

/* 물음표 */
.empty-state__question-marks {
  position: absolute;
  width: 150px;
  height: 150px;
}

.question-mark {
  position: absolute;
  font-size: 1.2rem;
  color: var(--text-medium);
  font-weight: 600;
}

.question-mark--1 {
  top: 20%;
  left: 30%;
  animation: question-float-1 2s ease-in-out infinite;
}

.question-mark--2 {
  top: 40%;
  right: 20%;
  animation: question-float-2 2.3s ease-in-out infinite;
}

.question-mark--3 {
  bottom: 30%;
  left: 50%;
  animation: question-float-3 1.8s ease-in-out infinite;
}

@keyframes question-float-1 {
  0%, 100% { transform: translateY(0) rotate(-5deg); opacity: 0.6; }
  50% { transform: translateY(-8px) rotate(5deg); opacity: 1; }
}

@keyframes question-float-2 {
  0%, 100% { transform: translateY(0) rotate(3deg); opacity: 0.7; }
  50% { transform: translateY(-6px) rotate(-3deg); opacity: 1; }
}

@keyframes question-float-3 {
  0%, 100% { transform: translateY(0) rotate(-2deg); opacity: 0.5; }
  50% { transform: translateY(-10px) rotate(2deg); opacity: 0.9; }
}

/* 쇼핑카트 */
.empty-state__shopping-cart {
  font-size: 2rem;
  animation: cart-roll 3s ease-in-out infinite;
}

@keyframes cart-roll {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(8px); }
}

/* 콘텐츠 영역 */
.empty-state__content {
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.empty-state__title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.empty-state__description {
  font-size: var(--text-base);
  color: var(--text-medium);
  line-height: 1.6;
  margin: 0;
}

.empty-state__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
}

.empty-state__action {
  white-space: nowrap;
}

/* 반응형 조정 */
@media (min-width: 640px) {
  .empty-state {
    padding: var(--space-16) var(--space-6);
  }
  
  .empty-state__actions {
    flex-direction: row;
    justify-content: center;
  }
  
  .empty-state__action {
    flex: 0 0 auto;
  }
}
```

## 📱 7. 바텀 내비게이션

### 구조 및 레이아웃
```html
<nav class="bottom-navigation">
  <div class="bottom-navigation__container">
    <a href="/home" class="bottom-nav-item bottom-nav-item--active">
      <div class="bottom-nav-item__icon">🏠</div>
      <span class="bottom-nav-item__label">홈</span>
    </a>
    
    <a href="/transactions" class="bottom-nav-item">
      <div class="bottom-nav-item__icon">💰</div>
      <span class="bottom-nav-item__label">거래내역</span>
      <div class="bottom-nav-item__badge">3</div>
    </a>
    
    <div class="bottom-nav-item bottom-nav-item--add">
      <button class="bottom-nav-add-btn">
        <svg class="icon-plus" width="24" height="24">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    </div>
    
    <a href="/meals" class="bottom-nav-item">
      <div class="bottom-nav-item__icon">🍽️</div>
      <span class="bottom-nav-item__label">식단</span>
    </a>
    
    <a href="/grocery" class="bottom-nav-item">
      <div class="bottom-nav-item__icon">🛒</div>
      <span class="bottom-nav-item__label">장보기</span>
      <div class="bottom-nav-item__badge">5</div>
    </a>
  </div>
</nav>
```

### CSS 스타일 구조
```css
/* 바텀 내비게이션 */
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
}

.bottom-navigation__container {
  display: flex;
  align-items: center;
  background: var(--surface-white);
  border-top: 1px solid var(--border-light);
  padding: var(--space-2) 0;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
}

.bottom-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2);
  text-decoration: none;
  transition: all var(--transition-base);
  position: relative;
}

.bottom-nav-item__icon {
  font-size: 1.5rem;
  transition: all var(--transition-base);
}

.bottom-nav-item__label {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-medium);
  transition: all var(--transition-base);
}

.bottom-nav-item--active .bottom-nav-item__icon {
  transform: scale(1.1);
}

.bottom-nav-item--active .bottom-nav-item__label {
  color: var(--potato-600);
  font-weight: 600;
}

.bottom-nav-item__badge {
  position: absolute;
  top: var(--space-1);
  right: var(--space-3);
  width: 18px;
  height: 18px;
  background: var(--expense-coral);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 추가 버튼 */
.bottom-nav-item--add {
  position: relative;
}

.bottom-nav-add-btn {
  width: 56px;
  height: 56px;
  background: var(--gradient-sunset);
  border: none;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-floating);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  top: -8px;
}

.bottom-nav-add-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.bottom-nav-add-btn:active {
  transform: scale(0.95);
}
```

이제 모든 주요 화면과 컴포넌트의 구조적 설계가 완료되었습니다! 🎨✨