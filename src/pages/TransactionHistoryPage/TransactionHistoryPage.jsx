import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';
import Badge from '../../components/atoms/Badge';
import TransactionItem from '../../components/molecules/TransactionItem';
import EmptyState from '../../components/molecules/EmptyState';
import useTransactions from '../../hooks/useTransactions.js';
import { 
  ArrowLeftIcon, 
  FunnelIcon,
  CalendarDaysIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const TransactionHistoryPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'income', 'expense'
  const [selectedDate, setSelectedDate] = useState('thisMonth');
  const [selectedUser, setSelectedUser] = useState('all');

  // Date range for current month
  const currentMonthFilters = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return {
      start_date: startOfMonth,
      end_date: endOfMonth
    };
  }, []);

  // Build comprehensive filters
  const transactionFilters = useMemo(() => {
    const filters = { ...currentMonthFilters };
    
    if (activeFilter !== 'all') {
      filters.type = activeFilter;
    }
    
    if (selectedUser !== 'all') {
      filters.user_id = selectedUser;
    }
    
    return filters;
  }, [currentMonthFilters, activeFilter, selectedUser]);

  // Load transactions with real-time updates
  const {
    transactions,
    stats: monthlyStats,
    isLoading,
    isError,
    error,
    deleteTransaction,
    updateFilters
  } = useTransactions({
    filters: transactionFilters,
    pagination: { page: 0, limit: 100 }, // Load more transactions for history
    realtime: true,
    autoLoad: true,
    groupByDate: true // Enable date grouping in the hook
  });

  const handleTransactionEdit = (transaction) => {
    navigate(`/transaction/edit/${transaction.id}`);
  };

  const handleTransactionDelete = async (transaction) => {
    if (window.confirm('이 거래 내역을 삭제하시겠습니까?')) {
      try {
        await deleteTransaction(transaction.id);
        // Success feedback is handled by optimistic updates
      } catch (error) {
        console.error('거래 삭제 실패:', error);
        alert('거래 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleAddTransaction = () => {
    navigate('/transaction/add');
  };

  // Handle filter changes
  const handleFilterChange = async (filterType, value) => {
    if (filterType === 'type') {
      setActiveFilter(value);
    } else if (filterType === 'user') {
      setSelectedUser(value);
    }
    
    // Update filters in the hook
    try {
      const newFilters = { ...transactionFilters };
      
      if (filterType === 'type') {
        if (value === 'all') {
          delete newFilters.type;
        } else {
          newFilters.type = value;
        }
      } else if (filterType === 'user') {
        if (value === 'all') {
          delete newFilters.user_id;
        } else {
          newFilters.user_id = value;
        }
      }
      
      await updateFilters(newFilters);
    } catch (error) {
      console.error('필터 업데이트 실패:', error);
    }
  };

  // Group transactions by date
  const groupTransactionsByDate = (transactions) => {
    const groups = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.transaction_date);
      let groupKey;
      let displayDate;
      
      if (transactionDate.toDateString() === today.toDateString()) {
        groupKey = 'today';
        displayDate = '오늘';
      } else if (transactionDate.toDateString() === yesterday.toDateString()) {
        groupKey = 'yesterday';
        displayDate = '어제';
      } else {
        groupKey = transactionDate.toDateString();
        displayDate = transactionDate.toLocaleDateString('ko-KR', {
          month: 'long',
          day: 'numeric',
          weekday: 'short'
        });
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          date: displayDate,
          fullDate: transactionDate.toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'short'
          }),
          transactions: [],
          totalIncome: 0,
          totalExpense: 0
        };
      }
      
      groups[groupKey].transactions.push(transaction);
      
      if (transaction.type === 'income') {
        groups[groupKey].totalIncome += transaction.amount;
      } else {
        groups[groupKey].totalExpense += transaction.amount;
      }
    });
    
    // Sort groups by date (most recent first)
    return Object.values(groups).sort((a, b) => {
      if (a.date === '오늘') return -1;
      if (b.date === '오늘') return 1;
      if (a.date === '어제') return -1;
      if (b.date === '어제') return 1;
      return new Date(b.fullDate) - new Date(a.fullDate);
    });
  };

  const transactionGroups = useMemo(() => {
    return groupTransactionsByDate(transactions);
  }, [transactions]);

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
          <h1 className="text-lg font-semibold text-text-dark">거래 내역</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-text-medium hover:text-text-dark"
          >
            <FunnelIcon className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Monthly Summary */}
      <Card className="m-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-dark">
            {new Date().toLocaleDateString('ko-KR', { month: 'long' })} 요약
          </h2>
          <Button variant="ghost" size="sm" className="text-potato-600 hover:text-potato-700">
            월별 보기
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-6 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-income mb-1">
                +{new Intl.NumberFormat('ko-KR').format(monthlyStats?.total_income || 0)}원
              </div>
              <div className="text-sm text-text-medium">수입</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-expense mb-1">
                -{new Intl.NumberFormat('ko-KR').format(monthlyStats?.total_expense || 0)}원
              </div>
              <div className="text-sm text-text-medium">지출</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-text-dark mb-1">
                {new Intl.NumberFormat('ko-KR').format(monthlyStats?.net_amount || 0)}원
              </div>
              <div className="text-sm text-text-medium">잔액</div>
            </div>
          </div>
        )}
      </Card>

      {/* Filters */}
      <div className="px-4 mb-4">
        {/* Type Filter */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeFilter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('type', 'all')}
          >
            전체
          </Button>
          <Button
            variant={activeFilter === 'income' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('type', 'income')}
          >
            수입
          </Button>
          <Button
            variant={activeFilter === 'expense' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('type', 'expense')}
          >
            지출
          </Button>
        </div>

        {/* Date and User Filters */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <CalendarDaysIcon className="w-4 h-4" />
            이번 달
          </Button>
          
          <select
            value={selectedUser}
            onChange={(e) => handleFilterChange('user', e.target.value)}
            className="px-3 py-2 border border-border-light rounded-lg text-sm bg-surface-white hover:border-potato-200 focus:border-potato-primary focus:outline-none"
          >
            <option value="all">모든 사용자</option>
            <option value="husband">철수 (남편)</option>
            <option value="wife">영희 (아내)</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="px-4 space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} padding="none" className="overflow-hidden animate-pulse">
              <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
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
            <p className="text-text-medium mb-2">거래 내역을 불러올 수 없습니다</p>
            <p className="text-sm text-text-light">{error?.userMessage || '다시 시도해주세요'}</p>
          </Card>
        </div>
      ) : transactionGroups.length > 0 ? (
        <div className="px-4 space-y-4">
          {transactionGroups.map((group, groupIndex) => (
            <Card key={groupIndex} padding="none" className="overflow-hidden">
              {/* Group Header */}
              <div className="flex items-center justify-between p-4 bg-background-cream border-b border-border-light">
                <div>
                  <div className="font-semibold text-text-dark">{group.date}</div>
                  <div className="text-sm text-text-medium">{group.fullDate}</div>
                </div>
                <div className="text-right text-sm">
                  {group.totalIncome > 0 && (
                    <div className="text-income font-semibold">
                      +{new Intl.NumberFormat('ko-KR').format(group.totalIncome)}원
                    </div>
                  )}
                  {group.totalExpense > 0 && (
                    <div className="text-expense font-semibold">
                      -{new Intl.NumberFormat('ko-KR').format(group.totalExpense)}원
                    </div>
                  )}
                </div>
              </div>

              {/* Transactions */}
              <div>
                {group.transactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={handleTransactionEdit}
                    onDelete={handleTransactionDelete}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="px-4">
          <EmptyState
            type="transactions"
            onAction={handleAddTransaction}
          />
        </div>
      )}

      {/* Load More */}
      {transactionGroups.length > 0 && transactions.length >= 100 && (
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // This could be implemented to load more pages
              console.log('Load more transactions');
            }}
          >
            더 많은 거래 내역 불러오기
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistoryPage;