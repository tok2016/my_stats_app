import {
  ButtonVariants,
  InputThemes,
  Modules,
  SelectVariants
} from '@lib/utils';

export type ButtonVariant = (typeof ButtonVariants)[number];

export type InputTheme = (typeof InputThemes)[number];

export type SelectVariant = (typeof SelectVariants)[number];

export type Module = (typeof Modules)[number];
