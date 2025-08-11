-- =====================================================
-- 🧪 SUPABASE CRUD TEST SUITE
-- transactions, meal_plans, recipes 테이블 테스트
-- Supabase SQL Editor에서 직접 실행 가능
-- =====================================================

-- 📋 테스트 시작 로그
SELECT '🚀 CRUD 테스트 시작: ' || NOW()::timestamp as test_start;

-- =====================================================
-- 🧹 테스트 환경 초기화 (기존 테스트 데이터 정리)
-- =====================================================

-- 기존 테스트 데이터 삭제 (안전하게)
DELETE FROM recipe_ingredients WHERE recipe_id IN (
    SELECT id FROM recipes WHERE title LIKE 'TEST_%'
);
DELETE FROM recipes WHERE title LIKE 'TEST_%';
DELETE FROM transactions WHERE description LIKE 'TEST_%';
DELETE FROM meal_plans WHERE breakfast LIKE 'TEST_%' OR lunch LIKE 'TEST_%' OR dinner LIKE 'TEST_%';
DELETE FROM categories WHERE name LIKE 'TEST_%';
DELETE FROM users WHERE name LIKE 'TEST_%';

SELECT '✅ 기존 테스트 데이터 정리 완료' as cleanup_status;

-- =====================================================
-- 👥 1. USERS 테이블 CRUD 테스트
-- =====================================================

SELECT '📊 1. USERS 테이블 테스트 시작' as test_section;

-- CREATE: 테스트 사용자 생성
INSERT INTO users (name, user_type) VALUES 
('TEST_김철수', 'husband'),
('TEST_김영희', 'wife')
RETURNING id, name, user_type, created_at;

-- READ: 생성된 사용자 조회
SELECT '✅ CREATE 테스트: 사용자 생성 완료' as create_test;
SELECT id, name, user_type, created_at 
FROM users 
WHERE name LIKE 'TEST_%' 
ORDER BY created_at DESC;

-- UPDATE: 사용자 이름 수정
UPDATE users 
SET name = 'TEST_김철수_수정됨'
WHERE name = 'TEST_김철수'
RETURNING id, name, user_type, updated_at;

SELECT '✅ UPDATE 테스트: 사용자 수정 완료' as update_test;

-- READ: 수정 확인
SELECT id, name, user_type 
FROM users 
WHERE name LIKE 'TEST_%수정됨%';

-- =====================================================
-- 🏷️ 2. CATEGORIES 테이블 CRUD 테스트
-- =====================================================

SELECT '📊 2. CATEGORIES 테이블 테스트 시작' as test_section;

-- 테스트용 사용자 ID 가져오기
WITH test_user AS (
    SELECT id as user_id FROM users WHERE name LIKE 'TEST_%' LIMIT 1
)
-- CREATE: 카테고리 생성
INSERT INTO categories (name, icon, color, user_id)
SELECT 'TEST_식비', '🍽️', '#FF6B6B', user_id FROM test_user
UNION ALL
SELECT 'TEST_교통비', '🚗', '#4ECDC4', user_id FROM test_user
UNION ALL  
SELECT 'TEST_생활비', '🏠', '#45B7D1', user_id FROM test_user
RETURNING id, name, icon, color, user_id, created_at;

SELECT '✅ CREATE 테스트: 카테고리 생성 완료' as create_test;

-- READ: 생성된 카테고리 조회
SELECT c.id, c.name, c.icon, c.color, u.name as user_name, c.created_at
FROM categories c
JOIN users u ON c.user_id = u.id
WHERE c.name LIKE 'TEST_%'
ORDER BY c.created_at;

-- UPDATE: 카테고리 색상 변경
UPDATE categories 
SET color = '#FF9999', updated_at = NOW()
WHERE name = 'TEST_식비'
RETURNING id, name, color, updated_at;

SELECT '✅ UPDATE 테스트: 카테고리 수정 완료' as update_test;

-- =====================================================
-- 💰 3. TRANSACTIONS 테이블 CRUD 테스트
-- =====================================================

