import React from 'react';
import Card from '../../atoms/Card';

const StatCard = ({ 
  title, 
  value, 
  type = 'default', // 'income', 'expense', 'balance'
  icon,
  className = ''
}) => {
  const getValueColor = (type) => {
    switch (type) {
      case 'income':
        return 'text-income';
      case 'expense':
        return 'text-expense';
      case 'balance':
        return 'text-text-dark';
      default:
        return 'text-text-dark';
    }
  };

  const formatValue = (value, type) => {
    const formattedValue = new Intl.NumberFormat('ko-KR').format(Math.abs(value));
    
    if (type === 'expense' && value > 0) {
      return `-${formattedValue}원`;
    } else if (type === 'income' && value > 0) {
      return `+${formattedValue}원`;
    }
    
    return `${formattedValue}원`;
  };

  return (
    <Card className={`text-center ${className}`} padding="sm">
      {icon && (
        <div className="text-2xl mb-2">
          {icon}
        </div>
      )}
      <div className={`text-xl font-bold ${getValueColor(type)} mb-1`}>
        {formatValue(value, type)}
      </div>
      <div className="text-sm text-text-medium">
        {title}
      </div>
    </Card>
  );
};

export default StatCard;