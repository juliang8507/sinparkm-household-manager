-- Create ENUM types
create type user_type as enum ('husband', 'wife');
create type transaction_type as enum ('income', 'expense');

-- Create users table
create table users (
    id bigint generated always as identity primary key,
    name text not null,
    user_type user_type not null,
    created_at timestamptz default now() not null
);

-- Create categories table
create table categories (
    id bigint generated always as identity primary key,
    name text not null,
    icon text,
    color text,
    user_id bigint references users(id) on delete cascade not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Create transactions table
create table transactions (
    id bigint generated always as identity primary key,
    amount numeric(12,2) not null,
    type transaction_type not null,
    category_id bigint references categories(id) on delete set null,
    user_id bigint references users(id) on delete cascade not null,
    description text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Create grocery_items table
create table grocery_items (
    id bigint generated always as identity primary key,
    name text not null,
    quantity integer default 1,
    is_stocked boolean default false,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Create meal_plans table
create table meal_plans (
    id bigint generated always as identity primary key,
    date date not null unique,
    breakfast text,
    lunch text,
    dinner text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Create recipes table
create table recipes (
    id bigint generated always as identity primary key,
    title text not null,
    description text,
    instructions text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Create recipe_ingredients table
create table recipe_ingredients (
    id bigint generated always as identity primary key,
    recipe_id bigint references recipes(id) on delete cascade not null,
    ingredient text not null,
    quantity text,
    unit text,
    created_at timestamptz default now() not null
);

-- Create update triggers for updated_at columns
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Apply triggers to tables with updated_at
create trigger update_categories_updated_at before update on categories
    for each row execute function update_updated_at_column();

create trigger update_transactions_updated_at before update on transactions
    for each row execute function update_updated_at_column();

create trigger update_grocery_items_updated_at before update on grocery_items
    for each row execute function update_updated_at_column();

create trigger update_meal_plans_updated_at before update on meal_plans
    for each row execute function update_updated_at_column();

create trigger update_recipes_updated_at before update on recipes
    for each row execute function update_updated_at_column();

-- Create indexes for query performance optimization
-- Users table indexes
create index idx_users_user_type on users(user_type);

-- Categories table indexes
create index idx_categories_user_id on categories(user_id);
create index idx_categories_name on categories(name);

-- Transactions table indexes (most critical for performance)
create index idx_transactions_user_id on transactions(user_id);
create index idx_transactions_category_id on transactions(category_id);
create index idx_transactions_type on transactions(type);
create index idx_transactions_created_at on transactions(created_at);
create index idx_transactions_user_type_date on transactions(user_id, created_at);

-- Grocery items table indexes
create index idx_grocery_items_is_stocked on grocery_items(is_stocked);
create index idx_grocery_items_name on grocery_items(name);

-- Meal plans table indexes
create index idx_meal_plans_date on meal_plans(date);

-- Recipes table indexes
create index idx_recipes_title on recipes(title);

-- Recipe ingredients table indexes
create index idx_recipe_ingredients_recipe_id on recipe_ingredients(recipe_id);
create index idx_recipe_ingredients_ingredient on recipe_ingredients(ingredient);

-- Insert sample data for testing
-- Insert users (husband and wife)
insert into users (name, user_type) values
('김철수', 'husband'),
('김영희', 'wife');

-- Insert categories for both users
insert into categories (name, icon, color, user_id) values
-- Husband categories
('식비', '🍽️', '#FF6B6B', 1),
('교통비', '🚗', '#4ECDC4', 1),
('생활용품', '🏠', '#45B7D1', 1),
('의료비', '💊', '#96CEB4', 1),
('여가/오락', '🎮', '#FFEAA7', 1),
-- Wife categories
('쇼핑', '🛍️', '#DDA0DD', 2),
('미용', '💄', '#FFB6C1', 2),
('교육', '📚', '#98D8C8', 2),
('카페', '☕', '#F7DC6F', 2),
('건강', '🏋️', '#AED6F1', 2);

-- Insert sample transactions
insert into transactions (amount, type, category_id, user_id, description) values
-- Husband transactions
(50000, 'expense', 1, 1, '마트에서 장보기'),
(15000, 'expense', 2, 1, '지하철 교통카드 충전'),
(25000, 'expense', 3, 1, '화장지, 세제 구매'),
(80000, 'expense', 4, 1, '병원 진료비'),
(30000, 'expense', 5, 1, '영화관람'),
(3500000, 'income', null, 1, '월급'),
-- Wife transactions
(120000, 'expense', 6, 2, '옷 쇼핑'),
(45000, 'expense', 7, 2, '미용실'),
(85000, 'expense', 8, 2, '온라인 강의'),
(12000, 'expense', 9, 2, '카페에서 커피'),
(35000, 'expense', 10, 2, '헬스장 이용료'),
(2800000, 'income', null, 2, '월급');

-- Insert grocery items
insert into grocery_items (name, quantity, is_stocked) values
('쌀', 1, true),
('우유', 2, false),
('계란', 1, true),
('양파', 3, false),
('당근', 5, true),
('닭가슴살', 2, false),
('김치', 1, true),
('라면', 4, false);

-- Insert meal plans
insert into meal_plans (date, breakfast, lunch, dinner) values
('2024-01-15', '토스트와 우유', '김치찌개', '치킨볶음밥'),
('2024-01-16', '시리얼', '불고기', '파스타'),
('2024-01-17', '계란후라이', '된장찌개', '삼겹살'),
('2024-01-18', '샌드위치', '비빔밥', '생선구이'),
('2024-01-19', '죽', '라면', '치킨'),
('2024-01-20', '토스트', '카레라이스', '냉면'),
('2024-01-21', '요거트', '김밥', '한식정식');

-- Insert recipes
insert into recipes (title, description, instructions) values
('김치찌개', '맛있는 김치찌개 만들기', '1. 김치를 기름에 볶는다 2. 물을 넣고 끓인다 3. 두부와 돼지고기를 넣는다'),
('치킨볶음밥', '간단한 치킨볶음밥', '1. 밥을 준비한다 2. 치킨을 볶는다 3. 밥과 함께 볶는다'),
('불고기', '한국식 불고기', '1. 소고기를 양념에 재운다 2. 팬에 구워낸다'),
('파스타', '토마토 파스타', '1. 면을 삶는다 2. 토마토소스를 만든다 3. 면과 소스를 섞는다'),
('된장찌개', '집밥 된장찌개', '1. 된장을 푼다 2. 야채를 넣고 끓인다'),
('비빔밥', '영양 비빔밥', '1. 나물을 준비한다 2. 밥 위에 올린다 3. 고추장을 넣고 비빈다');

-- Insert recipe ingredients
insert into recipe_ingredients (recipe_id, ingredient, quantity, unit) values
-- 김치찌개 ingredients
(1, '김치', '200', 'g'),
(1, '두부', '1', '모'),
(1, '돼지고기', '150', 'g'),
(1, '대파', '1', '대'),
-- 치킨볶음밥 ingredients
(2, '밥', '2', '공기'),
(2, '치킨', '200', 'g'),
(2, '계란', '2', '개'),
(2, '당근', '1', '개'),
-- 불고기 ingredients
(3, '소고기', '300', 'g'),
(3, '양파', '1', '개'),
(3, '간장', '3', '큰술'),
(3, '설탕', '1', '큰술'),
-- 파스타 ingredients
(4, '스파게티면', '200', 'g'),
(4, '토마토소스', '1', '캔'),
(4, '마늘', '3', '쪽'),
-- 된장찌개 ingredients
(5, '된장', '2', '큰술'),
(5, '감자', '1', '개'),
(5, '호박', '1/2', '개'),
-- 비빔밥 ingredients
(6, '밥', '2', '공기'),
(6, '나물', '5', '종류'),
(6, '고추장', '2', '큰술'),
(6, '참기름', '1', '큰술');