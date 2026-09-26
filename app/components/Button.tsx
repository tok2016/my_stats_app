'use client';

import { ButtonProps } from '@ts/ui/components-props';

export default function Button({
  id,
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
      id={id}
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
