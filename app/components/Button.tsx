'use client';

import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';

import { ButtonStatus, ButtonVariant } from '@ts/ui/components-variants';

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: ButtonVariant;
  status?: ButtonStatus;
  beforeIcon?: ReactNode;
  afterIcon?: ReactNode;
  loading?: boolean;
};

export default function Button({
  children,
  variant = 'primary',
  status = '',
  beforeIcon,
  afterIcon,
  className = '',
  disabled,
  loading,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${variant} ${status} ${className}`}
    >
      {beforeIcon}
      {children}
      {loading ? '...' : ''}
      {afterIcon}
    </button>
  );
}
