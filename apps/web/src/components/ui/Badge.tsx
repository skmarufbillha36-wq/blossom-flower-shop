import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'brand';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'badge-default',
  success: 'badge-success',
  warning: 'badge-warning',
  danger:  'badge-danger',
  brand:   'badge-brand',
};

/** Small status badge component used for order status, labels, etc. */
export const Badge = ({ variant = 'default', children, className = '' }: BadgeProps) => {
  return (
    <span className={`badge ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

/** Maps an OrderStatus string to a badge variant */
export const orderStatusVariant = (status: string): BadgeVariant => {
  const map: Record<string, BadgeVariant> = {
    PENDING:          'warning',
    CONFIRMED:        'brand',
    PREPARING:        'brand',
    OUT_FOR_DELIVERY: 'brand',
    DELIVERED:        'success',
    CANCELLED:        'danger',
  };
  return map[status] ?? 'default';
};
