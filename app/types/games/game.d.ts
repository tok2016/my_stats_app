import { IgdbInvolvedStudio } from './studio';

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

export type IgdbRecommendedGame = Pick<
  IgdbGame,
  'id' | 'name' | 'slug' | 'cover'
> & {
  platforms: {
    id: number;
    name: string;
  }[];
  genres: {
    id: number;
    name: string;
  }[];
  rating?: number;
};

export interface IgdbGameTag {
  id: number;
  tags: number[];
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
