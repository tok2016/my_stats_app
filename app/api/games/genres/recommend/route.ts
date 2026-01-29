import { NextResponse } from 'next/server';

import { GameCore, IgdbGameTag, IgdbRecommendedGame } from '@ts/games/game';
import { MetricMap, RecommendedMetric } from '@ts/games/metric';

import { gameEndpoint } from '@lib/endpoint-generators';
import { TOP_ENTRIES } from '@lib/games-utils';
import { igdbRequest } from '@lib/igdb';

type GamesStatusMap = Record<number, 'new' | 'old'>;

const MAX_TAGS = 5;
const RECOMMENDED_GAMES = 10;
const MIN_RATING = 75;

const getGamesByGenres1 = async (
  gamesApiIds: string[],
  genres: string[],
  tags: string,
  platforms: string
): Promise<IgdbRecommendedGame[]> => {
  return await igdbRequest<IgdbRecommendedGame>('/games', {
    fields: [
      'name',
      'slug',
      'cover',
      'platforms.name',
      'genres.name',
      'rating'
    ],
    where: `genres = (${genres.join(',')}) & tags = (${tags}) & rating >= ${MIN_RATING} & platforms = (${platforms}) & game_type.type = "Main Game" & id != (${gamesApiIds.join(',')})`,
    sort: {
      field: 'rating',
      direction: 'desc'
    },
    limit: RECOMMENDED_GAMES
  });
};

const getGamesTags = async (
  gamesApiIds: number[]
): Promise<Record<number, number[]>> => {
  const tags = await igdbRequest<IgdbGameTag>('/games', {
    fields: ['tags'],
    where: `id = (${gamesApiIds.join(',')})`,
    limit: gamesApiIds.length
  });

  console.log(tags);

  return Object.fromEntries(tags.map((tag) => [tag.id, tag.tags]));
};

const getRecommnededGames = async (games: GameCore[]) => {
  const genresCount: MetricMap<number> = {};
  const tagsCount: MetricMap<number> = {};
  const gamesMap: GamesStatusMap = {};
  const tags = await getGamesTags(games.map((game) => game.apiId));

  games.forEach((game) => {
    gamesMap[game.apiId] = 'old';

    game.genresIds.forEach((genre) => {
      genresCount[genre] = (genresCount[genre] ?? 0) + 1;
    });

    tags[game.apiId]?.forEach((tag) => {
      tagsCount[tag] = (tagsCount[tag] ?? 0) + 1;
    });
  });

  const platforms = new Set(games.map((game) => game.platformId))
    .keys()
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

  const recommendedFavorite = await getGamesByGenres1(
    Object.keys(gamesMap),
    sortedGenres.slice(0, TOP_ENTRIES),
    favoriteTags,
    platforms
  );

  recommendedFavorite.forEach((game) => {
    gamesMap[game.id] = 'new';
  });

  const recommendations: RecommendedMetric = {
    favorite: recommendedFavorite,
    other: await getGamesByGenres1(
      Object.keys(gamesMap),
      sortedGenres.slice(-TOP_ENTRIES),
      favoriteTags,
      platforms
    )
  };

  return NextResponse.json(recommendations, {
    status: 200,
    statusText: 'Recommendations were calculated'
  });
};

export const GET = gameEndpoint(getRecommnededGames);
