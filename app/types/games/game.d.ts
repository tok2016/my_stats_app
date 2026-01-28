import { RawgGenre } from './genre';
import { PlatformRelease } from './platform';
import { IgdbInvolvedStudio, RawgStudio } from './studio';
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
}

export interface IgdbGame {
  id: number;
  name: string;
  slug: string;
  tags: number[];
  genres: number[];
  platforms: number[];
  themes: number[];
  collections?: IgdbSeries[];
  first_release_date?: number;
  involved_companies?: IgdbInvolvedStudio[];
  cover?: number;
  external_games?: {
    id: number;
    uid: string;
    external_game_source: number;
  }[];
}

export interface GameInSchema {
  userId: string;
  apiId: number;
  storeId?: number;
  name: string;
  platformId: number;
  genresIds: number[];
  themesId: number[];
  developersIds: number[];
  publishersIds: number[];
  seriesId?: number;
  minutes: number;
  releasedAt?: Date;
  cover?: number;
  metascore?: number;
  rating?: number;
  playDate?: Date;
}

export interface GameCore extends GameInSchema {
  id: string;
}

export type GameShort = Pick<
  GameCore,
  'id' | 'apiId' | 'minutes' | 'name' | 'cover' | 'rating'
>;
