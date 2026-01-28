import { NextResponse } from 'next/server';

import { RawgApiListResponse } from '@ts/games/api-response';
import { GameCore, RawgGameShort } from '@ts/games/game';
import { MetricMap, RecommendedMetric } from '@ts/games/metric';

import { AxiosRawgInstanse } from '@lib/axios-instanse';
import { gameEndpoint } from '@lib/endpoint-generators';
import { GAMES_IN_METRIC, TOP_ENTRIES } from '@lib/games-utils';

type GamesStatusMap = Record<number, 'new' | 'old'>;

const MAX_TAGS = 5;
const MAX_SEARCH_ATTEMPTS = 10;

const getGamesByGenres = async (
  games: GamesStatusMap,
  nextUrl: string,
  gamesCount: number = 0,
  attempts: number = 0
) => {
  const response =
    await AxiosRawgInstanse.get<RawgApiListResponse<RawgGameShort>>(nextUrl);

  const newGames = response.data.results
    .map(
      (game): RawgGameShort => ({
        id: game.id,
        genres: game.genres,
        background_image: game.background_image,
        playtime: game.playtime,
        slug: game.slug,
        name: game.name
      })
    )
    .filter((game) => !games[game.id])
    .slice(0, GAMES_IN_METRIC);

  if (
    newGames.length < GAMES_IN_METRIC
    && attempts < MAX_SEARCH_ATTEMPTS
    && response.data.next
  ) {
    const nextGames = await getGamesByGenres(
      games,
      response.data.next,
      gamesCount + newGames.length,
      attempts + 1
    );
    newGames.concat(nextGames);
  } else {
    newGames.forEach((game) => {
      games[game.id] = 'new';
    });
  }

  return newGames;
};

const getRecommnededGames = async (games: GameCore[]) => {
  const genres: MetricMap<number> = {};
  const tags: MetricMap<number> = {};
  const gamesMap: GamesStatusMap = {};

  games.forEach((game) => {
    gamesMap[game.apiId] = 'old';

    game.genresIds.forEach((genre) => {
      genres[genre] = (genres[genre] ?? 0) + 1;
    });

    // game.tagsIds.forEach((tag) => {
    //   tags[tag] = (tags[tag] ?? 0) + 1;
    // });
  });

  const sortedGenres = Object.entries(genres).sort((a, b) => a[1] - b[1]);
  const favoriteTags = Object.entries(tags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_TAGS)
    .join(',');
  const platforms = games.map((game) => game.platformId);

  const searchParams = new URLSearchParams({
    key: process.env.RAWG_KEY ?? '',
    page_size: '20',
    genres: sortedGenres.slice(0, TOP_ENTRIES).join(','),
    tags: favoriteTags,
    metacritic: '80,100',
    exclude_additions: 'true',
    exclude_game_series: 'true',
    ordering: '-metacritic',
    platforms: platforms.join(',')
  });

  const recommendedFavorite = await getGamesByGenres(
    gamesMap,
    `/games?${searchParams.toString()}`
  );

  recommendedFavorite.forEach((game) => {
    gamesMap[game.id] = 'new';
  });

  searchParams.set(
    'genres',
    sortedGenres.slice(sortedGenres.length - TOP_ENTRIES - 1).join(',')
  );

  const recommendations: RecommendedMetric = {
    favorite: recommendedFavorite,
    other: await getGamesByGenres(gamesMap, `/games?${searchParams.toString()}`)
  };

  return NextResponse.json(recommendations, {
    status: 200,
    statusText: 'Recommendations were calculated'
  });
};

export const GET = gameEndpoint(getRecommnededGames);
