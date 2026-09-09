import { type MouseEvent, type ReactNode } from 'react';

import { ButtonStatus, ButtonVariant } from './components-variants';

export interface InputBaseProps {
  label?: ReactNode;
  id: string;
  name: string;
  className?: string;
  hint?: ReactNode;
  errorHint?: ReactNode;
  disabled?: boolean;
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

export type SearchBaseProps = Omit<
  InputBaseProps,
  'label' | 'errorHint' | 'hint'
> & {
  placeholder?: string;
};

export type ButtonProps = {
  children?: ReactNode;
  variant?: ButtonVariant;
  status?: ButtonStatus;
  beforeIcon?: ReactNode;
  afterIcon?: ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: HTMLButtonElement['type'];
  onClick?: (evt: MouseEvent) => void;
};

export type ButtonStyle = Omit<ButtonProps, 'type' | 'children' | 'loading'>;

export type Option = {
  value: string;
  label: string;
  key: string;
};

export interface SliderProps extends InputBaseProps {
  min: number;
  max: number;
}

export type PathInfo = {
  name: string;
  label: string;
  disabled?: boolean;
};

export type SidebarSubButtonProps = PathInfo & {
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

export type SidebarModuleProps = {
  path: string;
  expand?: () => void;
};
