import React from 'react';
import { cva } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-md font-medium',
  {
    variants: {
      variant: {
        potato: 'bg-potato-100 text-potato-700',
        rabbit: 'bg-rabbit-100 text-rabbit-700',
        income: 'bg-green-100 text-green-700',
        expense: 'bg-red-100 text-red-700',
        warning: 'bg-yellow-100 text-yellow-700',
        default: 'bg-gray-100 text-gray-700'
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        base: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'base'
    }
  }
);

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'base',
  className = '',
  ...props 
}) => {
  return (
    <span
      className={badgeVariants({ variant, size, className })}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;