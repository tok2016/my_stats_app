'use client';

import { Icon } from '@iconify/react';
import { MouseEvent, ReactNode } from 'react';

import { ButtonVariant } from '@ts/ui/components-variants';

import { getIconCode } from '@lib/utils';

type ButtonProps = {
  children?: ReactNode;
  variant?: ButtonVariant;
  beforeIconCode?: string;
  afterIconCode?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: HTMLButtonElement['type'];
  onClick?: (evt: MouseEvent) => void;
};

export default function Button({
  children,
  variant = 'primary',
  beforeIconCode,
  afterIconCode,
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
      {!beforeIconCode || <Icon icon={getIconCode(beforeIconCode)} />}
      {children}
      {loading ? '...' : ''}
      {!afterIconCode || <Icon icon={getIconCode(afterIconCode)} />}
    </button>
  );
}
