'use client';

import Chart from '@components/charts/Chart';
import GameTitle from '@components/data-blocks/GameTitle';

import { GameCountryChartData } from '../types';

type GamesCountriesChartProps = {
  data: GameCountryChartData[];
};

const MAX_GAMES_IN_TOOLTIP = 3;

const renderTopGamesValue = (value?: GameCountryChartData) =>
  value && (
    <ol className='data-block__list'>
      {value.topGames.slice(0, MAX_GAMES_IN_TOOLTIP).map((game) => (
        <li className='data-block__list__item' key={`${game.id}-${value.id}`}>
          <GameTitle game={game} />
        </li>
      ))}
    </ol>
  );

const renderTopGamessKey = () => <></>;

/**
 * @param props
 * @param props.data - Top countries by games count with top games.
 * @returns Map chart of top countries by games count with top games.
 */
export default function GamesCountriesChart({
  data
}: GamesCountriesChartProps) {
  return (
    <Chart
      chartId='games-countries-map'
      type='map'
      data={data}
      displayFields={['topGames']}
      valueFields={['count']}
      defaultValueField='count'
      tooltipProps={{
        showRank: true,
        colored: true,
        enableTransition: false
      }}
      fieldsInfo={{
        id: { name: 'ID' },
        index: { name: '№' },
        percent: { name: '%' },
        name: { name: 'Country' },
        count: { name: 'Games' },
        hours: { name: 'Hours' },
        country: { name: 'Country' },
        topGames: {
          name: 'Favorite games',
          renderKey: renderTopGamessKey,
          renderValue: renderTopGamesValue
        }
      }}
    />
  );
}