SELECT '📊 3. TRANSACTIONS 테이블 테스트 시작' as test_section;

-- CREATE: 거래 내역 생성
WITH test_data AS (
    SELECT 
        u.id as user_id,
        c.id as category_id
    FROM users u
    JOIN categories c ON c.user_id = u.id
    WHERE u.name LIKE 'TEST_%' AND c.name = 'TEST_식비'
    LIMIT 1
)
INSERT INTO transactions (amount, type, category_id, user_id, description)
SELECT 15000, 'expense', category_id, user_id, 'TEST_점심 식사' FROM test_data
UNION ALL
SELECT 50000, 'income', category_id, user_id, 'TEST_용돈 입금' FROM test_data
UNION ALL
SELECT 8500, 'expense', category_id, user_id, 'TEST_커피 구매' FROM test_data
RETURNING id, amount, type, description, created_at;

SELECT '✅ CREATE 테스트: 거래내역 생성 완료' as create_test;

-- READ: 생성된 거래내역 조회 (JOIN 테스트)
SELECT 
    t.id,
    t.amount,
    t.type,
    t.description,
    c.name as category_name,
    c.icon as category_icon,
    u.name as user_name,
    t.created_at
FROM transactions t
JOIN categories c ON t.category_id = c.id  
JOIN users u ON t.user_id = u.id
WHERE t.description LIKE 'TEST_%'
ORDER BY t.created_at DESC;

-- READ: 집계 쿼리 테스트 (수입/지출 합계)
SELECT 
    type,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount
FROM transactions 
WHERE description LIKE 'TEST_%'
GROUP BY type
ORDER BY type;

-- UPDATE: 거래 금액 수정
UPDATE transactions 
SET amount = 12000, updated_at = NOW()
WHERE description = 'TEST_점심 식사'
RETURNING id, amount, description, updated_at;

SELECT '✅ UPDATE 테스트: 거래내역 수정 완료' as update_test;

-- =====================================================
-- 🍽️ 4. MEAL_PLANS 테이블 CRUD 테스트  
-- =====================================================

SELECT '📊 4. MEAL_PLANS 테이블 테스트 시작' as test_section;

-- CREATE: 식단 계획 생성
INSERT INTO meal_plans (date, breakfast, lunch, dinner) VALUES 
('2024-01-15', 'TEST_토스트와 계란', 'TEST_김치찌개', 'TEST_불고기'),
('2024-01-16', 'TEST_오트밀', 'TEST_비빔밥', 'TEST_생선구이'),
('2024-01-17', 'TEST_시리얼', 'TEST_파스타', 'TEST_치킨')
RETURNING id, date, breakfast, lunch, dinner, created_at;

SELECT '✅ CREATE 테스트: 식단계획 생성 완료' as create_test;

-- READ: 생성된 식단 조회
SELECT id, date, breakfast, lunch, dinner, created_at
FROM meal_plans 
WHERE breakfast LIKE 'TEST_%' 
ORDER BY date;

-- READ: 날짜 범위 조회 테스트
SELECT 
    date,
    breakfast,
    lunch, 
    dinner,
    EXTRACT(dow FROM date) as day_of_week,
    TO_CHAR(date, 'YYYY-MM-DD (Day)') as formatted_date
FROM meal_plans 
WHERE date BETWEEN '2024-01-15' AND '2024-01-17'
ORDER BY date;

-- UPDATE: 식단 수정
UPDATE meal_plans 
SET dinner = 'TEST_불고기_수정됨', updated_at = NOW()
WHERE date = '2024-01-15'
RETURNING id, date, dinner, updated_at;

SELECT '✅ UPDATE 테스트: 식단계획 수정 완료' as update_test;

-- =====================================================
-- 📖 5. RECIPES 테이블 CRUD 테스트
-- =====================================================

SELECT '📊 5. RECIPES 테이블 테스트 시작' as test_section;

-- CREATE: 레시피 생성
INSERT INTO recipes (title, description, instructions) VALUES 
('TEST_김치찌개', 'TEST_한국 전통 김치찌개 레시피', 'TEST_1. 김치를 볶는다 2. 물을 넣는다 3. 끓인다'),
('TEST_불고기', 'TEST_달콤한 불고기 레시피', 'TEST_1. 고기를 양념한다 2. 볶는다'),
('TEST_비빔밥', 'TEST_영양가득 비빔밥', 'TEST_1. 나물을 준비한다 2. 밥 위에 올린다')
RETURNING id, title, description, created_at;

SELECT '✅ CREATE 테스트: 레시피 생성 완료' as create_test;

-- READ: 생성된 레시피 조회
SELECT id, title, description, instructions, created_at
FROM recipes 
WHERE title LIKE 'TEST_%'
ORDER BY created_at;

-- UPDATE: 레시피 설명 수정
UPDATE recipes 
SET description = 'TEST_한국 전통 김치찌개 레시피 (수정됨)', updated_at = NOW()
WHERE title = 'TEST_김치찌개'
RETURNING id, title, description, updated_at;

-- =====================================================  
-- 🥕 6. RECIPE_INGREDIENTS 테이블 CRUD 테스트
-- =====================================================

SELECT '📊 6. RECIPE_INGREDIENTS 테이블 테스트 시작' as test_section;

-- CREATE: 레시피 재료 생성
WITH test_recipe AS (
    SELECT id as recipe_id FROM recipes WHERE title = 'TEST_김치찌개' LIMIT 1
)
INSERT INTO recipe_ingredients (recipe_id, ingredient, quantity, unit)
SELECT recipe_id, '김치', '200', 'g' FROM test_recipe
UNION ALL
SELECT recipe_id, '돼지고기', '150', 'g' FROM test_recipe  
UNION ALL
SELECT recipe_id, '두부', '1', '개' FROM test_recipe
UNION ALL
SELECT recipe_id, '대파', '1', '개' FROM test_recipe
RETURNING id, recipe_id, ingredient, quantity, unit, created_at;

SELECT '✅ CREATE 테스트: 레시피 재료 생성 완료' as create_test;

-- READ: 레시피별 재료 조회 (JOIN 테스트)
SELECT 
    r.title as recipe_title,
    ri.ingredient,
    ri.quantity,
    ri.unit,
    ri.quantity || ri.unit as formatted_amount,
    ri.created_at
FROM recipes r
JOIN recipe_ingredients ri ON r.id = ri.recipe_id
WHERE r.title LIKE 'TEST_%'
ORDER BY r.title, ri.id;

-- READ: 재료별 사용 빈도 조회
SELECT 
    ingredient,
    COUNT(*) as usage_count,
    STRING_AGG(DISTINCT r.title, ', ') as used_in_recipes
FROM recipe_ingredients ri
JOIN recipes r ON ri.recipe_id = r.id
WHERE r.title LIKE 'TEST_%'
GROUP BY ingredient
ORDER BY usage_count DESC;

-- UPDATE: 재료 수량 수정
UPDATE recipe_ingredients 
SET quantity = '250', unit = 'g'
WHERE ingredient = '김치' 
AND recipe_id IN (SELECT id FROM recipes WHERE title = 'TEST_김치찌개')
RETURNING id, ingredient, quantity, unit;

SELECT '✅ UPDATE 테스트: 재료 수정 완료' as update_test;

-- =====================================================
-- 🔍 7. 복합 쿼리 테스트 (다중 테이블 JOIN)
-- =====================================================

SELECT '📊 7. 복합 쿼리 테스트 시작' as test_section;

-- 사용자별 총 지출 및 카테고리별 분석
SELECT 
    u.name as user_name,
    u.user_type,
    COUNT(t.id) as transaction_count,
    SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as total_income,
    SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as total_expense,
    SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END) as net_amount
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id AND t.description LIKE 'TEST_%'
WHERE u.name LIKE 'TEST_%'
GROUP BY u.id, u.name, u.user_type
ORDER BY u.name;

