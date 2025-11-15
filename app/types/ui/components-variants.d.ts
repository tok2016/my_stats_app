import { Modules } from '@lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outlined';

export type IconButtonVariant = Exclude<ButtonVariant, 'outlined'> | 'text';

export type InputTheme = 'light' | 'dark';

export type SelectVariant = 'plain' | 'text';

export type Module = (typeof Modules)[number];
