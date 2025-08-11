import React from 'react';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-potato-primary to-rabbit-primary text-text-dark hover:shadow-md',
        potato: 'bg-potato-primary text-text-dark hover:bg-potato-500 hover:shadow-md',
        rabbit: 'bg-rabbit-primary text-text-dark hover:bg-rabbit-500 hover:shadow-md',
        outline: 'border-2 border-potato-primary text-potato-600 hover:bg-potato-50',
        ghost: 'text-text-medium hover:bg-background-cream',
        floating: 'bg-gradient-to-r from-potato-primary to-rabbit-primary text-text-dark rounded-full shadow-floating hover:shadow-lg hover:scale-105'
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        base: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
        icon: 'p-2',
        floating: 'w-14 h-14'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'base'
    }
  }
);

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'base', 
  className = '', 
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  return (
    <button
      type={type}
      className={buttonVariants({ variant, size, className })}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;