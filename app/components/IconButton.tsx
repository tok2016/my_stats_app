'use client';

import { IconButtonVariant } from '@ts/ui/components-variants';
import { ButtonProps } from '@ts/ui/components-props';

type IconButtonProps = Omit<
  ButtonProps,
  'afterIcon' | 'beforeIcon' | 'children' | 'variant'
> & {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
};

export default function IconButton({
  icon,
  variant = 'link',
  className,
  disabled,
  loading,
  type,
  onClick
}: IconButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`icon ${variant} ${className}`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
