'use client';

import Game from '@ts/games/game';
import { CoreMetricProps } from '@ts/games/metric';
import { StudioCountryMetric } from '@ts/games/studio';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';
import ObjectMapArray from '@lib/object-map-array';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import FetchMetric from '../../components/FetchMetric';
import StudiosMapChart from '../charts/StuidosMapChart';
import { CountryStudioChartData } from '../types';

/**
 * @param developers - All developers of user's games.
 * @returns Funtion to fetch top countries by games and developers count with top developers.
 */
const fetchStudiosCountries =
  (developers: ObjectMapArray<Game['developers'][number], 'id'>) =>
  /**
   * @param params - Search params with user id.
   * @returns Top countries by games and developers count or error data.
   */
  async (params: {
    userId: string;
  }): Promise<MetricResponse<CountryStudioChartData[]>> => {
    const countriesData = await getMetricClient<StudioCountryMetric[]>(
      '/api/games/studios/countries',
      params
    );

    return {
      error: countriesData.error,
      data: countriesData.data?.map((country, i) => ({
        id: country.country,
        name: country.name,
        index: i,
        count: country.gamesCount,
        developers: country.developers.map(
          (developer) => developers.findByKey(developer)?.name ?? ''
        )
      }))
    };
  };

/**
 * @param props
 * @param props.games - Games of user.
 * @param props.userId - User whose metrics will be fetched.
 * @returns Metric of top countries by games and developers count with top developers.
 */
export default function StudiosCountries({ games, userId }: CoreMetricProps) {
  const developers = games.flatMapByKey<Game['developers'][number], 'id'>(
    (game) => game.developers,
    'id'
  );

  return (
    <MetricWrapper id='developers-countries'>
      <FetchMetric
        fetchMetricData={fetchStudiosCountries(developers)}
        metric={(data) => <StudiosMapChart data={data} />}
        fallback={<ChartSkeleton type='map' />}
        params={{ userId }}
      />
    </MetricWrapper>
  );
}
