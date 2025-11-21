import { Modules } from '@lib/utils';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outlined'
  | 'link'
  | 'text';

export type IconButtonVariant = Exclude<ButtonVariant, 'outlined'>;

export type InputTheme = 'light' | 'dark';

export type SelectVariant = 'plain' | 'text';

export type Module = (typeof Modules)[number];
