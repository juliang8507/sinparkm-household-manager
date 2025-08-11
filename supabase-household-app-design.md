# Supabase 기반 부부 공유 가계부+식단표+냉장고 웹앱 설계서

## 🎯 프로젝트 개요 (최종 버전)

### 핵심 특징
- **인증 없는 단순 모델**: 로그인/회원가입 불필요
- **Supabase PostgreSQL**: 관계형 DB의 장점 + 실시간 구독
- **부부 전용**: 둘만 사용하는 프라이빗 앱
- **극단적 단순함**: 복잡한 권한 시스템 없이 바로 사용

### 사용자 모델
- **사용자 구분**: "남편" / "아내" 단순 선택
- **localStorage 저장**: 선택한 사용자 타입 로컬 저장
- **언제든 전환 가능**: 사용자 전환 버튼으로 역할 바꾸기

## 🏗️ 기술 스택

### 핵심 기술
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript ES6+
- **UI**: Bootstrap 5 + Font Awesome
- **Database**: Supabase PostgreSQL + 실시간 구독
- **API**: Supabase REST API + JavaScript SDK
- **Hosting**: Netlify (정적 사이트)
- **PWA**: Service Worker + Web App Manifest

### Supabase 활용 기능
- **데이터베이스**: PostgreSQL (관계형)
- **실시간 구독**: postgres_changes 이벤트
- **REST API**: 자동 생성 API
- **스토리지**: 레시피 이미지 (선택사항)

## 🗃️ 데이터베이스 스키마

### PostgreSQL 테이블 설계

```sql
-- 사용자 타입 (enum)
CREATE TYPE user_type AS ENUM ('husband', 'wife');

-- 카테고리
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('income', 'expense')) NOT NULL,
  color VARCHAR(7) DEFAULT '#007bff',
  is_grocery BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 거래 내역
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(12,2) NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE RESTRICT,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  is_grocery BOOLEAN DEFAULT FALSE,
  created_by user_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 식료품 구매 아이템
CREATE TABLE grocery_items (
  id SERIAL PRIMARY KEY,
  transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
  ingredient VARCHAR(100) NOT NULL,
  quantity DECIMAL(8,2) NOT NULL CHECK (quantity > 0),
  unit VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 냉장고 재고
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  ingredient VARCHAR(100) NOT NULL,
  quantity DECIMAL(8,2) NOT NULL CHECK (quantity >= 0),
  unit VARCHAR(20) NOT NULL,
  expiry_date DATE,
  purchase_date DATE,
  transaction_id INTEGER REFERENCES transactions(id) ON DELETE SET NULL,
  created_by user_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 같은 재료는 하나의 레코드로 통합 관리
  UNIQUE(ingredient, unit)
);

-- 레시피
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  servings INTEGER DEFAULT 1 CHECK (servings > 0),
  prep_time INTEGER CHECK (prep_time >= 0), -- 준비시간(분)
  cook_time INTEGER CHECK (cook_time >= 0), -- 조리시간(분)
  instructions TEXT[], -- PostgreSQL 배열 타입
  image_url TEXT,
  created_by user_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 레시피 재료
CREATE TABLE recipe_ingredients (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient VARCHAR(100) NOT NULL,
  quantity DECIMAL(8,2) NOT NULL CHECK (quantity > 0),
  unit VARCHAR(20) NOT NULL,
  is_optional BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 식단 계획
CREATE TABLE meal_plans (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) NOT NULL,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  servings INTEGER DEFAULT 1 CHECK (servings > 0),
  is_cooked BOOLEAN DEFAULT FALSE,
  cooked_at TIMESTAMP WITH TIME ZONE,
  cooked_by user_type,
  notes TEXT, -- 요리 후 메모
  created_by user_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 같은 날, 같은 식사에는 하나의 레시피만
  UNIQUE(date, meal_type)
);

-- 업데이트 시간 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 설정
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON meal_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 초기 데이터 설정

```sql
-- 기본 카테고리 삽입
INSERT INTO categories (name, type, color, is_grocery) VALUES 
('식료품', 'expense', '#28a745', true),
('외식', 'expense', '#ffc107', false),
('생활용품', 'expense', '#17a2b8', false),
('교통비', 'expense', '#6f42c1', false),
('급여', 'income', '#20c997', false),
('용돈', 'income', '#fd7e14', false);

