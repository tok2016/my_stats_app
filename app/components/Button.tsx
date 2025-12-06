'use client';

import { ButtonProps } from '@ts/ui/components-props';

export default function Button({
  children,
  variant = 'primary',
  status = '',
  beforeIcon,
  afterIcon,
  className = '',
  disabled,
  loading,
  type,
  onClick
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${variant} ${status} ${className}`}
      onClick={onClick}
    >
      {beforeIcon}
      {children}
      {loading ? '...' : ''}
      {afterIcon}
    </button>
  );
}
