import React from 'react';
import { cva } from 'class-variance-authority';

const inputVariants = cva(
  'w-full rounded-xl border-2 bg-surface-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-potato-primary/20',
  {
    variants: {
      variant: {
        default: 'border-border-light focus:border-potato-primary',
        error: 'border-expense focus:border-expense'
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        base: 'px-4 py-3 text-base',
        lg: 'px-5 py-4 text-lg'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'base'
    }
  }
);

const Input = ({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  variant = 'default',
  size = 'base',
  className = '',
  error = false,
  disabled = false,
  icon,
  ...props 
}) => {
  const inputClasses = inputVariants({ 
    variant: error ? 'error' : variant, 
    size, 
    className: icon ? `pl-12 ${className}` : className 
  });

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-medium">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={inputClasses}
        disabled={disabled}
        {...props}
      />
    </div>
  );
};

export default Input;