-- 샘플 레시피
INSERT INTO recipes (name, description, servings, prep_time, cook_time, instructions, created_by) VALUES 
('김치찌개', '집에서 쉽게 만드는 김치찌개', 2, 10, 20, 
 ARRAY['김치와 돼지고기를 썰어 준비한다', '팬에 기름을 두르고 돼지고기를 볶는다', '김치를 넣고 함께 볶는다', '물을 넣고 끓인다'], 
 'wife'),
('된장찌개', '구수한 된장찌개', 2, 5, 15,
 ARRAY['된장을 풀어 준비한다', '감자, 양파를 썬다', '물에 된장을 풀고 야채를 넣어 끓인다'],
 'husband');

-- 샘플 레시피 재료
INSERT INTO recipe_ingredients (recipe_id, ingredient, quantity, unit) VALUES 
(1, '김치', 200, 'g'),
(1, '돼지고기', 150, 'g'),
(1, '양파', 0.5, '개'),
(2, '된장', 2, '큰술'),
(2, '감자', 1, '개'),
(2, '양파', 0.5, '개');
```

## 🏛️ 애플리케이션 아키텍처

### 프로젝트 구조

```
supabase-household-app/
├── index.html
├── netlify.toml
├── .env.example
├── css/
│   ├── bootstrap.min.css
│   ├── app.css
│   └── components.css
├── js/
│   ├── app.js              # 메인 앱 클래스
│   ├── supabase-config.js  # Supabase 설정
│   ├── user-manager.js     # 사용자 선택 관리
│   ├── router.js           # 클라이언트 라우팅
│   ├── components/
│   │   ├── UserSelector.js      # 사용자 선택 모달
│   │   ├── Dashboard.js
│   │   ├── Budget.js
│   │   ├── MealPlan.js
│   │   ├── Inventory.js
│   │   ├── Recipes.js
│   │   └── common/
│   │       ├── Modal.js
│   │       ├── Toast.js         # 알림
│   │       └── RealTimeSync.js  # 실시간 동기화
│   ├── services/
│   │   ├── SupabaseService.js   # Supabase API 래퍼
│   │   ├── TransactionService.js # 거래 관련 비즈니스 로직
│   │   ├── InventoryService.js   # 재고 관련 비즈니스 로직
│   │   └── MealPlanService.js    # 식단 관련 비즈니스 로직
│   └── utils/
│       ├── DateUtils.js
│       ├── CurrencyUtils.js
│       └── ValidationUtils.js
├── assets/
│   ├── icons/
│   ├── images/
│   └── manifest.json
└── sw.js
```

### Supabase 설정

```javascript
// js/supabase-config.js
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2';

const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // 인증 없으므로 세션 유지 불필요
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // 실시간 이벤트 제한
    },
  },
});

export default supabase;
```

### 사용자 관리 시스템

```javascript
// js/user-manager.js
class UserManager {
  constructor() {
    this.currentUser = this.getCurrentUser();
  }
  
  getCurrentUser() {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser || null;
  }
  
  setCurrentUser(userType) {
    if (!['husband', 'wife'].includes(userType)) {
      throw new Error('Invalid user type');
    }
    
    localStorage.setItem('currentUser', userType);
    this.currentUser = userType;
    
    // 전역 이벤트 발생
    window.dispatchEvent(new CustomEvent('userChanged', {
      detail: { userType }
    }));
  }
  
  getUserDisplayName() {
    return this.currentUser === 'husband' ? '남편' : '아내';
  }
  
  getPartnerDisplayName() {
    return this.currentUser === 'husband' ? '아내' : '남편';
  }
  
  switchUser() {
    const newUser = this.currentUser === 'husband' ? 'wife' : 'husband';
    this.setCurrentUser(newUser);
  }
  
  needsUserSelection() {
    return !this.currentUser;
  }
}

export default UserManager;
```

### 사용자 선택 모달

```javascript
// js/components/UserSelector.js
class UserSelector {
  constructor(onUserSelected) {
    this.onUserSelected = onUserSelected;
  }
  
  show() {
    const modal = document.createElement('div');
    modal.className = 'modal fade show d-block';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 text-center">
            <div class="w-100">
              <h4 class="modal-title">🏠 우리집 관리</h4>
              <p class="text-muted">사용자를 선택해주세요</p>
            </div>
          </div>
          <div class="modal-body text-center">
            <div class="row g-3">
              <div class="col-6">
                <button class="btn btn-primary btn-lg w-100 h-100 user-select-btn" 
                        data-user="husband"
                        style="min-height: 100px;">
                  <i class="fas fa-user fa-2x d-block mb-2"></i>
                  <span>남편</span>
                </button>
              </div>
              <div class="col-6">
                <button class="btn btn-success btn-lg w-100 h-100 user-select-btn" 
                        data-user="wife"
                        style="min-height: 100px;">
                  <i class="fas fa-user fa-2x d-block mb-2"></i>
                  <span>아내</span>
                </button>
              </div>
            </div>
            <p class="text-muted mt-3 small">
              언제든지 상단 메뉴에서 사용자를 바꿀 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // 버튼 클릭 이벤트
    modal.querySelectorAll('.user-select-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const userType = e.currentTarget.dataset.user;
        this.selectUser(userType);
        modal.remove();
      });
    });
  }
  
  selectUser(userType) {
    this.onUserSelected(userType);
  }
}

export default UserSelector;
```

## 📡 Supabase API 연동

### 기본 서비스 클래스

```javascript
// js/services/SupabaseService.js
import supabase from '../supabase-config.js';

class SupabaseService {
  constructor() {
    this.supabase = supabase;
  }
  
  // 거래 내역 관련
  async getTransactions(limit = 50) {
    const { data, error } = await this.supabase
      .from('transactions')
      .select(`
        *,
        category:categories(name, color, type),
        grocery_items(*)
      `)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    return data;
  }
  
