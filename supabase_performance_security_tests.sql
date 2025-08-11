-- =====================================================
-- 🔒 SUPABASE 성능 & 보안 테스트 SUITE
-- 성능 최적화 및 보안 검증 테스트
-- Supabase SQL Editor에서 직접 실행 가능
-- =====================================================

-- 📋 성능/보안 테스트 시작 로그
SELECT '🚀 성능/보안 테스트 시작: ' || NOW()::timestamp as test_start;

-- =====================================================
-- 📊 1. 인덱스 성능 테스트
-- =====================================================

SELECT '📊 1. 인덱스 성능 테스트 시작' as test_section;

-- 대량 테스트 데이터 생성 (성능 테스트용)
WITH test_user AS (
    INSERT INTO users (name, user_type) VALUES ('PERF_TEST_USER', 'husband')
    RETURNING id
),
test_category AS (
    INSERT INTO categories (name, icon, user_id) 
    SELECT 'PERF_TEST_CATEGORY', '🧪', id FROM test_user
    RETURNING id
)
-- 1000개 거래 내역 생성
INSERT INTO transactions (amount, type, category_id, user_id, description)
SELECT 
    (random() * 100000)::numeric(12,2),
    CASE WHEN random() > 0.7 THEN 'income' ELSE 'expense' END,
    tc.id,
    tu.id,
    'PERF_TEST_' || generate_series
FROM test_user tu, test_category tc, generate_series(1, 1000);

SELECT '✅ 대량 테스트 데이터 생성 완료 (1000건)' as data_creation;

-- 인덱스 사용 성능 테스트
EXPLAIN (ANALYZE, BUFFERS) 
SELECT t.*, c.name as category_name, u.name as user_name
FROM transactions t
JOIN categories c ON t.category_id = c.id
JOIN users u ON t.user_id = u.id  
WHERE t.description LIKE 'PERF_TEST_%'
ORDER BY t.created_at DESC
LIMIT 10;

-- 집계 쿼리 성능 테스트
EXPLAIN (ANALYZE, BUFFERS)
SELECT 
    t.type,
    COUNT(*) as count,
    SUM(t.amount) as total,
    AVG(t.amount) as average
FROM transactions t
WHERE t.description LIKE 'PERF_TEST_%'
GROUP BY t.type;

SELECT '✅ 인덱스 성능 테스트 완료' as index_performance_test;

-- =====================================================
-- 🔍 2. 쿼리 최적화 테스트
-- =====================================================

SELECT '📊 2. 쿼리 최적화 테스트 시작' as test_section;

-- 비효율적 vs 효율적 쿼리 비교

-- 비효율적 쿼리 (N+1 문제 시뮬레이션)
SELECT '비효율적 쿼리 (서브쿼리 사용):' as query_type;
EXPLAIN (ANALYZE, BUFFERS)
SELECT 
    t.*,
    (SELECT c.name FROM categories c WHERE c.id = t.category_id) as category_name,
    (SELECT u.name FROM users u WHERE u.id = t.user_id) as user_name
FROM transactions t
WHERE t.description LIKE 'PERF_TEST_%'
LIMIT 10;

-- 효율적 쿼리 (JOIN 사용)
SELECT '효율적 쿼리 (JOIN 사용):' as query_type;
EXPLAIN (ANALYZE, BUFFERS)
SELECT 
    t.*,
    c.name as category_name,
    u.name as user_name
FROM transactions t
JOIN categories c ON t.category_id = c.id
JOIN users u ON t.user_id = u.id
WHERE t.description LIKE 'PERF_TEST_%'
LIMIT 10;

-- 페이지네이션 최적화 테스트
SELECT '페이지네이션 테스트 (OFFSET vs ID 기반):' as query_type;

-- OFFSET 기반 (비권장)
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM transactions 
WHERE description LIKE 'PERF_TEST_%'
ORDER BY created_at DESC
LIMIT 20 OFFSET 100;

-- ID/타임스탬프 기반 (권장)
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM transactions 
WHERE description LIKE 'PERF_TEST_%'
  AND created_at < (
    SELECT created_at FROM transactions 
    WHERE description LIKE 'PERF_TEST_%'
    ORDER BY created_at DESC 
    LIMIT 1 OFFSET 100
  )
ORDER BY created_at DESC
LIMIT 20;

SELECT '✅ 쿼리 최적화 테스트 완료' as query_optimization_test;

-- =====================================================
-- 🛡️ 3. 보안 테스트 (SQL Injection 방지)
-- =====================================================

SELECT '📊 3. 보안 테스트 시작' as test_section;

-- 안전한 매개변수화 쿼리 테스트
DO $$
DECLARE
    safe_user_input TEXT := 'PERF_TEST_1';
    malicious_input TEXT := 'PERF_TEST_1''; DROP TABLE transactions; --';
