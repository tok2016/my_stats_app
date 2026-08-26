import countries from 'i18n-iso-countries';

import Game from '@ts/games/game';
import { StudioCountryMetric } from '@ts/games/studio';

import ObjectMapArray from '@lib/object-map-array';
import { getMetricData } from '@lib/server-actions';

import StudiosMapChart from '../charts/StuidosMapChart';
import { CountryStudioChartData } from '../types';

type StudiosCountriesProps = {
  developers: ObjectMapArray<Game['developers'][number], 'id'>;
};

export default async function StudiosCountries({
  developers
}: StudiosCountriesProps) {
  const countriesData = await getMetricData<StudioCountryMetric[]>(
    '/api/games/studios/countries',
    []
  );

  const countriesChartData: CountryStudioChartData[] = countriesData
    .map((country, i) => ({
      id: country.country,
      name: countries.getName(country.country, 'en', { select: 'alias' }) ?? '',
      index: i,
      count: country.gamesCount,
      developers: country.developers.map(
        (developer) => developers.findByKey(developer)?.name ?? ''
      )
    }))
    .filter((country) => !!country.name);

  return <StudiosMapChart data={countriesChartData} />;
}
