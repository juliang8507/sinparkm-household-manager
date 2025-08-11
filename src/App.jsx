import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import BottomNavigation from './components/organisms/BottomNavigation';

// Page imports
import HomePage from './pages/HomePage';
import TransactionInputPage from './pages/TransactionInputPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import MealPlanningPage from './pages/MealPlanningPage';
import GroceryListPage from './pages/GroceryListPage';

// Layout component to handle conditional bottom navigation
const Layout = ({ children }) => {
  const location = useLocation();
  
  // Routes where bottom navigation should be hidden
  const hideBottomNavRoutes = [
    '/transaction/add',
    '/transaction/edit',
    '/meal/add',
    '/recipe/add'
  ];

  const shouldHideBottomNav = hideBottomNavRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  return (
    <div className="min-h-screen bg-background-cream">
      {children}
      {!shouldHideBottomNav && <BottomNavigation />}
    </div>
  );
};

// Placeholder components for routes not yet implemented
const NotFoundPage = () => (
  <div className="min-h-screen bg-background-cream flex items-center justify-center p-4">
    <div className="text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-2xl font-bold text-text-dark mb-2">페이지를 찾을 수 없습니다</h1>
      <p className="text-text-medium mb-4">요청하신 페이지가 존재하지 않습니다.</p>
      <button 
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-potato-primary text-text-dark rounded-xl font-medium hover:bg-potato-500 transition-colors duration-200"
      >
        이전 페이지로
      </button>
    </div>
  </div>
);

// Placeholder for transaction edit page
const TransactionEditPage = () => {
  const location = useLocation();
  const transactionId = location.pathname.split('/').pop();
  
  return (
    <div className="min-h-screen bg-background-cream flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">✏️</div>
        <h1 className="text-2xl font-bold text-text-dark mb-2">거래 수정</h1>
        <p className="text-text-medium mb-4">거래 ID: {transactionId}</p>
        <p className="text-sm text-text-medium">이 페이지는 아직 구현되지 않았습니다.</p>
        <button 
          onClick={() => window.history.back()}
          className="mt-4 px-4 py-2 bg-potato-primary text-text-dark rounded-xl font-medium hover:bg-potato-500 transition-colors duration-200"
        >
          이전 페이지로
        </button>
      </div>
    </div>
  );
};

// Placeholder for meal add page
const MealAddPage = () => (
  <div className="min-h-screen bg-background-cream flex items-center justify-center p-4">
    <div className="text-center">
      <div className="text-6xl mb-4">🍽️</div>
      <h1 className="text-2xl font-bold text-text-dark mb-2">식단 추가</h1>
      <p className="text-text-medium mb-4">새로운 식단을 추가합니다.</p>
      <p className="text-sm text-text-medium">이 페이지는 아직 구현되지 않았습니다.</p>
      <button 
        onClick={() => window.history.back()}
        className="mt-4 px-4 py-2 bg-rabbit-primary text-text-dark rounded-xl font-medium hover:bg-rabbit-500 transition-colors duration-200"
      >
        이전 페이지로
      </button>
    </div>
  </div>
);

// Placeholder for recipe add page
const RecipeAddPage = () => (
  <div className="min-h-screen bg-background-cream flex items-center justify-center p-4">
    <div className="text-center">
      <div className="text-6xl mb-4">👨‍🍳</div>
      <h1 className="text-2xl font-bold text-text-dark mb-2">레시피 추가</h1>
      <p className="text-text-medium mb-4">새로운 레시피를 추가합니다.</p>
      <p className="text-sm text-text-medium">이 페이지는 아직 구현되지 않았습니다.</p>
      <button 
        onClick={() => window.history.back()}
        className="mt-4 px-4 py-2 bg-yellow-400 text-text-dark rounded-xl font-medium hover:bg-yellow-500 transition-colors duration-200"
      >
        이전 페이지로
      </button>
    </div>
  </div>
);

// Placeholder for recipe detail page
const RecipeDetailPage = () => {
  const location = useLocation();
  const recipeId = location.pathname.split('/').pop();
  
  return (
    <div className="min-h-screen bg-background-cream flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">📖</div>
        <h1 className="text-2xl font-bold text-text-dark mb-2">레시피 상세</h1>
        <p className="text-text-medium mb-4">레시피 ID: {recipeId}</p>
        <p className="text-sm text-text-medium">이 페이지는 아직 구현되지 않았습니다.</p>
        <button 
          onClick={() => window.history.back()}
          className="mt-4 px-4 py-2 bg-yellow-400 text-text-dark rounded-xl font-medium hover:bg-yellow-500 transition-colors duration-200"
        >
          이전 페이지로
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/transactions" element={<TransactionHistoryPage />} />
          <Route path="/meals" element={<MealPlanningPage />} />
          <Route path="/grocery" element={<GroceryListPage />} />
          
          {/* Transaction Routes */}
          <Route path="/transaction/add" element={<TransactionInputPage />} />
          <Route path="/transaction/edit/:id" element={<TransactionEditPage />} />
          
          {/* Meal & Recipe Routes */}
          <Route path="/meal/add" element={<MealAddPage />} />
          <Route path="/recipe/add" element={<RecipeAddPage />} />
          <Route path="/recipe/:id" element={<RecipeDetailPage />} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;