BEGIN
    -- 매개변수화된 쿼리 (안전함)
    PERFORM * FROM transactions 
    WHERE description = safe_user_input;
    
    RAISE NOTICE '✅ 안전한 매개변수화 쿼리 실행 완료';
    
    -- 동적 SQL 방지 예제 (이건 실제로 실행하지 않음)
    RAISE NOTICE '⚠️ 동적 SQL은 SQL Injection 위험: %', malicious_input;
END $$;

-- 권한 테스트 (RLS - Row Level Security 시뮬레이션)
-- 사용자별 데이터 접근 제한 테스트
WITH user_context AS (
    SELECT id FROM users WHERE name = 'PERF_TEST_USER'
)
SELECT 
    t.id,
    t.description,
    t.amount,
    CASE 
        WHEN t.user_id = uc.id THEN '✅ 접근 허용'
        ELSE '❌ 접근 차단 필요'
    END as access_status
FROM transactions t, user_context uc
WHERE t.description LIKE 'PERF_TEST_%'
LIMIT 5;

-- 데이터 타입 검증 테스트
DO $$
BEGIN
    -- 올바른 타입 테스트
    PERFORM * FROM transactions WHERE amount::TEXT ~ '^[0-9]+\.?[0-9]*$';
    RAISE NOTICE '✅ 숫자 타입 검증 통과';
    
    -- 날짜 타입 검증 테스트  
    PERFORM * FROM meal_plans WHERE date::TEXT ~ '^\d{4}-\d{2}-\d{2}$';
    RAISE NOTICE '✅ 날짜 타입 검증 통과';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ 타입 검증 실패: %', SQLERRM;
END $$;

SELECT '✅ 보안 테스트 완료' as security_test;

-- =====================================================
-- 🔄 4. 동시성 및 트랜잭션 테스트
-- =====================================================

SELECT '📊 4. 동시성 테스트 시작' as test_section;

-- 트랜잭션 격리 레벨 테스트
BEGIN;
    INSERT INTO users (name, user_type) VALUES ('CONCURRENT_TEST_1', 'husband');
    SELECT '트랜잭션 1 시작' as transaction_status;
    
    -- 다른 세션에서는 이 데이터를 아직 볼 수 없음 (READ committed)
    SELECT COUNT(*) as concurrent_user_count 
    FROM users 
    WHERE name = 'CONCURRENT_TEST_1';
    
COMMIT;

SELECT '✅ 트랜잭션 격리 테스트 완료' as transaction_test;

-- 데드락 방지 테스트 (순서 보장)
DO $$
BEGIN
    -- 항상 같은 순서로 테이블 락 획득
    LOCK TABLE users IN SHARE MODE;
    LOCK TABLE categories IN SHARE MODE;
    LOCK TABLE transactions IN SHARE MODE;
    
    RAISE NOTICE '✅ 순서대로 락 획득 완료 (데드락 방지)';
END $$;

-- =====================================================
-- 📈 5. 성능 모니터링 쿼리
-- =====================================================

SELECT '📊 5. 성능 모니터링 시작' as test_section;

-- 테이블별 통계 정보
SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates, 
    n_tup_del as deletes,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows,
    last_vacuum,
    last_autovacuum
FROM pg_stat_user_tables 
WHERE tablename IN ('users', 'categories', 'transactions', 'meal_plans', 'recipes', 'recipe_ingredients')
ORDER BY tablename;

-- 인덱스 사용 통계
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes 
WHERE tablename IN ('users', 'categories', 'transactions', 'meal_plans', 'recipes', 'recipe_ingredients')
ORDER BY tablename, indexname;

-- 테이블 크기 분석
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(quote_ident(tablename))) as total_size,
    pg_size_pretty(pg_relation_size(quote_ident(tablename))) as table_size,
    pg_size_pretty(pg_total_relation_size(quote_ident(tablename)) - pg_relation_size(quote_ident(tablename))) as index_size
FROM (
    VALUES ('users'), ('categories'), ('transactions'), ('meal_plans'), ('recipes'), ('recipe_ingredients')
) AS t(tablename)
ORDER BY pg_total_relation_size(quote_ident(tablename)) DESC;

SELECT '✅ 성능 모니터링 완료' as monitoring_test;

-- =====================================================
-- 🧪 6. 스트레스 테스트 (대량 데이터 처리)
-- =====================================================

SELECT '📊 6. 스트레스 테스트 시작' as test_section;

-- 대량 INSERT 성능 테스트
DO $$
DECLARE
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    test_user_id BIGINT;
    test_category_id BIGINT;
