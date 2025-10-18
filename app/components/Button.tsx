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
  onClick?: (evt: MouseEvent) => void;
};

export default function Button({
  children,
  variant = 'filled',
  beforeIconCode,
  afterIconCode,
  className = '',
  disabled,
  onClick
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`${variant} ${className}`}
      onClick={onClick}
    >
      {!beforeIconCode || <Icon icon={getIconCode(beforeIconCode)} />}
      {children}
      {!afterIconCode || <Icon icon={getIconCode(afterIconCode)} />}
    </button>
  );
}
