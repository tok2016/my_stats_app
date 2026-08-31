import { NextResponse } from 'next/server';

import {
  IgdbGameTag,
  IgdbRecommendedGame,
  RecommendedGame
} from '@ts/games/game';
import { MetricMap } from '@ts/games/metric';
import { GameEndpointAction } from '@ts/requests';

import { gameEndpoint } from '@lib/endpoint-generators';
import { formRecommendedGame } from '@lib/games/games-utils';
import { igdbRequest } from '@lib/games/igdb';
import { TOP_ENTRIES } from '@lib/utils';

const MAX_TAGS = 5;
const RECOMMENDED_GAMES = 10;
const MIN_RATING = 75;
const MIN_RATINGS_COUNT = 100;

const getGamesByGenres = async (
  gamesApiIds: string[],
  genres: string[],
  tags: string,
  platforms: string
): Promise<RecommendedGame[]> => {
  const genresMixes = [];

  for (let i = 0; i < genres.length; i++) {
    for (let j = i + 1; j < genres.length; j++)
      genresMixes.push(`genres = [${genres[i]},${genres[j]}]`);
  }

  const igdbGames = await igdbRequest<IgdbRecommendedGame>('/games', {
    fields: [
      'name',
      'cover.image_id',
      'screenshots.image_id',
      'external_games.url',
      'external_games.external_game_source.name',
      'external_games.game_release_format',
      'genres.name',
      'rating'
    ],
    where: `(${genresMixes.join(' | ')}) & tags = (${tags}) & rating >= ${MIN_RATING} & rating_count >= ${MIN_RATINGS_COUNT} & platforms = (${platforms}) & game_type.type = "Main Game" & id != (${gamesApiIds.join(',')})`,
    sort: {
      field: 'rating',
      direction: 'desc'
    },
    limit: RECOMMENDED_GAMES
  });

  return igdbGames.map(formRecommendedGame);
};

const getGamesTags = async (
  gamesApiIds: number[]
): Promise<Record<number, number[]>> => {
  const tags = await igdbRequest<IgdbGameTag>('/games', {
    fields: ['tags', 'name'],
    where: `id = (${gamesApiIds.join(',')})`,
    limit: gamesApiIds.length
  });

  return Object.fromEntries(tags.map((tag) => [tag.id, tag.tags]));
};

const getRecommnededGames: GameEndpointAction<
  '/api/games/genres/recommend'
> = async (_req, _params, games) => {
  const genresCount: MetricMap<number> = {};
  const tagsCount: MetricMap<number> = {};
  const tags = await getGamesTags(games.map((game) => game.apiId).toArray());

  games.forEach((game) => {
    game.genresIds.forEach((genre) => {
      genresCount[genre] = (genresCount[genre] ?? 0) + 1;
    });

    tags[game.apiId]?.forEach((tag) => {
      tagsCount[tag] = (tagsCount[tag] ?? 0) + 1;
    });
  });

  const platforms = new Set(games.map((game) => game.platformId))
    .values()
    .toArray()
    .join(',');

  const sortedGenres = Object.entries(genresCount)
    .sort((a, b) => b[1] - a[1])
    .map(([genre]) => genre);

  const favoriteTags = Object.entries(tagsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_TAGS)
    .map(([tag]) => tag)
    .join(',');

  const recommendedGames = await getGamesByGenres(
    games.map((game) => game.id).toArray(),
    sortedGenres.slice(0, TOP_ENTRIES),
    favoriteTags,
    platforms
  );

  return NextResponse.json(recommendedGames, {
    status: 200,
    statusText: 'Recommendations were calculated'
  });
};

export const GET = gameEndpoint(getRecommnededGames);
