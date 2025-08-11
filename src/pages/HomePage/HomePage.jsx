import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';
import CoupleGreeting from '../../components/molecules/CoupleGreeting';
import StatCard from '../../components/molecules/StatCard';
import TransactionItem from '../../components/molecules/TransactionItem';
import EmptyState from '../../components/molecules/EmptyState';
import useTransactions from '../../hooks/useTransactions.js';

const HomePage = () => {
  const navigate = useNavigate();

  // Get current month's transactions with real-time updates
  const currentMonthFilters = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return {
      start_date: startOfMonth,
      end_date: endOfMonth
    };
  }, []);

  const {
    transactions: allTransactions,
    stats: monthlyStats,
    isLoading: isLoadingTransactions,
    isError: hasTransactionError,
    error: transactionError
  } = useTransactions({
    filters: currentMonthFilters,
    pagination: { page: 0, limit: 10 }, // Only need recent transactions
    realtime: true,
    autoLoad: true
  });

  // Get recent transactions (last 5)
  const recentTransactions = useMemo(() => {
    return allTransactions.slice(0, 5);
  }, [allTransactions]);

  const quickActions = [
    {
      icon: '💰',
      label: '거래 추가',
      color: 'bg-potato-primary',
      onClick: () => navigate('/transaction/add')
    },
    {
      icon: '📊',
      label: '내역 보기',
      color: 'bg-rabbit-primary',
      onClick: () => navigate('/transactions')
    },
    {
      icon: '🍽️',
      label: '식단 계획',
      color: 'bg-yellow-400',
      onClick: () => navigate('/meals')
    },
    {
      icon: '🛒',
      label: '장보기',
      color: 'bg-green-400',
      onClick: () => navigate('/grocery')
    }
  ];

  const { deleteTransaction } = useTransactions({
    filters: currentMonthFilters,
    autoLoad: false // We don't want to create another instance
  });

  const handleTransactionEdit = (transaction) => {
    navigate(`/transaction/edit/${transaction.id}`);
  };

  const handleTransactionDelete = async (transaction) => {
    if (window.confirm('이 거래 내역을 삭제하시겠습니까?')) {
      try {
        await deleteTransaction(transaction.id);
        // Success feedback could be added here
      } catch (error) {
        console.error('거래 삭제 실패:', error);
        alert('거래 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleAddTransaction = () => {
    navigate('/transaction/add');
  };

  return (
    <div className="min-h-screen bg-background-cream pb-24">
      {/* Header with couple greeting */}
      <Card variant="gradient" className="m-4 text-center">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">안녕하세요! 👋</h1>
          <p className="text-text-dark opacity-90">오늘도 행복한 하루 보내세요</p>
        </div>
        <CoupleGreeting />
      </Card>

      {/* Monthly Summary */}
      <Card className="mx-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-dark">1월 가계 현황</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/transactions')}
            className="text-potato-600 hover:text-potato-700"
          >
            자세히 보기
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            title="수입"
            value={monthlyStats?.total_income || 0}
            type="income"
            icon="📈"
            isLoading={isLoadingTransactions}
          />
          <StatCard
            title="지출"
            value={monthlyStats?.total_expense || 0}
            type="expense"
            icon="📉"
            isLoading={isLoadingTransactions}
          />
          <StatCard
            title="잔액"
            value={monthlyStats?.net_amount || 0}
            type="balance"
            icon="💰"
            isLoading={isLoadingTransactions}
          />
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="mx-4 mb-6">
        <h3 className="text-lg font-semibold text-text-dark mb-4">빠른 실행</h3>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`${action.color} rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm font-medium text-text-dark">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="mx-4 mb-6" padding="none">
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-dark">최근 거래</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/transactions')}
              className="text-potato-600 hover:text-potato-700"
            >
              전체 보기
            </Button>
          </div>
        </div>
        
        {isLoadingTransactions ? (
          <div className="p-4">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : hasTransactionError ? (
          <div className="p-4 text-center">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-text-medium mb-2">거래 내역을 불러올 수 없습니다</p>
            <p className="text-sm text-text-light">{transactionError?.userMessage || '다시 시도해주세요'}</p>
          </div>
        ) : recentTransactions.length > 0 ? (
          <div className="border-t border-border-light mt-4">
            {recentTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onEdit={handleTransactionEdit}
                onDelete={handleTransactionDelete}
              />
            ))}
          </div>
        ) : (
          <div className="p-4">
            <EmptyState 
              type="transactions"
              onAction={handleAddTransaction}
            />
          </div>
        )}
      </Card>

      {/* Today's Tips */}
      <Card variant="minimal" className="mx-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-medium text-text-dark mb-1">오늘의 가계부 팁</h4>
            <p className="text-sm text-text-medium leading-relaxed">
              매일 작은 지출도 기록하는 습관을 만들어보세요. 
              작은 돈의 흐름을 파악하면 더 효율적인 가계 관리가 가능해요!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;