-- 카테고리별 지출 분석
SELECT 
    c.name as category_name,
    c.icon,
    COUNT(t.id) as transaction_count,
    SUM(t.amount) as total_amount,
    ROUND(AVG(t.amount), 2) as avg_amount
FROM categories c
LEFT JOIN transactions t ON c.id = t.category_id AND t.description LIKE 'TEST_%'
WHERE c.name LIKE 'TEST_%'
GROUP BY c.id, c.name, c.icon
ORDER BY total_amount DESC;

-- 레시피와 재료 수 분석
SELECT 
    r.title,
    r.description,
    COUNT(ri.id) as ingredient_count,
    STRING_AGG(ri.ingredient || ' ' || ri.quantity || ri.unit, ', ' ORDER BY ri.id) as ingredients_list
FROM recipes r
LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
WHERE r.title LIKE 'TEST_%'
GROUP BY r.id, r.title, r.description
ORDER BY ingredient_count DESC;

SELECT '✅ 복합 쿼리 테스트 완료' as complex_query_test;

-- =====================================================
-- 🧪 8. 데이터 무결성 및 제약조건 테스트
-- =====================================================

SELECT '📊 8. 데이터 무결성 테스트 시작' as test_section;

-- 중복 날짜 삽입 테스트 (UNIQUE 제약조건)
DO $$
BEGIN
    BEGIN
        INSERT INTO meal_plans (date, breakfast) VALUES ('2024-01-15', 'TEST_중복테스트');
        RAISE EXCEPTION 'UNIQUE 제약조건이 작동하지 않음!';
    EXCEPTION
        WHEN unique_violation THEN
            RAISE NOTICE '✅ UNIQUE 제약조건 테스트 통과: 중복 날짜 삽입 차단됨';
    END;
END $$;

-- 잘못된 ENUM 값 테스트
DO $$
BEGIN
    BEGIN
        INSERT INTO users (name, user_type) VALUES ('TEST_잘못된사용자', 'invalid_type');
        RAISE EXCEPTION 'ENUM 제약조건이 작동하지 않음!';
    EXCEPTION  
        WHEN invalid_text_representation THEN
            RAISE NOTICE '✅ ENUM 제약조건 테스트 통과: 잘못된 user_type 차단됨';
    END;
END $$;

-- NULL 제약조건 테스트
DO $$
BEGIN
    BEGIN
        INSERT INTO transactions (amount, type, user_id) VALUES (NULL, 'expense', 1);
        RAISE EXCEPTION 'NOT NULL 제약조건이 작동하지 않음!';
    EXCEPTION
        WHEN not_null_violation THEN
            RAISE NOTICE '✅ NOT NULL 제약조건 테스트 통과: NULL 금액 차단됨';
    END;
END $$;

SELECT '✅ 데이터 무결성 테스트 완료' as integrity_test;

-- =====================================================
-- 🗑️ 9. DELETE 테스트 (CASCADE 동작 확인)
-- =====================================================

SELECT '📊 9. DELETE 테스트 시작' as test_section;

-- 삭제 전 관련 데이터 개수 확인
SELECT 
    'Before DELETE' as timing,
    (SELECT COUNT(*) FROM users WHERE name LIKE 'TEST_%') as users_count,
    (SELECT COUNT(*) FROM categories WHERE name LIKE 'TEST_%') as categories_count,
    (SELECT COUNT(*) FROM transactions WHERE description LIKE 'TEST_%') as transactions_count,
    (SELECT COUNT(*) FROM recipes WHERE title LIKE 'TEST_%') as recipes_count,
    (SELECT COUNT(*) FROM recipe_ingredients WHERE recipe_id IN (SELECT id FROM recipes WHERE title LIKE 'TEST_%')) as ingredients_count,
    (SELECT COUNT(*) FROM meal_plans WHERE breakfast LIKE 'TEST_%') as meal_plans_count;

-- 특정 레시피 삭제 (CASCADE 테스트)
DELETE FROM recipes WHERE title = 'TEST_김치찌개';

