import React from 'react';
import Badge from '../../atoms/Badge';
import { 
  PencilIcon, 
  TrashIcon 
} from '@heroicons/react/24/outline';

const TransactionItem = ({ 
  transaction, 
  onEdit, 
  onDelete,
  className = '' 
}) => {
  const {
    id,
    amount,
    type, // 'income' | 'expense'
    category,
    user,
    description,
    time,
    icon
  } = transaction;

  const formatAmount = (amount, type) => {
    const formattedAmount = new Intl.NumberFormat('ko-KR').format(Math.abs(amount));
    return type === 'income' ? `+${formattedAmount}원` : `-${formattedAmount}원`;
  };

  const getAmountColor = (type) => {
    return type === 'income' ? 'text-income' : 'text-expense';
  };

  const getUserBadgeVariant = (userType) => {
    return userType === 'husband' ? 'potato' : 'rabbit';
  };

  return (
    <div className={`bg-surface-white border-b border-border-light last:border-b-0 ${className}`}>
      <div className="flex items-center gap-4 p-4 group">
        {/* Category Icon */}
        <div className="w-12 h-12 bg-background-cream rounded-full flex items-center justify-center text-xl flex-shrink-0">
          {icon || '💰'}
        </div>

        {/* Transaction Details */}
        <div className="flex-1 min-w-0">
          <div className="text-base font-medium text-text-dark truncate">
            {description}
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-text-medium">
            <span>{category}</span>
            <Badge 
              variant={getUserBadgeVariant(user.type)} 
              size="sm"
            >
              {user.name}
            </Badge>
            <span>{time}</span>
          </div>
        </div>

        {/* Amount */}
        <div className={`text-lg font-bold flex-shrink-0 ${getAmountColor(type)}`}>
          {formatAmount(amount, type)}
        </div>

        {/* Action Buttons (Hidden by default, shown on hover) */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
          <button
            onClick={() => onEdit?.(transaction)}
            className="w-8 h-8 bg-potato-primary hover:bg-potato-500 rounded-full flex items-center justify-center transition-colors duration-200"
            aria-label="수정"
          >
            <PencilIcon className="w-4 h-4 text-text-dark" />
          </button>
          <button
            onClick={() => onDelete?.(transaction)}
            className="w-8 h-8 bg-expense hover:bg-red-400 rounded-full flex items-center justify-center transition-colors duration-200"
            aria-label="삭제"
          >
            <TrashIcon className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;