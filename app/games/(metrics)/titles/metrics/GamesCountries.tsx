import countries from 'i18n-iso-countries';

import { GameCountryMetric } from '@ts/games/game';

import { getMetricData } from '@lib/server-actions';

import GamesCountriesChart from '../charts/GamesCountriesChart';
import { GameCountryChartData } from '../types';

export default async function GamesCountries() {
  const countriesData = await getMetricData<GameCountryMetric[]>(
    '/api/games/titles/countries',
    []
  );

  const chartData: GameCountryChartData[] = countriesData.map((country, i) => ({
    id: country.country,
    name: countries.getName(country.country, 'en', { select: 'alias' }) ?? '',
    count: country.count,
    country: country.country,
    topGames: country.topGames,
    hours: country.hours,
    index: i
  }));

  return <GamesCountriesChart data={chartData} />;
}
