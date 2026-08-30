import Link from 'next/link';

import Game from '@ts/games/game';
import { SeriesCollapsed } from '@ts/games/series';

import ObjectMapArray from '@lib/object-map-array';
import { getMetricData } from '@lib/server-actions';

import EmptyImage from '@components/data-blocks/EmptyImage';
import GameCover from '@components/data-blocks/GameCover';
import { LinksString } from '@components/data-blocks/LinksString';
import MultipleRating from '@components/data-blocks/MultipleRatings';

import PropBlock from '../../../../components/data-blocks/PropBlock';
import { MAX_GAMES_IN_SERIES } from '../utils';

type SeriesCountProps = {
  games: ObjectMapArray<Game, 'id'>;
};

type TopSeriesProps = {
  series: SeriesCollapsed;
  games: ObjectMapArray<Game, 'id'>;
};

function TopSeries({ series, games }: TopSeriesProps) {
  const seriesGames = series.games
    .slice(0, MAX_GAMES_IN_SERIES)
    .map((game) => games.findByKey(game));
  const percent = Math.round((seriesGames.length / series.allGames) * 100);

  return (
    <div className='data-block series-block'>
      <h4 className='colored'>{series.name}</h4>

      <div className='series-games-collage'>
        {Array.from({ length: MAX_GAMES_IN_SERIES }).map((_, i) =>
          seriesGames[i] ? (
            <GameCover
              key={`series-game-cover-${i}`}
              game={seriesGames[i]}
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

      <PropBlock title='Best game' className='min'>
        {seriesGames[0] ? (
          <Link
            href={`/games/titles/${seriesGames[0].id}`}
            className='underline wide'
          >
            {seriesGames[0].name}
          </Link>
        ) : (
          <span>—</span>
        )}
      </PropBlock>

      <div className='data-block-grid min'>
        <PropBlock title='Developers'>
          {series.developers.length ? (
            <LinksString
              baseEndpoint='/games/studios'
              items={series.developers}
              groupKey={`series-developers-${series.id}`}
            />
          ) : (
            <span>—</span>
          )}
        </PropBlock>

        <PropBlock title='Publishers'>
          {series.publishers.length ? (
            <LinksString
              baseEndpoint='/games/studios'
              items={series.publishers}
              groupKey={`series-publishers-${series.id}`}
            />
          ) : (
            <span>—</span>
          )}
        </PropBlock>

        <PropBlock title='Games'>
          <span className='colored bold'>{seriesGames.length}</span>
          <span>{` (${percent}%)`}</span>
        </PropBlock>

        <PropBlock title='Playtime'>
          <span className='colored bold'>{series.hours} h.</span>
        </PropBlock>
      </div>

      <MultipleRating
        userOwnRating={series.averageRating}
        usersRating={series.usersRating}
        criticsRating={series.criticsRating}
      />
    </div>
  );
}

export default async function SeriesCount({ games }: SeriesCountProps) {
  const seriesData = await getMetricData<SeriesCollapsed[]>(
    '/api/games/titles/series',
    []
  );

  return (
    <div className='top-series'>
      {seriesData.map((series) => (
        <TopSeries key={`${series.id}-series`} series={series} games={games} />
      ))}
    </div>
  );
}
