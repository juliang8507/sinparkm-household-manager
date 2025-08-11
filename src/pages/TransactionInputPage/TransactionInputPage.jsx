import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import Character from '../../components/atoms/Character';
import useTransactions from '../../hooks/useTransactions.js';
import useCategories from '../../hooks/useCategories.js';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const TransactionInputPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense', // 'income' | 'expense'
    category_id: '',
    description: '',
    user_id: 'husband' // 'husband' | 'wife'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load categories based on selected user and transaction type
  const { 
    categories, 
    isLoading: categoriesLoading,
    isError: categoriesError,
    getRelevantCategories 
  } = useCategories({
    userType: 'both', // Load all categories and filter client-side
    autoLoad: true
  });

  // Get transaction methods
  const { createTransaction } = useTransactions({
    autoLoad: false // We don't need to load transactions here
  });

  // Get relevant categories for current form state
  const relevantCategories = useMemo(() => {
    if (!categories.length) return [];
    
    return categories.filter(category => {
      const matchesTransactionType = category.type === formData.type || category.type === 'both';
      const matchesUserType = category.user_type === formData.user_id || 
                              category.user_type === 'both';
      
      return matchesTransactionType && matchesUserType;
    });
  }, [categories, formData.type, formData.user_id]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Reset category when user or transaction type changes
    if ((field === 'user_id' || field === 'type') && formData.category_id) {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        category_id: '' // Reset category selection
      }));
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    handleInputChange('amount', value);
  };

  const formatAmount = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.amount || !formData.category_id || !formData.description) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (parseInt(formData.amount) <= 0) {
      alert('금액을 올바르게 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const transactionData = {
        amount: parseInt(formData.amount),
        type: formData.type,
        category_id: formData.category_id,
        description: formData.description.trim(),
        user_id: formData.user_id,
        transaction_date: new Date().toISOString()
      };

      const result = await createTransaction(transactionData);
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Show success feedback
      alert('거래가 성공적으로 추가되었습니다!');
      
      // Navigate back to home
      navigate('/');
      
    } catch (error) {
      console.error('거래 추가 실패:', error);
      alert('거래 추가에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get color for category display
  const getCategoryColor = (category) => {
    const colorMap = {
      'food': 'bg-red-100',
      'transport': 'bg-blue-100', 
      'living': 'bg-green-100',
      'medical': 'bg-purple-100',
      'entertainment': 'bg-yellow-100',
      'shopping': 'bg-pink-100',
      'beauty': 'bg-rose-100',
      'education': 'bg-indigo-100',
      'cafe': 'bg-amber-100',
      'health': 'bg-cyan-100',
      'salary': 'bg-green-200',
      'bonus': 'bg-emerald-100',
      'investment': 'bg-blue-200',
      'other': 'bg-gray-100'
    };

    // Use category's color if available, otherwise map by name or use default
    return category.color || colorMap[category.name.toLowerCase()] || 'bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-background-cream pb-24">
      {/* Header */}
      <div className="bg-surface-white border-b border-border-light p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-text-medium hover:text-text-dark"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold text-text-dark">거래 추가</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* User Selection */}
        <Card>
          <h3 className="text-lg font-semibold text-text-dark mb-4">누가 사용했나요?</h3>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleInputChange('user_id', 'husband')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
                formData.user_id === 'husband'
                  ? 'border-potato-primary bg-potato-50'
                  : 'border-border-light bg-surface-white hover:border-potato-200'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Character type="potato" size="lg" />
                <span className="font-medium text-text-dark">철수 (남편)</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleInputChange('user_id', 'wife')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
                formData.user_id === 'wife'
                  ? 'border-rabbit-primary bg-rabbit-50'
                  : 'border-border-light bg-surface-white hover:border-rabbit-200'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Character type="rabbit" size="lg" />
                <span className="font-medium text-text-dark">영희 (아내)</span>
              </div>
            </button>
          </div>
        </Card>

        {/* Transaction Type */}
        <Card>
          <h3 className="text-lg font-semibold text-text-dark mb-4">수입 / 지출</h3>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleInputChange('type', 'income')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
                formData.type === 'income'
                  ? 'border-green-500 bg-green-50'
                  : 'border-border-light bg-surface-white hover:border-green-200'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">📈</span>
                <span className="font-medium text-text-dark">수입</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleInputChange('type', 'expense')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
                formData.type === 'expense'
                  ? 'border-red-500 bg-red-50'
                  : 'border-border-light bg-surface-white hover:border-red-200'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">📉</span>
                <span className="font-medium text-text-dark">지출</span>
              </div>
            </button>
          </div>
        </Card>

        {/* Amount Input */}
        <Card>
          <h3 className="text-lg font-semibold text-text-dark mb-4">금액</h3>
          <div className="relative">
            <Input
              type="text"
              placeholder="금액을 입력하세요"
              value={formatAmount(formData.amount)}
              onChange={handleAmountChange}
              size="lg"
              className="text-2xl font-bold text-center"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl font-semibold text-text-medium">
              원
            </div>
          </div>
          
          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {['1만', '5만', '10만', '50만'].map((amount, index) => {
              const values = [10000, 50000, 100000, 500000];
              return (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleInputChange('amount', values[index].toString())}
                  className="p-2 bg-background-cream border border-border-light rounded-lg text-sm font-medium text-text-dark hover:bg-potato-100 transition-colors duration-200"
                >
                  +{amount}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Category Selection */}
        <Card>
          <h3 className="text-lg font-semibold text-text-dark mb-4">카테고리</h3>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 rounded-xl border-2 border-border-light animate-pulse">
                  <div className="w-full h-12 bg-gray-200 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : categoriesError ? (
            <div className="text-center p-6">
              <p className="text-text-medium mb-2">카테고리를 불러올 수 없습니다</p>
              <p className="text-sm text-text-light">다시 시도해주세요</p>
            </div>
          ) : relevantCategories.length === 0 ? (
            <div className="text-center p-6">
              <p className="text-text-medium">선택된 조건에 맞는 카테고리가 없습니다</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {relevantCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleInputChange('category_id', category.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.category_id === category.id
                      ? 'border-potato-primary bg-potato-50'
                      : 'border-border-light bg-surface-white hover:border-potato-200'
                  }`}
                >
                  <div className={`w-full h-12 ${getCategoryColor(category)} rounded-lg flex items-center justify-center mb-2`}>
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <span className="font-medium text-text-dark text-sm">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Description Input */}
        <Card>
          <h3 className="text-lg font-semibold text-text-dark mb-4">거래 내용</h3>
          <Input
            type="text"
            placeholder="예: 마트에서 장보기, 카페에서 커피"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full"
          />
        </Card>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            className="w-full py-4 text-lg font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? '추가 중...' : '거래 추가하기'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TransactionInputPage;