  async addTransaction(transaction) {
    const { data, error } = await this.supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
  
  // 식료품 아이템 추가
  async addGroceryItems(transactionId, items) {
    const groceryItems = items.map(item => ({
      transaction_id: transactionId,
      ...item
    }));
    
    const { data, error } = await this.supabase
      .from('grocery_items')
      .insert(groceryItems)
      .select();
      
    if (error) throw error;
    return data;
  }
  
  // 냉장고 재고 관련
  async getInventory() {
    const { data, error } = await this.supabase
      .from('inventory')
      .select('*')
      .order('expiry_date', { ascending: true, nullsLast: true })
      .order('ingredient', { ascending: true });
      
    if (error) throw error;
    return data;
  }
  
  async updateInventory(ingredient, unit, changes) {
    const { data, error } = await this.supabase
      .from('inventory')
      .upsert({
        ingredient,
        unit,
        ...changes,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
  
  // 레시피 관련
  async getRecipes() {
    const { data, error } = await this.supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients(*)
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  }
  
  async addRecipe(recipe, ingredients) {
    // 트랜잭션 시뮬레이션 (Supabase는 아직 공식 트랜잭션 지원 안함)
    const { data: recipeData, error: recipeError } = await this.supabase
      .from('recipes')
      .insert(recipe)
      .select()
      .single();
      
    if (recipeError) throw recipeError;
    
    if (ingredients && ingredients.length > 0) {
      const recipeIngredients = ingredients.map(ing => ({
        recipe_id: recipeData.id,
        ...ing
      }));
      
      const { error: ingredientsError } = await this.supabase
        .from('recipe_ingredients')
        .insert(recipeIngredients);
        
      if (ingredientsError) {
        // 레시피 롤백
        await this.supabase.from('recipes').delete().eq('id', recipeData.id);
        throw ingredientsError;
      }
    }
    
    return recipeData;
  }
  
  // 식단 계획 관련
  async getMealPlans(startDate, endDate) {
    const { data, error } = await this.supabase
      .from('meal_plans')
      .select(`
        *,
        recipe:recipes(name, prep_time, cook_time, image_url)
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })
      .order('meal_type', { ascending: true });
      
    if (error) throw error;
    return data;
  }
  
  async cookMeal(mealPlanId, cookedBy) {
    const { data, error } = await this.supabase
      .from('meal_plans')
      .update({
        is_cooked: true,
        cooked_at: new Date().toISOString(),
        cooked_by: cookedBy
      })
      .eq('id', mealPlanId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
}

export default SupabaseService;
```

## 🔄 실시간 동기화

### 실시간 구독 시스템

```javascript
// js/common/RealTimeSync.js
import supabase from '../supabase-config.js';

class RealTimeSync {
  constructor(userManager) {
    this.userManager = userManager;
    this.channels = new Map();
    this.isConnected = false;
  }
  
  // 실시간 구독 시작
  startSync() {
    this.subscribeToTransactions();
    this.subscribeToInventory();
    this.subscribeToMealPlans();
    this.subscribeToRecipes();
    
    this.isConnected = true;
    this.updateConnectionStatus();
  }
  
  // 거래 내역 실시간 구독
  subscribeToTransactions() {
    const channel = supabase
      .channel('transactions-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions' 
        }, 
        (payload) => {
          this.handleTransactionChange(payload);
        }
      )
      .subscribe();
      
    this.channels.set('transactions', channel);
  }
  
  // 재고 실시간 구독
  subscribeToInventory() {
    const channel = supabase
      .channel('inventory-changes')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory'
        },
        (payload) => {
          this.handleInventoryChange(payload);
        }
      )
      .subscribe();
      
    this.channels.set('inventory', channel);
  }
  
  // 식단 실시간 구독
  subscribeToMealPlans() {
    const channel = supabase
      .channel('meal-plans-changes')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meal_plans'
        },
        (payload) => {
          this.handleMealPlanChange(payload);
        }
      )
      .subscribe();
      
    this.channels.set('meal_plans', channel);
  }
  
  // 레시피 실시간 구독
  subscribeToRecipes() {
    const channel = supabase
      .channel('recipes-changes')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recipes'
        },
        (payload) => {
          this.handleRecipeChange(payload);
        }
      )
      .subscribe();
      
    this.channels.set('recipes', channel);
  }
  
  // 거래 변경 처리
  handleTransactionChange(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    const isOtherUser = newRecord?.created_by !== this.userManager.currentUser;
    
    if (isOtherUser) {
      const partnerName = this.userManager.getPartnerDisplayName();
      
      switch (eventType) {
        case 'INSERT':
          this.showToast(`${partnerName}님이 새 거래를 추가했습니다: ${newRecord.description}`, 'success');
          break;
        case 'UPDATE':
          this.showToast(`${partnerName}님이 거래를 수정했습니다: ${newRecord.description}`, 'info');
          break;
        case 'DELETE':
          this.showToast(`${partnerName}님이 거래를 삭제했습니다`, 'warning');
          break;
      }
    }
    
    // 전역 이벤트 발생 (UI 업데이트용)
    window.dispatchEvent(new CustomEvent('transactionChanged', {
      detail: { eventType, newRecord, oldRecord }
    }));
  }
  
  // 재고 변경 처리
  handleInventoryChange(payload) {
    const { eventType, new: newRecord } = payload;
    const isOtherUser = newRecord?.created_by !== this.userManager.currentUser;
    
    if (isOtherUser) {
      const partnerName = this.userManager.getPartnerDisplayName();
      
      switch (eventType) {
        case 'INSERT':
          this.showToast(`${partnerName}님이 냉장고에 ${newRecord.ingredient}을(를) 추가했습니다`, 'success');
          break;
        case 'UPDATE':
          this.showToast(`${partnerName}님이 ${newRecord.ingredient} 재고를 업데이트했습니다`, 'info');
          break;
      }
    }
    
    window.dispatchEvent(new CustomEvent('inventoryChanged', {
      detail: { eventType, newRecord }
    }));
  }
  
  // 식단 변경 처리
  handleMealPlanChange(payload) {
    const { eventType, new: newRecord } = payload;
    
    if (eventType === 'UPDATE' && newRecord.is_cooked && newRecord.cooked_by !== this.userManager.currentUser) {
      const partnerName = this.userManager.getPartnerDisplayName();
      this.showToast(`${partnerName}님이 요리를 완료했습니다!`, 'success');
    }
    
    window.dispatchEvent(new CustomEvent('mealPlanChanged', {
      detail: { eventType, newRecord }
    }));
  }
  
  // 레시피 변경 처리
  handleRecipeChange(payload) {
    const { eventType, new: newRecord } = payload;
    const isOtherUser = newRecord?.created_by !== this.userManager.currentUser;
    
    if (isOtherUser && eventType === 'INSERT') {
      const partnerName = this.userManager.getPartnerDisplayName();
      this.showToast(`${partnerName}님이 새 레시피를 추가했습니다: ${newRecord.name}`, 'success');
    }
    
    window.dispatchEvent(new CustomEvent('recipeChanged', {
      detail: { eventType, newRecord }
    }));
  }
  
  // 토스트 알림 표시
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast show position-fixed top-0 end-0 m-3 border-${type}`;
    toast.style.zIndex = '1055';
    toast.innerHTML = `
      <div class="toast-header">
        <i class="fas fa-sync-alt text-${type} me-2"></i>
        <strong class="me-auto">실시간 알림</strong>
        <small class="text-muted">${new Date().toLocaleTimeString()}</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // 5초 후 자동 제거
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 5000);
  }
  
  // 연결 상태 표시
  updateConnectionStatus() {
    const statusElement = document.getElementById('connection-status');
    if (statusElement) {
      statusElement.innerHTML = this.isConnected 
        ? '<i class="fas fa-wifi text-success"></i> 연결됨'
        : '<i class="fas fa-wifi text-danger"></i> 연결 끊김';
    }
  }
  
  // 구독 정리
  cleanup() {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
    this.isConnected = false;
    this.updateConnectionStatus();
  }
}

export default RealTimeSync;
```

## 🔗 통합 비즈니스 로직

### 구매 → 재고 자동 추가

```javascript
// js/services/TransactionService.js
import SupabaseService from './SupabaseService.js';

class TransactionService extends SupabaseService {
  async processPurchase(transactionData, currentUser) {
    try {
      // 1. 거래 저장
      const transaction = await this.addTransaction({
        ...transactionData,
        created_by: currentUser
      });
      
      // 2. 식료품인 경우 재고 자동 추가
      if (transactionData.is_grocery && transactionData.grocery_items) {
        // 식료품 아이템 저장
        await this.addGroceryItems(transaction.id, transactionData.grocery_items);
        
        // 냉장고 재고 업데이트
        for (const item of transactionData.grocery_items) {
          await this.updateOrAddInventory({
            ingredient: item.ingredient,
            unit: item.unit,
            quantity: item.quantity,
            purchase_date: transactionData.date,
            transaction_id: transaction.id,
            created_by: currentUser,
            expiry_date: this.calculateExpiryDate(item.ingredient, transactionData.date)
          });
        }
      }
      
      return transaction;
    } catch (error) {
      console.error('구매 처리 중 오류:', error);
      throw error;
    }
  }
  
  async updateOrAddInventory(inventoryData) {
    // 같은 재료가 이미 있는지 확인
    const { data: existing } = await this.supabase
      .from('inventory')
      .select('*')
      .eq('ingredient', inventoryData.ingredient)
      .eq('unit', inventoryData.unit)
      .single();
    
    if (existing) {
      // 기존 재고에 추가
      const newQuantity = parseFloat(existing.quantity) + parseFloat(inventoryData.quantity);
      const newExpiryDate = inventoryData.expiry_date && 
        (!existing.expiry_date || new Date(inventoryData.expiry_date) < new Date(existing.expiry_date))
        ? inventoryData.expiry_date 
        : existing.expiry_date;
      
      await this.updateInventory(inventoryData.ingredient, inventoryData.unit, {
        quantity: newQuantity,
        expiry_date: newExpiryDate,
        purchase_date: inventoryData.purchase_date,
        transaction_id: inventoryData.transaction_id,
        created_by: inventoryData.created_by
      });
    } else {
      // 새 재고 추가
      await this.supabase
        .from('inventory')
        .insert(inventoryData);
    }
  }
  
  // 재료별 예상 유통기한 계산
  calculateExpiryDate(ingredient, purchaseDate) {
    const purchase = new Date(purchaseDate);
    const daysToAdd = this.getIngredientShelfLife(ingredient);
    
    if (daysToAdd > 0) {
      purchase.setDate(purchase.getDate() + daysToAdd);
      return purchase.toISOString().split('T')[0];
    }
    
    return null;
  }
  
  getIngredientShelfLife(ingredient) {
    const shelfLifeMap = {
      '우유': 5,
      '달걀': 14,
      '양파': 21,
      '감자': 30,
      '당근': 14,
      '배추': 7,
      '김치': 30,
      '돼지고기': 3,
      '닭고기': 2,
      '쇠고기': 3,
      '생선': 1,
      '두부': 5,
      '요구르트': 7
    };
    
    return shelfLifeMap[ingredient] || 0;
  }
}

export default TransactionService;
```

### 요리 → 재고 차감

```javascript
// js/services/MealPlanService.js
import SupabaseService from './SupabaseService.js';

class MealPlanService extends SupabaseService {
  async cookMeal(mealPlanId, currentUser) {
    try {
      // 1. 식단 정보와 레시피 가져오기
      const { data: mealPlan, error: mealError } = await this.supabase
        .from('meal_plans')
        .select(`
          *,
          recipe:recipes(
            *,
            recipe_ingredients(*)
          )
        `)
        .eq('id', mealPlanId)
        .single();
        
      if (mealError) throw mealError;
      
      // 2. 재고 확인
      const canCook = await this.checkIngredientsAvailability(
        mealPlan.recipe.recipe_ingredients, 
        mealPlan.servings
      );
      
      if (!canCook.available) {
        return {
          success: false,
          message: `재료가 부족합니다: ${canCook.missing.join(', ')}`,
          missing: canCook.missing
        };
      }
      
      // 3. 재고 차감
      await this.deductIngredients(mealPlan.recipe.recipe_ingredients, mealPlan.servings);
      
      // 4. 요리 완료 상태 업데이트
      await this.cookMeal(mealPlanId, currentUser);
      
      return {
        success: true,
        message: `${mealPlan.recipe.name} 요리가 완료되었습니다!`
      };
      
    } catch (error) {
      console.error('요리 처리 중 오류:', error);
      return {
        success: false,
        message: '요리 처리 중 오류가 발생했습니다.',
        error: error.message
      };
    }
  }
  
  async checkIngredientsAvailability(recipeIngredients, servings) {
    const missing = [];
    
    for (const ingredient of recipeIngredients) {
      const requiredQuantity = parseFloat(ingredient.quantity) * servings;
      
      const { data: inventoryItem } = await this.supabase
        .from('inventory')
        .select('quantity')
        .eq('ingredient', ingredient.ingredient)
        .eq('unit', ingredient.unit)
        .gte('quantity', requiredQuantity)
        .single();
      
      if (!inventoryItem) {
        missing.push(`${ingredient.ingredient} ${requiredQuantity}${ingredient.unit}`);
      }
    }
    
    return {
      available: missing.length === 0,
      missing
    };
  }
  
  async deductIngredients(recipeIngredients, servings) {
    for (const ingredient of recipeIngredients) {
      const requiredQuantity = parseFloat(ingredient.quantity) * servings;
      
      // 현재 재고 조회
      const { data: inventoryItem } = await this.supabase
        .from('inventory')
        .select('*')
        .eq('ingredient', ingredient.ingredient)
        .eq('unit', ingredient.unit)
        .single();
      
      if (inventoryItem) {
        const newQuantity = parseFloat(inventoryItem.quantity) - requiredQuantity;
        
        if (newQuantity <= 0) {
          // 재고 삭제
          await this.supabase
            .from('inventory')
            .delete()
            .eq('id', inventoryItem.id);
        } else {
          // 재고 차감
          await this.supabase
            .from('inventory')
            .update({ 
              quantity: newQuantity,
              updated_at: new Date().toISOString()
            })
            .eq('id', inventoryItem.id);
        }
      }
    }
  }
}

export default MealPlanService;
```

## 🚀 배포 및 환경 설정

### Netlify 배포 설정

```toml
# netlify.toml
[build]
  publish = "."
  
[build.environment]
  NODE_VERSION = "18"
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# 환경 변수는 Netlify 대시보드에서 설정
# SUPABASE_URL
# SUPABASE_ANON_KEY
```

```javascript
// .env.example
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Row Level Security 설정 (선택사항)

```sql
-- RLS를 사용하지 않으므로 모든 테이블에서 비활성화
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE recipes DISABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients DISABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans DISABLE ROW LEVEL SECURITY;

-- 또는 필요하다면 간단한 RLS 정책 (보안 강화)
-- ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all operations" ON transactions FOR ALL USING (true);
```

## 📱 모바일 최적화

### 터치 친화적 UI

```css
/* css/components.css - 모바일 최적화 */

/* 터치 타겟 최소 크기 */
.btn, .nav-link, .list-group-item {
  min-height: 44px;
  display: flex;
  align-items: center;
}

/* 스와이프 제스처 */
.swipeable {
  position: relative;
  overflow: hidden;
}

.swipe-actions {
  position: absolute;
  top: 0;
  right: -100px;
  bottom: 0;
  width: 100px;
  background: #dc3545;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: right 0.3s ease;
}

.swipeable.swiped .swipe-actions {
  right: 0;
}

/* 바텀 네비게이션 (모바일) */
@media (max-width: 768px) {
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid #dee2e6;
    display: flex;
    z-index: 1000;
    height: 60px;
  }
  
  .bottom-nav .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: #6c757d;
    font-size: 0.75rem;
  }
  
  .bottom-nav .nav-item.active {
    color: #007bff;
  }
  
  .bottom-nav .nav-item i {
    font-size: 1.2rem;
    margin-bottom: 2px;
  }
  
  /* 메인 컨텐츠 여백 조정 */
  main {
    padding-bottom: 80px;
  }
  
  /* 상단 네비게이션 간소화 */
  .navbar .navbar-nav {
    display: none;
  }
}

/* 사용자 선택 인디케이터 */
.user-indicator {
  background: linear-gradient(45deg, #007bff, #28a745);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* 실시간 동기화 상태 */
.sync-status {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.75rem;
}

/* 연결 끊김 알림 */
.offline-indicator {
  background: #dc3545;
  color: white;
  padding: 10px;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  font-size: 0.875rem;
}
```

## 🚀 개발 우선순위 (최종)

### Phase 1: Supabase 기본 설정 (3-4일)
- [ ] Supabase 프로젝트 생성
- [ ] PostgreSQL 테이블 생성 및 초기 데이터
- [ ] 기본 HTML 구조 + Bootstrap
- [ ] 사용자 선택 시스템 구현
- [ ] Supabase JavaScript SDK 연동

### Phase 2: 핵심 CRUD 기능 (1주)
- [ ] 가계부 거래 내역 CRUD
- [ ] 냉장고 재고 관리 CRUD
- [ ] 레시피 관리 CRUD
- [ ] 식단 계획 CRUD
- [ ] 카테고리 관리

### Phase 3: 비즈니스 로직 (1주)
- [ ] 구매 → 재고 자동 추가 로직
- [ ] 요리 → 재고 차감 로직
- [ ] 유통기한 계산 및 알림
- [ ] 재고 기반 요리 가능 여부 확인

### Phase 4: 실시간 동기화 (3-4일)
- [ ] Supabase 실시간 구독 설정
- [ ] 상대방 활동 알림 시스템
- [ ] 연결 상태 표시
- [ ] 오프라인 모드 처리

### Phase 5: UI/UX 개선 및 배포 (3-4일)
- [ ] 모바일 반응형 최적화
- [ ] PWA 기능 (매니페스트 + 서비스 워커)
- [ ] Netlify 환경 변수 설정 및 배포
- [ ] 성능 최적화 및 테스트

## 💰 비용 분석 (Supabase)

### Supabase 무료 플랜
- **데이터베이스**: 500MB 저장공간
- **실시간 구독**: 무제한 연결
- **API 요청**: 무제한
- **스토리지**: 1GB (레시피 이미지용)
- **대역폭**: 2GB/월

### 예상 사용량 (부부)
```
데이터베이스: ~10MB (거래 1년치 + 레시피 + 재고)
API 요청: ~1,000회/일 (앱 사용시마다)
실시간 구독: 2개 연결 (부부 각각)
스토리지: ~100MB (레시피 이미지)
```

**결론**: Supabase 무료 플랜으로 충분히 사용 가능

## 🎯 장점 및 특징 요약

### 주요 장점
1. **극단적 단순함**: 로그인 없이 바로 사용
2. **PostgreSQL**: 익숙한 SQL + 관계형 데이터
3. **실시간 동기화**: 즉시 반영되는 협업 환경
4. **무료 사용**: 부부 사용량으로는 비용 발생 없음
5. **쉬운 배포**: Netlify 정적 호스팅

### 부부 특화 기능
- 👥 사용자 간편 전환 (남편 ↔ 아내)
- 🔄 실시간 활동 알림
- 📱 모바일 최적화된 터치 인터페이스
- 🏠 가족 중심의 데이터 모델
- 🔗 구매↔재고↔식단 완벽 연동

🎨 디자인 시스템 (감자 & 토끼)
1. 디자인 원칙
따뜻함 + 깔끔함: 파스텔톤, 넉넉한 여백, 둥근 모서리(16–24px).

캐릭터는 강조, 데이터는 선명: 캐릭터는 안내·빈상태·뱃지에 사용, 데이터는 대비 높게.

모바일 우선: 하단 내비, 44px+ 터치 타깃, 한 손 조작 최적화.


2. 마스코트 가이드(감자 & 토끼)
역할 분담

감자: 가계부/지출/저장(저금통, 영수증, 동전)

토끼: 식단/레시피/요리(냄비, 당근, 앞치마)

사용 위치: 빈 상태, 도움말 토스트, 리워드 뱃지, 탭 아이콘.

표정 팩(각 6종): 기본/웃음/깜짝/쿨/슬픔/승리 ✳︎ 파일명 예: assets/images/mascots/potato_happy.svg

금지: 왜곡 스케일, 지나친 회전, 네거티브 문구 옆 과도 사용.

3. 마이크로 인터랙션
토스트: 성공=감자 하이파이브, 실패=토끼 당근 놓침 이모티콘 😅

입력 성공 시 입력창이 90ms 정도 살짝 흔들리며(translateY) 체크 아이콘 표시.

요리 완료: 토끼가 냄비를 흔드는 작은 Lottie(선택) — 없으면 GIF.

4. 작업 체크리스트(디자인)
 tokens.css/components.css 적용 및 기존 Bootstrap 색상 오버라이드

 하단 내비 도입(모바일), 데스크톱은 상단 탭 유지

 감자/토끼 SVG 12종 제작(표정 팩) + 빈상태 일러스트 3종

 거래/식단/재고 카드 컴포넌트 교체

 빈 상태·토스트 카피라이팅(짧고 다정하게)

 접근성 점검(대비, 포커스 링, aria-label)

이 설계서를 바탕으로 Supabase의 강력한 기능을 활용하면서도 복잡한 인증 시스템 없이 부부가 함께 사용할 수 있는 실용적인 웹앱을 개발할 수 있습니다.