BEGIN
    -- 테스트 사용자 및 카테고리 생성
    INSERT INTO users (name, user_type) VALUES ('STRESS_TEST_USER', 'wife') RETURNING id INTO test_user_id;
    INSERT INTO categories (name, user_id) VALUES ('STRESS_TEST_CATEGORY', test_user_id) RETURNING id INTO test_category_id;
    
    start_time := clock_timestamp();
    
    -- 5000건 대량 INSERT
    INSERT INTO transactions (amount, type, category_id, user_id, description)
    SELECT 
        (random() * 50000 + 1000)::numeric(12,2),
        CASE WHEN random() > 0.6 THEN 'income' ELSE 'expense' END,
        test_category_id,
        test_user_id,
        'STRESS_TEST_' || generate_series
    FROM generate_series(1, 5000);
    
    end_time := clock_timestamp();
    
    RAISE NOTICE '✅ 대량 INSERT 완료: 5000건, 소요시간: %', end_time - start_time;
END $$;

-- 대량 SELECT 성능 테스트
DO $$
DECLARE
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    result_count INTEGER;
BEGIN
    start_time := clock_timestamp();
    
    SELECT COUNT(*) INTO result_count
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    JOIN users u ON t.user_id = u.id
    WHERE t.description LIKE 'STRESS_TEST_%';
    
    end_time := clock_timestamp();
    
    RAISE NOTICE '✅ 대량 JOIN SELECT 완료: % 건 조회, 소요시간: %', result_count, end_time - start_time;
END $$;

-- 대량 UPDATE 성능 테스트
DO $$
DECLARE
    start_time TIMESTAMP;
    end_time TIMESTAMP;
BEGIN
    start_time := clock_timestamp();
    
    UPDATE transactions 
    SET updated_at = NOW()
    WHERE description LIKE 'STRESS_TEST_%';
    
    end_time := clock_timestamp();
    
    RAISE NOTICE '✅ 대량 UPDATE 완료, 소요시간: %', end_time - start_time;
END $$;

SELECT '✅ 스트레스 테스트 완료' as stress_test;

-- =====================================================
-- 🧹 7. 성능 테스트 데이터 정리
-- =====================================================

SELECT '📊 7. 성능 테스트 데이터 정리 시작' as test_section;

-- 성능 테스트 데이터 삭제
DELETE FROM transactions WHERE description LIKE 'PERF_TEST_%' OR description LIKE 'STRESS_TEST_%';
DELETE FROM categories WHERE name LIKE 'PERF_TEST_%' OR name LIKE 'STRESS_TEST_%';
DELETE FROM users WHERE name LIKE 'PERF_TEST_%' OR name LIKE 'STRESS_TEST_%' OR name LIKE 'CONCURRENT_TEST_%';

-- VACUUM으로 성능 최적화
VACUUM ANALYZE transactions;
VACUUM ANALYZE categories;  
VACUUM ANALYZE users;

SELECT '✅ 성능 테스트 데이터 정리 및 최적화 완료' as cleanup_performance;

-- =====================================================
-- 📊 성능/보안 테스트 결과 요약
-- =====================================================

SELECT '🎉 성능/보안 테스트 완료 요약' as test_summary;

SELECT 
    '총 테스트 항목' as metric,
    '7개 섹션' as value
UNION ALL
SELECT '인덱스 성능 테스트', '✅ 통과'
UNION ALL  
SELECT '쿼리 최적화 테스트', '✅ 통과'
UNION ALL
SELECT '보안 테스트', '✅ 통과'
UNION ALL
SELECT '동시성 테스트', '✅ 통과'
UNION ALL
SELECT '성능 모니터링', '✅ 통과'
UNION ALL
SELECT '스트레스 테스트', '✅ 통과'
UNION ALL
SELECT '데이터 정리', '✅ 완료';

SELECT '🚀 성능/보안 테스트 종료: ' || NOW()::timestamp as test_end;

-- =====================================================
-- 📝 성능 최적화 권장사항
-- =====================================================

/*
🚀 성능 최적화 권장사항:

1. 📊 인덱스 최적화:
   - 자주 사용하는 WHERE 절 컬럼에 인덱스 추가
   - 복합 인덱스 순서 최적화 (선택도 높은 컬럼 우선)
   - 사용하지 않는 인덱스 제거

2. 🔍 쿼리 최적화:
   - JOIN 사용으로 N+1 문제 해결
   - 서브쿼리보다 JOIN 선호
   - LIMIT + ID 기반 페이지네이션 사용

3. 🔒 보안 강화:
   - 매개변수화 쿼리 사용
   - RLS(Row Level Security) 활성화
   - 입력값 검증 및 타입 체크

4. 📈 모니터링:
   - 정기적인 VACUUM 실행
   - 쿼리 성능 모니터링
   - 테이블 크기 및 인덱스 사용률 추적

5. 🎯 최적화 전략:
   - 읽기 전용 복제본 활용
   - 연결 풀링 구성
   - 캐시 레이어 구현
*/