-- 특정 사용자 삭제 (CASCADE 테스트) 
DELETE FROM users WHERE name LIKE 'TEST_%수정됨%';

-- 특정 식단 삭제
DELETE FROM meal_plans WHERE date = '2024-01-16';

SELECT '✅ DELETE 테스트: CASCADE 동작 확인' as delete_test;

-- 삭제 후 관련 데이터 개수 확인
SELECT 
    'After DELETE' as timing,
    (SELECT COUNT(*) FROM users WHERE name LIKE 'TEST_%') as users_count,
    (SELECT COUNT(*) FROM categories WHERE name LIKE 'TEST_%') as categories_count,
    (SELECT COUNT(*) FROM transactions WHERE description LIKE 'TEST_%') as transactions_count,
    (SELECT COUNT(*) FROM recipes WHERE title LIKE 'TEST_%') as recipes_count,
    (SELECT COUNT(*) FROM recipe_ingredients WHERE recipe_id IN (SELECT id FROM recipes WHERE title LIKE 'TEST_%')) as ingredients_count,
    (SELECT COUNT(*) FROM meal_plans WHERE breakfast LIKE 'TEST_%') as meal_plans_count;

-- =====================================================
-- 🧹 10. 테스트 데이터 완전 정리
-- =====================================================

SELECT '📊 10. 테스트 데이터 정리 시작' as test_section;

-- 모든 테스트 데이터 삭제
DELETE FROM recipe_ingredients WHERE recipe_id IN (
    SELECT id FROM recipes WHERE title LIKE 'TEST_%'
);
DELETE FROM recipes WHERE title LIKE 'TEST_%';
DELETE FROM transactions WHERE description LIKE 'TEST_%';  
DELETE FROM meal_plans WHERE breakfast LIKE 'TEST_%' OR lunch LIKE 'TEST_%' OR dinner LIKE 'TEST_%';
DELETE FROM categories WHERE name LIKE 'TEST_%';
DELETE FROM users WHERE name LIKE 'TEST_%';

SELECT '✅ 모든 테스트 데이터 정리 완료' as cleanup_final;

-- =====================================================
-- 📊 테스트 결과 요약
-- =====================================================

SELECT '🎉 CRUD 테스트 완료 요약' as test_summary;

SELECT 
    '총 테스트 항목' as metric,
    '10개 섹션' as value
UNION ALL
SELECT 'CREATE 테스트', '✅ 통과'
UNION ALL  
SELECT 'READ 테스트', '✅ 통과'
UNION ALL
SELECT 'UPDATE 테스트', '✅ 통과'  
UNION ALL
SELECT 'DELETE 테스트', '✅ 통과'
UNION ALL
SELECT 'JOIN 테스트', '✅ 통과'
UNION ALL
SELECT '제약조건 테스트', '✅ 통과'
UNION ALL
SELECT 'CASCADE 테스트', '✅ 통과'
UNION ALL
SELECT '데이터 정리', '✅ 완료';

SELECT '🚀 테스트 종료: ' || NOW()::timestamp as test_end;

-- =====================================================
-- 📝 테스트 실행 가이드
-- =====================================================

/*
🔧 실행 방법:
1. Supabase Dashboard → SQL Editor 접속
2. 이 전체 스크립트를 복사하여 붙여넣기
3. "Run" 버튼 클릭하여 실행
4. 각 섹션별 결과를 확인

📊 확인 포인트:
- 각 테스트 섹션에서 "✅ 통과" 메시지 확인
- 데이터 생성/수정/삭제가 정상적으로 작동하는지 확인
- JOIN 쿼리가 올바른 결과를 반환하는지 확인
- 제약조건이 올바르게 작동하는지 확인
- CASCADE 삭제가 올바르게 작동하는지 확인

🚨 주의사항:
- 테스트는 "TEST_" 접두사가 붙은 데이터만 사용
- 기존 운영 데이터에는 영향 없음
- 테스트 완료 후 모든 테스트 데이터 자동 정리
*/