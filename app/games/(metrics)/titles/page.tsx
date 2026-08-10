import { Suspense } from 'react';

import { getGamesMap } from '@lib/server-actions';

import Metric from '@components/data-blocks/Metric';

import games from '../../../../mock data/games.json';
import GamePlaydates from './metrics/GamePlayDates';
import GameReleases from './metrics/GameReleases';
import GamesCountries from './metrics/GamesCountries';
import GamesPeriodTops from './metrics/GamesPeriodTops';
import GamesPlaytime from './metrics/GamesPlaytime';
import HighestRatedGames from './metrics/HighestRatedGames';
import SeriesCount from './metrics/SeriesCount';

export default async function GamesTitlesPage() {
  //const gamesMap = await getGamesMap();
  const gamesMap = new Map(
    games.map((game) => [
      game.id,
      {
        ...game,
        releasedAt: new Date(game.releasedAt),
        playDate: new Date(game.playDate)
      }
    ])
  );

  return (
    <>
      <Metric id='games-playtime' title='Your longest played games'>
        <Suspense>
          <GamesPlaytime gamesMap={gamesMap} />
        </Suspense>
      </Metric>

      <Metric id='favorite-games' title='Your favorite games'>
        <Suspense>
          <HighestRatedGames gamesMap={gamesMap} />
        </Suspense>
      </Metric>

      <GamesPeriodTops gamesMap={gamesMap} />

      <Metric id='game-releases' title='Game releases per year'>
        <Suspense>
          <GameReleases />
        </Suspense>
      </Metric>

      <Metric id='game-playdates' title='Your played games per year'>
        <Suspense>
          <GamePlaydates />
        </Suspense>
      </Metric>

      <Metric
        id='countries-by-games'
        title='Your favorite games around the world'
      >
        <Suspense>
          <GamesCountries />
        </Suspense>
      </Metric>

      <Metric id='top-series' title='Your favorite game series'>
        <SeriesCount gamesMap={gamesMap} />
      </Metric>
    </>
  );
}
