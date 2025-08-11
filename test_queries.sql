-- Test queries for budget app schema validation

-- 1. Test ENUM values
select 'Testing ENUM values' as test_description;
select enum_range(null::user_type) as user_type_values;
select enum_range(null::transaction_type) as transaction_type_values;

-- 2. Test basic table queries
select 'Testing table structure and data' as test_description;

-- Check users table
select 'Users count:' as info, count(*) as count from users;
select * from users limit 5;

-- Check categories with user info
select 'Categories with users:' as info;
select c.name, c.icon, c.color, u.name as user_name, u.user_type
from categories c
join users u on c.user_id = u.id
limit 10;

-- Check transactions with category and user info
select 'Recent transactions:' as info;
select 
    t.amount,
    t.type,
    t.description,
    c.name as category_name,
    u.name as user_name,
    u.user_type,
    t.created_at
from transactions t
left join categories c on t.category_id = c.id
join users u on t.user_id = u.id
order by t.created_at desc
limit 10;

-- 3. Test performance queries (using indexes)
select 'Testing query performance with indexes' as test_description;

-- Query by user type (should use idx_users_user_type)
explain (analyze, buffers) 
select * from users where user_type = 'husband';

-- Query transactions by user and date range (should use idx_transactions_user_type_date)
explain (analyze, buffers)
select t.amount, t.type, t.description, t.created_at
from transactions t
where t.user_id = 1 
and t.created_at >= '2024-01-01'
order by t.created_at desc;

-- Query transactions by category (should use idx_transactions_category_id)
explain (analyze, buffers)
select sum(amount) as total_spent
from transactions
where category_id = 1 and type = 'expense';

-- 4. Test aggregation queries for budget app functionality
select 'Testing budget app specific queries' as test_description;

-- Monthly expense summary by user
select 
    u.name as user_name,
    u.user_type,
    sum(case when t.type = 'income' then t.amount else 0 end) as total_income,
    sum(case when t.type = 'expense' then t.amount else 0 end) as total_expense,
    sum(case when t.type = 'income' then t.amount else -t.amount end) as net_amount
from users u
left join transactions t on u.id = t.user_id
group by u.id, u.name, u.user_type
order by u.user_type;

-- Category spending analysis
select 
    c.name as category_name,
    c.icon,
    u.name as user_name,
    count(t.id) as transaction_count,
    sum(t.amount) as total_spent,
    avg(t.amount) as avg_amount
from categories c
left join transactions t on c.id = t.category_id and t.type = 'expense'
join users u on c.user_id = u.id
group by c.id, c.name, c.icon, u.name
having count(t.id) > 0
order by total_spent desc;

-- 5. Test grocery and meal planning queries
select 'Testing grocery and meal planning functionality' as test_description;

-- Grocery list (items not stocked)
select 'Items to buy:' as info;
select name, quantity, is_stocked
from grocery_items
where is_stocked = false
order by name;

-- Current week meal plan
select 'Weekly meal plan:' as info;
select date, breakfast, lunch, dinner
from meal_plans
order by date
limit 7;

-- Recipes with ingredient count
select 'Recipes overview:' as info;
select 
    r.title,
    r.description,
    count(ri.id) as ingredient_count
from recipes r
left join recipe_ingredients ri on r.id = ri.recipe_id
group by r.id, r.title, r.description
order by ingredient_count desc;

-- Recipe details with ingredients
select 'Recipe details:' as info;
select 
    r.title as recipe,
    ri.ingredient,
    ri.quantity,
    ri.unit
from recipes r
join recipe_ingredients ri on r.id = ri.recipe_id
where r.title = '김치찌개'
order by ri.id;

-- 6. Test data integrity constraints
select 'Testing data integrity' as test_description;

-- Test foreign key relationships
select 'Orphaned transactions check:' as info, count(*) as count
from transactions t
left join users u on t.user_id = u.id
where u.id is null;

select 'Categories without users check:' as info, count(*) as count
from categories c
left join users u on c.user_id = u.id
where u.id is null;

-- Test ENUM constraints (these should work)
select 'Valid ENUM insertion test' as info;
-- This would work: insert into users (name, user_type) values ('Test', 'husband');

-- 7. Test updated_at triggers
select 'Testing updated_at triggers' as test_description;

-- Show current updated_at for a category
select name, created_at, updated_at from categories where id = 1;

-- Update the category (this should trigger updated_at)
-- update categories set name = 'Updated 식비' where id = 1;
-- select name, created_at, updated_at from categories where id = 1;

select 'Schema validation complete!' as result;