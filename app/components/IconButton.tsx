'use client';

import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

import { ButtonStatus, IconButtonVariant } from '@ts/ui/components-variants';

type IconButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  status?: ButtonStatus;
  loading?: boolean;
};

export default function IconButton({
  icon,
  variant = 'link',
  status = '',
  className,
  disabled,
  loading,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`button--icon ${variant} ${status} ${className}`}
    >
      {icon}
    </button>
  );
}
