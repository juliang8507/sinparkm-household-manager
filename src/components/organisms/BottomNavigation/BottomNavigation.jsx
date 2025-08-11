import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../atoms/Button';
import { PlusIcon } from '@heroicons/react/24/solid';

const BottomNavigation = ({ onAddTransaction }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { 
      path: '/', 
      icon: '🏠', 
      label: '홈',
      badge: null 
    },
    { 
      path: '/transactions', 
      icon: '💰', 
      label: '거래내역',
      badge: null 
    },
    { 
      path: '/meals', 
      icon: '🍽️', 
      label: '식단',
      badge: null 
    },
    { 
      path: '/grocery', 
      icon: '🛒', 
      label: '장보기',
      badge: 5 
    }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe-area-inset-bottom">
      <div className="bg-surface-white border-t border-border-light shadow-lg">
        <div className="flex items-center px-2 py-2">
          {navItems.map((item, index) => {
            const active = isActive(item.path);
            
            return (
              <React.Fragment key={item.path}>
                {/* Navigation Item */}
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`flex-1 flex flex-col items-center gap-1 p-2 transition-all duration-200 relative ${
                    active 
                      ? 'text-potato-600' 
                      : 'text-text-medium hover:text-text-dark'
                  }`}
                >
                  <div className={`text-xl transition-transform duration-200 ${
                    active ? 'scale-110' : ''
                  }`}>
                    {item.icon}
                  </div>
                  <span className={`text-xs font-medium ${
                    active ? 'font-semibold' : ''
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute -top-1 right-3 w-5 h-5 bg-expense text-white text-xs font-semibold rounded-full flex items-center justify-center">
                      {item.badge}
                    </div>
                  )}
                </button>

                {/* Add Button (after transactions item) */}
                {index === 1 && (
                  <div className="flex-1 flex justify-center">
                    <Button
                      variant="floating"
                      size="floating"
                      onClick={onAddTransaction}
                      className="relative -top-2 shadow-floating hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                      aria-label="거래 추가"
                    >
                      <PlusIcon className="w-6 h-6" />
                    </Button>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;