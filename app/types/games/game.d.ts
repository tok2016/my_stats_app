import { IgdbBasic } from './api-response';
import { IgdbGenre } from './genre';
import { IgdbImage } from './image';
import { IgdbPlatform } from './platform';
import { ExternalRatings } from './rating';
import { IgdbSeries } from './series';
import {
  IgdbInvolvedStudio,
  IgdbInvolvedStuioExtended,
  IgdbStudioBase
} from './studio';

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

export interface IgdbGameSearch extends IgdbBasic {
  cover?: IgdbImage;
  platfroms: IgdbBasic[];
  genres: IgdbGenre[];
  first_release_date?: number;
}

export interface IgdbGame extends IgdbBasic {
  genres: number[];
  platforms: number[];
  themes: number[];
  collections?: IgdbSeries[];
  first_release_date?: number;
  involved_companies?: IgdbInvolvedStudio[];
  cover?: IgdbImage;
  external_games?: {
    id: number;
    uid: string;
    external_game_source: number;
  }[];
}

export type IgdbRecommendedGame = Pick<IgdbGame, 'id' | 'name' | 'cover'> & {
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

export interface IgdbGameTag extends IgdbBasic {
  tags: number[];
}

export interface GameUpdate {
  minutes: number;
  rating?: number;
  playDate?: Date;
}

export interface NewGame extends GameUpdate {
  apiId: number;
  storeId?: number;
  name: string;
  platformId: number;
  genresIds: number[];
  themesId: number[];
  developersIds: number[];
  publishersIds: number[];
  seriesId?: number;
  releasedAt?: Date;
  cover?: string;
}

export interface GameInSchema extends NewGame {
  userId: string;
}

export interface GameCore extends GameInSchema {
  id: string;
}

export type GameShort = Pick<
  GameCore,
  'id' | 'apiId' | 'minutes' | 'name' | 'cover' | 'rating'
>;

export interface IgdbGameFull extends IgdbBasic {
  first_release_date?: number;
  cover?: IgdbImage;
  genres: IgdbGenre[];
  platforms: IgdbPlatform[];
  collections?: IgdbSeries[];
  involved_companies?: IgdbInvolvedStuioExtended[];
  aggregated_rating?: number;
  rating?: number;
}

export interface SearchGame {
  apiId: number;
  name: string;
  genres: IgdbGenre[];
  platforms: IgdbBasic[];
  developers: IgdbInvolvedStuioExtended[];
  publishers: IgdbInvolvedStuioExtended[];
  releasedAt?: Date;
  cover?: string;
  series?: IgdbSeries;
}

export default interface Game extends ExternalRatings {
  id: string;
  name: string;
  apiId: number;
  genres: IgdbGenre[];
  platform?: IgdbPlatform;
  developers: IgdbStudioBase[];
  publishers: IgdbStudioBase[];
  series?: IgdbSeries;
  cover?: string;
  hours: number;
  releasedAt?: Date;
  rating?: number;
  playDate?: Date;
}

export interface GameCountryMetric {
  country: number;
  count: number;
  minutes: number;
  topGames: GameShort[];
}

export type IgdbGameRatings = Pick<
  IgdbGameFull,
  'id' | 'aggregated_rating' | 'rating'
>;

export type IgdbGameRatingsStudios = IgdbGameRatings & {
  involved_companies?: IgdbInvolvedStuioExtended[];
};
