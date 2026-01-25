import { RawgGenre } from './genre';
import { PlatformRelease } from './platform';
import { EsrbRating } from './rating';
import { RawgStudio } from './studio';
import { RawgTag } from './tag';

export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  has_community_visible_stats: boolean;
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
  playtime_deck_forever: number;
  rtime_last_played: number;
  playtime_disconnected: number;
}

export interface SteamGamesList {
  game_count: number;
  games: SteamGame[];
}

export interface RawgGameShort {
  id: number;
  slug: string;
  name: string;
  playtime: number;
  background_image: string;
  genres: RawgGenre[];
}

export interface RawgGame extends RawgGameShort {
  metacritic: number;
  released: string;
  game_series_count: number;
  platforms: PlatformRelease[];
  developers: RawgStudio[];
  tags: RawgTag[];
  publishers: RawgStudio[];
  esrb_rating: EsrbRating;
}

export interface GameInSchema {
  userId: string;
  apiId: number;
  platformId: string;
  genresIds: number[];
  tagsIds: number[];
  developersIds: number[];
  publishersIds: number[];
  name: string;
  minutes: number;
  esrbRatingId?: number;
  releasedAt?: Date;
  image?: string;
  metascore?: number;
  rating?: number;
  rank?: number;
  playDate?: Date;
}

export interface GameCore extends GameInSchema {
  id: string;
}

export type GameShort = Pick<
  GameCore,
  'id' | 'apiId' | 'minutes' | 'name' | 'image' | 'rating'
>;
