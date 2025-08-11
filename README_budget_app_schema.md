# 부부 가계부 앱 데이터베이스 스키마

Supabase 백엔드를 위한 귀여운 부부 가계부 앱의 완전한 데이터베이스 스키마입니다.

## 📋 테이블 구조

### 1. ENUM 타입 정의
- `user_type`: 'husband' | 'wife'
- `transaction_type`: 'income' | 'expense'

### 2. 테이블 스키마

#### 👫 users (사용자)
- `id` (bigint, PK, auto-increment)
- `name` (text, not null) - 사용자 이름
- `user_type` (user_type enum, not null) - 남편/아내 구분
- `created_at` (timestamptz, auto)

#### 🏷️ categories (카테고리)
- `id` (bigint, PK, auto-increment)
- `name` (text, not null) - 카테고리 이름
- `icon` (text) - 이모지 아이콘
- `color` (text) - 색상 코드
- `user_id` (bigint, FK → users.id, cascade delete)
- `created_at` (timestamptz, auto)
- `updated_at` (timestamptz, auto + trigger)

#### 💰 transactions (거래내역)
- `id` (bigint, PK, auto-increment)
- `amount` (numeric(12,2), not null) - 금액
- `type` (transaction_type enum, not null) - 수입/지출
- `category_id` (bigint, FK → categories.id, set null on delete)
- `user_id` (bigint, FK → users.id, cascade delete)
- `description` (text) - 거래 설명
- `created_at` (timestamptz, auto)
- `updated_at` (timestamptz, auto + trigger)

#### 🛒 grocery_items (장보기 목록)
- `id` (bigint, PK, auto-increment)
- `name` (text, not null) - 상품명
- `quantity` (integer, default 1) - 수량
- `is_stocked` (boolean, default false) - 구매 여부
- `created_at` (timestamptz, auto)
- `updated_at` (timestamptz, auto + trigger)

#### 🍽️ meal_plans (식단 계획)
- `id` (bigint, PK, auto-increment)
- `date` (date, not null, unique) - 날짜
- `breakfast` (text) - 아침 메뉴
- `lunch` (text) - 점심 메뉴
- `dinner` (text) - 저녁 메뉴
- `created_at` (timestamptz, auto)
- `updated_at` (timestamptz, auto + trigger)

#### 📖 recipes (레시피)
- `id` (bigint, PK, auto-increment)
- `title` (text, not null) - 레시피 제목
- `description` (text) - 레시피 설명
- `instructions` (text) - 조리법
- `created_at` (timestamptz, auto)
- `updated_at` (timestamptz, auto + trigger)

#### 🥕 recipe_ingredients (레시피 재료)
- `id` (bigint, PK, auto-increment)
- `recipe_id` (bigint, FK → recipes.id, cascade delete)
- `ingredient` (text, not null) - 재료명
- `quantity` (text) - 양
- `unit` (text) - 단위
- `created_at` (timestamptz, auto)

## 🚀 성능 최적화 인덱스

### 주요 쿼리 패턴을 위한 인덱스:
- `idx_users_user_type` - 사용자 타입별 조회
- `idx_transactions_user_id` - 사용자별 거래내역 조회
- `idx_transactions_category_id` - 카테고리별 거래내역 조회
- `idx_transactions_type` - 수입/지출 타입별 조회
- `idx_transactions_created_at` - 날짜별 조회
- `idx_transactions_user_type_date` - 복합 인덱스 (사용자+날짜)
- 기타 자주 조회되는 컬럼들에 대한 인덱스

## 📊 샘플 데이터

### 사용자 데이터:
- 김철수 (husband)
- 김영희 (wife)

### 카테고리 (각 사용자별 5개씩):
**남편용:**
- 식비 🍽️ (#FF6B6B)
- 교통비 🚗 (#4ECDC4)
- 생활용품 🏠 (#45B7D1)
- 의료비 💊 (#96CEB4)
- 여가/오락 🎮 (#FFEAA7)

**아내용:**
- 쇼핑 🛍️ (#DDA0DD)
- 미용 💄 (#FFB6C1)
- 교육 📚 (#98D8C8)
- 카페 ☕ (#F7DC6F)
- 건강 🏋️ (#AED6F1)

### 거래내역:
- 각 사용자별 6개 거래 (수입/지출 포함)
- 실제적인 한국 가계 예시

### 기타 데이터:
- 장보기 목록: 8개 항목
- 식단 계획: 1주일치
- 레시피: 6개 (한식 위주)
- 레시피 재료: 각 레시피별 상세 재료

## ⚡ 특별 기능

### 자동 updated_at 트리거
- `update_updated_at_column()` 함수
- 모든 테이블의 `updated_at` 컬럼 자동 업데이트

### 데이터 무결성
- 외래 키 제약 조건
- ENUM 타입으로 값 제한
- NOT NULL 제약 조건
- UNIQUE 제약 조건 (meal_plans.date)

## 📝 사용법

### 1. 마이그레이션 실행
```sql
-- create_budget_app_schema.sql 파일 실행
```

### 2. 테스트 쿼리 실행
```sql
-- test_queries.sql 파일로 스키마 검증
```

### 3. 주요 쿼리 예시

#### 월별 수입/지출 요약:
```sql
select 
    u.name as user_name,
    u.user_type,
    sum(case when t.type = 'income' then t.amount else 0 end) as total_income,
    sum(case when t.type = 'expense' then t.amount else 0 end) as total_expense
from users u
left join transactions t on u.id = t.user_id
group by u.id, u.name, u.user_type;
```

#### 카테고리별 지출 분석:
```sql
select 
    c.name as category_name,
    sum(t.amount) as total_spent,
    count(t.id) as transaction_count
from categories c
left join transactions t on c.id = t.category_id and t.type = 'expense'
group by c.id, c.name
having count(t.id) > 0
order by total_spent desc;
```

#### 이번 주 식단:
```sql
select date, breakfast, lunch, dinner
from meal_plans
where date >= current_date
order by date
limit 7;
```

## 🛡️ 보안 고려사항

- RLS(Row Level Security)는 사용하지 않음 (요구사항에 따라)
- 애플리케이션 레벨에서 사용자 데이터 분리 구현 필요
- 사용자 인증은 Supabase Auth 활용 권장

## 🔧 향후 확장 가능성

- 예산 계획 테이블 추가
- 정기 거래 스케줄링
- 영수증 이미지 저장
- 가계부 공유 기능
- 통계 및 분석 뷰 추가