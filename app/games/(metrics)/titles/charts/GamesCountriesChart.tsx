'use client';

import Chart from '@components/charts/Chart';
import GameTableTitle from '@components/data-blocks/GameTitle';

import { GameCountryChartData } from '../types';

type GamesCountriesChartProps = {
  data: GameCountryChartData[];
};

const MAX_GAMES_IN_TOOLTIP = 3;

const renderTopGamesValue = (value?: GameCountryChartData) =>
  value && (
    <ol className='data-block-list'>
      {value.topGames.slice(0, MAX_GAMES_IN_TOOLTIP).map((game) => (
        <li className='data-block-item' key={`${game.id}-${value.id}`}>
          <GameTableTitle game={game} />
        </li>
      ))}
    </ol>
  );

const renderTopGamessKey = () => <></>;

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
      fieldsNames={{
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
