import { type ReactNode, type MouseEvent } from 'react';

import { ButtonVariant } from './components-variants';

export interface InputBaseProps {
  label?: ReactNode;
  id: string;
  name: string;
  className?: string;
  hint?: ReactNode;
  errorHint?: ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface TextInputProps extends InputBaseProps, InputHintProps {
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export type SearchProps = Omit<
  InputBaseProps,
  'label' | 'errorHint' | 'hint'
> & {
  placeholder?: string;
  onSearch: (query: string) => void;
};

export type ButtonProps = {
  children?: ReactNode;
  variant?: ButtonVariant;
  beforeIcon?: ReactNode;
  afterIcon?: ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: HTMLButtonElement['type'];
  onClick?: (evt: MouseEvent) => void;
};

export type Option = {
  value: string;
  label: string;
};

export interface SliderProps extends InputBaseProps {
  min: number;
  max: number;
}

export type SidebarSubButtonProps = {
  name: string;
  label: string;
  href: string;
  loading?: boolean;
};

export type SidebarOptionProps = Omit<SidebarSubButtonProps, 'href'> & {
  href?: string;
} & {
  icon: ReactNode;
  subButtons?: SidebarSubButtonProps[];
  onClick?: () => void;
};
