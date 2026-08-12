import { type HTMLInputTypeAttribute } from 'react';

import { Modules } from '@lib/utils';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outlined'
  | 'link'
  | 'text';

export type ButtonStatus = '' | 'error' | 'warning' | 'success';

export type IconButtonVariant = Exclude<ButtonVariant, 'outlined'>;

export type InputTheme = 'light' | 'dark';

export type InputType = Extract<
  HTMLInputTypeAttribute,
  'text' | 'password' | 'date' | 'email'
>;

export type SelectVariant = 'plain' | 'text';

export type Module = (typeof Modules)[number];
