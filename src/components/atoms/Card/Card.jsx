import React from 'react';
import { cva } from 'class-variance-authority';

const cardVariants = cva(
  'rounded-2xl transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-surface-white shadow-card border border-border-light',
        elevated: 'bg-surface-white shadow-floating border border-border-light',
        gradient: 'bg-gradient-to-r from-potato-primary to-rabbit-primary border-0 text-text-dark',
        minimal: 'bg-background-cream shadow-none border border-border-light'
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        base: 'p-6',
        lg: 'p-8'
      }
    },
    defaultVariants: {
      variant: 'default',
      padding: 'base'
    }
  }
);

const Card = ({ 
  children, 
  variant = 'default', 
  padding = 'base',
  className = '',
  onClick,
  ...props 
}) => {
  return (
    <div
      className={cardVariants({ variant, padding, className })}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;