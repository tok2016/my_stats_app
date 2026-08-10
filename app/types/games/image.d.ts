export type IgdbImageSize =
  | 'cover_small'
  | 'screenshot_med'
  | 'cover_big'
  | 'logo_med'
  | 'screenshot_big'
  | 'screenshot_huge'
  | 'thumb'
  | 'micro'
  | '720p'
  | '1080p';

export interface IgdbImage {
  id: number;
  image_id: string;
}
