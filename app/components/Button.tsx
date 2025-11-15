'use client';

import { ButtonProps } from '@ts/ui/components-props';

export default function Button({
  children,
  variant = 'primary',
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
      className={`${variant} ${className}`}
      onClick={onClick}
    >
      {beforeIcon}
      {children}
      {loading ? '...' : ''}
      {afterIcon}
    </button>
  );
}
