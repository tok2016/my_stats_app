import Link from 'next/link';

import Game from '@ts/games/game';
import { SeriesCollapsed } from '@ts/games/series';

import { getMetricData } from '@lib/server-actions';

import EmptyImage from '@components/data-blocks/EmptyImage';
import GameCover from '@components/data-blocks/GameCover';
import MultipleRating from '@components/data-blocks/MultipleRatings';

import GamePropBlock from '../components/GamePropBlock';
import { GameStudiosLinks } from '../components/GameStudiosLinks';

type SeriesCountProps = {
  gamesMap: Map<string, Game>;
};

type TopSeriesProps = {
  series: SeriesCollapsed;
  gamesMap: Map<string, Game>;
};

const MAX_GAMES_IN_SERIES = 5;

function TopSeries({ series, gamesMap }: TopSeriesProps) {
  const games = series.games
    .slice(0, MAX_GAMES_IN_SERIES)
    .map((game) => gamesMap.get(game));
  const percent = Math.round((games.length / series.allGames) * 100);

  return (
    <div className='data-block series-block'>
      <h4 className='colored'>{series.name}</h4>

      <div className='series-games-collage'>
        {Array.from({ length: MAX_GAMES_IN_SERIES }).map((_, i) =>
          games[i] ? (
            <GameCover
              key={`series-game-cover-${i}`}
              game={games[i]}
              className={`series-game-${i}`}
            />
          ) : (
            <EmptyImage
              key={`series-empty-cover-${i}`}
              className={`game-cover series-game-${i}`}
            />
          )
        )}
      </div>

      <GamePropBlock title='Best game'>
        {games[0] ? (
          <Link
            href={`/games/titles/${games[0].id}`}
            className='underline bold'
          >
            {games[0].name}
          </Link>
        ) : (
          <span>—</span>
        )}
      </GamePropBlock>

      <div className='data-block-grid'>
        <GamePropBlock title='Developers'>
          <GameStudiosLinks
            studios={series.developers}
            groupKey={`series-developers-${series.id}`}
          />
        </GamePropBlock>

        <GamePropBlock title='Publishers'>
          <GameStudiosLinks
            studios={series.publishers}
            groupKey={`series-publishers-${series.id}`}
          />
        </GamePropBlock>

        <GamePropBlock title='Games'>
          <span className='colored bold'>{games.length}</span>
          <span>{` (${percent}%)`}</span>
        </GamePropBlock>

        <GamePropBlock title='Playtime'>
          <span className='colored bold'>{series.hours} h.</span>
        </GamePropBlock>
      </div>

      <MultipleRating
        userOwnRating={series.averageRating}
        usersRating={series.usersRating}
        criticsRating={series.criticsRating}
      />
    </div>
  );
}

export default async function SeriesCount({ gamesMap }: SeriesCountProps) {
  const seriesData = await getMetricData<SeriesCollapsed[]>(
    '/api/games/titles/series',
    []
  );

  return (
    <div className='top-series'>
      {seriesData.map((series) => (
        <TopSeries
          key={`${series.id}-series`}
          series={series}
          gamesMap={gamesMap}
        />
      ))}
    </div>
  );
}
