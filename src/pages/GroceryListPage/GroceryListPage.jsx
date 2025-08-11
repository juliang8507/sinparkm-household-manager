import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';
import Badge from '../../components/atoms/Badge';
import Input from '../../components/atoms/Input';
import Character from '../../components/atoms/Character';
import EmptyState from '../../components/molecules/EmptyState';
import useGroceryItems from '../../hooks/useGroceryItems.js';
import { 
  ArrowLeftIcon, 
  PlusIcon,
  CheckIcon,
  TrashIcon,
  ShoppingCartIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { CheckIcon as CheckIconSolid } from '@heroicons/react/24/solid';

const GroceryListPage = () => {
  const navigate = useNavigate();
  const [newItem, setNewItem] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'remaining', 'completed'

  // Use Supabase grocery items hook with real-time updates
  const {
    groupedItems,
    stats,
    isLoading,
    isError,
    error,
    createItem,
    toggleItem,
    deleteItem,
    updateFilters
  } = useGroceryItems({
    filters: { status: activeFilter },
    realtime: true,
    autoLoad: true,
    groupByStore: true
  });

  const categories = {
    dairy: { name: '유제품', icon: '🥛', color: 'bg-blue-100 text-blue-800' },
    fruits: { name: '과일', icon: '🍎', color: 'bg-red-100 text-red-800' },
    vegetables: { name: '채소', icon: '🥕', color: 'bg-green-100 text-green-800' },
    meat: { name: '정육', icon: '🥩', color: 'bg-red-200 text-red-900' },
    snacks: { name: '간식', icon: '🍪', color: 'bg-yellow-100 text-yellow-800' },
    household: { name: '생활용품', icon: '🧴', color: 'bg-gray-100 text-gray-800' }
  };

  const handleToggleItem = async (itemId) => {
    try {
      await toggleItem(itemId);
    } catch (error) {
      console.error('항목 상태 변경 실패:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('이 항목을 삭제하시겠습니까?')) {
      try {
        await deleteItem(itemId);
      } catch (error) {
        console.error('항목 삭제 실패:', error);
        alert('항목 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const addNewItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    const newGroceryItem = {
      name: newItem.trim(),
      quantity: '1개',
      category: 'household',
      price: 0,
      is_completed: false,
      added_by: 'husband', // Could be dynamic based on current user
      priority: 'medium',
      store: '이마트',
      notes: null
    };

    try {
      await createItem(newGroceryItem);
      setNewItem('');
    } catch (error) {
      console.error('항목 추가 실패:', error);
      alert('항목 추가에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleFilterChange = async (filter) => {
    setActiveFilter(filter);
    try {
      await updateFilters({ status: filter });
    } catch (error) {
      console.error('필터 변경 실패:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return '급함';
      case 'medium': return '보통';
      case 'low': return '여유';
      default: return '보통';
    }
  };

  // Use data from the hook - no need for local processing since hook handles grouping
  const allItems = Object.values(groupedItems).flat();
  const isEmpty = !isLoading && allItems.length === 0;

  return (
    <div className="min-h-screen bg-background-cream pb-24">
      {/* Header */}
      <div className="bg-surface-white border-b border-border-light p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-text-medium hover:text-text-dark"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold text-text-dark">장보기 목록</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-text-medium hover:text-text-dark"
          >
            <ShoppingCartIcon className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Add New Item */}
      <Card className="m-4">
        <form onSubmit={addNewItem} className="flex gap-2">
          <Input
            type="text"
            placeholder="장보기 목록에 추가할 항목을 입력하세요"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="primary" size="icon">
            <PlusIcon className="w-5 h-5" />
          </Button>
        </form>
      </Card>

      {/* Statistics */}
      <Card className="mx-4 mb-4">
        <h3 className="text-lg font-semibold text-text-dark mb-4">쇼핑 현황</h3>
        {isLoading ? (
          <div className="grid grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="h-6 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-text-dark mb-1">{stats.total || 0}</div>
              <div className="text-sm text-text-medium">전체 항목</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600 mb-1">{stats.completed || 0}</div>
              <div className="text-sm text-text-medium">완료</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600 mb-1">{stats.remaining || 0}</div>
              <div className="text-sm text-text-medium">남은 항목</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-text-dark mb-1">
                {new Intl.NumberFormat('ko-KR').format(stats.totalPrice || 0)}원
              </div>
              <div className="text-sm text-text-medium">예상 비용</div>
            </div>
          </div>
        )}
      </Card>

      {/* Filter Tabs */}
      <div className="px-4 mb-4">
        <Card padding="sm">
          <div className="flex gap-2">
            <Button
              variant={activeFilter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('all')}
              className="flex-1"
            >
              전체 ({stats.total || 0})
            </Button>
            <Button
              variant={activeFilter === 'remaining' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('remaining')}
              className="flex-1"
            >
              남은 항목 ({stats.remaining || 0})
            </Button>
            <Button
              variant={activeFilter === 'completed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('completed')}
              className="flex-1"
            >
              완료 ({stats.completed || 0})
            </Button>
          </div>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="px-4 space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} padding="none" className="overflow-hidden animate-pulse">
              <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="w-32 h-4 bg-gray-200 rounded mb-1"></div>
                      <div className="w-20 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="px-4">
          <Card className="text-center p-6">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-text-medium mb-2">장보기 목록을 불러올 수 없습니다</p>
            <p className="text-sm text-text-light">{error?.userMessage || '다시 시도해주세요'}</p>
          </Card>
        </div>
      ) : !isEmpty ? (
        <div className="px-4 space-y-4">
          {Object.entries(groupedItems).map(([store, items]) => (
            <Card key={store} padding="none" className="overflow-hidden">
              {/* Store Header */}
              <div className="flex items-center justify-between p-4 bg-potato-50 border-b border-border-light">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏪</span>
                  <div>
                    <h3 className="font-semibold text-text-dark">{store}</h3>
                    <p className="text-sm text-text-medium">
                      {items.length}개 항목 • {items.filter(item => item.is_completed).length}/{items.length} 완료
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-text-dark">
                    {new Intl.NumberFormat('ko-KR').format(items.reduce((sum, item) => sum + (item.price || 0), 0))}원
                  </div>
                  <div className="text-sm text-text-medium">예상 비용</div>
                </div>
              </div>

              {/* Items */}
              <div>
                {items.map((item, itemIndex) => (
                  <div 
                    key={item.id}
                    className={`p-4 border-b border-border-light last:border-b-0 transition-all duration-200 ${
                      item.is_completed ? 'bg-green-50 opacity-75' : 'bg-surface-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <button
                        onClick={() => handleToggleItem(item.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          item.is_completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-border-medium hover:border-green-400'
                        }`}
                      >
                        {item.is_completed && <CheckIconSolid className="w-4 h-4" />}
                      </button>

                      {/* Item Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${item.is_completed ? 'line-through text-text-medium' : 'text-text-dark'}`}>
                            {item.name}
                          </h4>
                          <Badge variant="outline" size="sm">
                            {item.quantity}
                          </Badge>
                          {categories[item.category] && (
                            <Badge variant="secondary" size="sm">
                              {categories[item.category].icon} {categories[item.category].name}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-sm text-text-medium">
                          {/* Price */}
                          <span className="font-medium">
                            {new Intl.NumberFormat('ko-KR').format(item.price || 0)}원
                          </span>

                          {/* Priority */}
                          <Badge variant="outline" size="sm" className={getPriorityColor(item.priority)}>
                            {getPriorityLabel(item.priority)}
                          </Badge>

                          {/* Added By */}
                          <div className="flex items-center gap-1">
                            <Character type={item.added_by === 'wife' ? 'rabbit' : 'potato'} size="xs" />
                            <span>{item.added_by === 'wife' ? '영희' : '철수'}</span>
                          </div>

                          {/* Completion Time */}
                          {item.is_completed && item.completed_at && (
                            <span className="text-green-600">
                              ✓ {new Date(item.completed_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>

                        {/* Notes */}
                        {item.notes && (
                          <p className="text-sm text-text-medium mt-1 italic">
                            📝 {item.notes}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="px-4">
          <EmptyState
            type="grocery"
            title="장보기 목록이 비어있어요"
            description="필요한 생필품을 추가해보세요"
            actionText="항목 추가하기"
            onAction={() => document.querySelector('input[placeholder*="장보기"]').focus()}
          />
        </div>
      )}

      {/* Quick Add Suggestions */}
      {!isEmpty && activeFilter === 'all' && (
        <Card className="mx-4 mt-4">
          <h3 className="text-sm font-semibold text-text-dark mb-3">자주 사는 항목</h3>
          <div className="flex flex-wrap gap-2">
            {['쌀', '계란', '우유', '빵', '양파', '마늘', '대파', '화장지'].map((item) => (
              <button
                key={item}
                onClick={() => setNewItem(item)}
                className="px-3 py-1 bg-background-cream border border-border-light rounded-full text-sm text-text-dark hover:bg-potato-100 transition-colors duration-200"
              >
                + {item}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Shopping Summary */}
      {(stats.remaining || 0) > 0 && (
        <Card className="m-4 bg-gradient-to-r from-potato-primary to-rabbit-primary text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">쇼핑 요약</h3>
              <p className="text-sm opacity-90">
                {stats.remaining || 0}개 항목 남음 • 예상 비용 {new Intl.NumberFormat('ko-KR').format((stats.totalPrice || 0) - (stats.completedPrice || 0))}원
              </p>
            </div>
            <Button variant="secondary" size="sm">
              쇼핑 시작
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default GroceryListPage;