import { ChartData } from '@ts/ui/charts-data';

type ChartLegendProps<DataType extends ChartData> = {
  data: DataType[];
  percentsMap?: Map<number | string, number | undefined>;
};

/**
 * @param props
 * @param props.data - Data for chart.
 * @param props.percentsMap - Percents by data. If given and not empty, displays percents as list marks.
 * @returns
 */
export default function ChartLegend<DataType extends ChartData>({
  data,
  percentsMap
}: ChartLegendProps<DataType>) {
  return (
    <ul className='chart-legend'>
      {data.map((value, i) => {
        const percent = percentsMap?.get(value.id);
        return (
          <li key={value.id} className='chart-legend__item' data-rank={i}>
            {percent ? (
              <span className='chart-legend__item__percent'>{percent}%</span>
            ) : (
              <div className='chart-legend__item__mark'></div>
            )}

            <span className='chart-legend__item__title'>{value.name}</span>
          </li>
        );
      })}
    </ul>
  );
}
