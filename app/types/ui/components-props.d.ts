import { type ReactNode } from 'react';

export interface InputBaseProps {
  label?: ReactNode;
  id: string;
  name: string;
  className?: string;
  hint?: ReactNode;
  errorHint?: ReactNode;
}

export interface TextInputProps extends InputBaseProps, InputHintProps {
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

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

export type SidebarButtonProps = Omit<SidebarSubButtonProps, 'href'> & {
  href?: string;
} & {
  icon: ReactNode;
  subButtons?: SidebarSubButtonProps[];
  onClick?: () => void;
};
