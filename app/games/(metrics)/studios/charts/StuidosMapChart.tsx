'use client';

import Chart from '@components/charts/Chart';
import RankIcon from '@components/data-blocks/RankIcon';

import { CountryStudioChartData } from '../types';

type StudiosMapChartProps = {
  data: CountryStudioChartData[];
};

const renderDevelopersTop = (data?: CountryStudioChartData) =>
  data && (
    <ol className='data-block-list'>
      {data.developers.map((developer, i) => (
        <li
          className={`data-block-item ${i === 0 && 'colored bold'} ranked-entry`}
          key={`${developer}-${data.id}`}
        >
          <RankIcon rank={i} />
          <span>{developer}</span>
        </li>
      ))}
    </ol>
  );

const renderDevelopersKey = () => <></>;

export default function StudiosMapChart({ data }: StudiosMapChartProps) {
  return (
    <Chart
      chartId='developers-map'
      type='map'
      data={data}
      displayFields={['developers']}
      valueFields={['count']}
      defaultValueField='count'
      fieldsNames={{
        id: { name: 'ID' },
        index: { name: '№' },
        percent: { name: '%' },
        name: { name: 'Country' },
        developers: {
          name: 'Top developers',
          renderKey: renderDevelopersKey,
          renderValue: renderDevelopersTop
        },
        count: { name: 'Games' }
      }}
    />
  );
}
