'use client';

import { Chart } from 'chart.js';
import { RefObject } from 'react';

import {
  ChartContextProps,
  ChartData,
  DisplayFields,
  PeriodChartTransformed,
  TooltipData
} from '@ts/ui/charts-data';

type ChartTooltipProps<DataType extends ChartData> = {
  data?: TooltipData;
  displayFields: DisplayFields<DataType>;
  fieldsNames: Record<keyof DataType, string>;
  ref: RefObject<HTMLDivElement | null>;
};

export default function ChartTooltip<DataType extends ChartData>({
  data,
  displayFields,
  fieldsNames,
  ref
}: ChartTooltipProps<DataType>) {
  if (!data) return;

  const rank = (data.index ?? -1) + 1;
  return (
    <div className='tooltip-container' data-item={data.id} ref={ref}>
      <div className='chart-tooltip' data-rank={data.index}>
        <h3 className='colored'>{data.name}</h3>

        {displayFields.map((field) => (
          <div key={field.toString()} className='tooltip-key'>
            <span>{fieldsNames[field]}: </span>
            <span className='colored'>{data[field] ?? 'no data'}</span>
          </div>
        ))}

        {!rank || (
          <div className='tooltip-badge tooltip-rank'>
            <h3>{rank}</h3>
          </div>
        )}

        {!data.percent || (
          <div className='tooltip-badge tooltip-percent'>
            <h4>{data.percent}%</h4>
          </div>
        )}
      </div>
    </div>
  );
}

export const getTooltip = <DataType extends ChartData>(
  tooltipContainer: RefObject<HTMLDivElement | null>,
  updateTooltip: ChartContextProps['updateTooltip'],
  dataMap: Map<number, DataType>,
  indexMap: Map<number, number>,
  percentsMap?: Map<number, number>
): NonNullable<Chart['options']['plugins']>['tooltip'] => ({
  enabled: false,
  position: 'nearest',
  external: ({ tooltip }) => {
    if (!tooltip.opacity && tooltipContainer.current) {
      tooltipContainer.current.style.opacity = '0';
      return;
    }

    const itemId = Number(tooltip.title[0] ?? '0');
    const data = dataMap.get(itemId);
    const storedId = tooltipContainer.current?.dataset['item'];

    if (tooltipContainer.current) {
      tooltipContainer.current.style.opacity = '1';
      tooltipContainer.current.style.left = `${tooltip.caretX}px`;
      tooltipContainer.current.style.top = `${tooltip.caretY}px`;
    }

    if (!data || storedId?.toString() === itemId.toString()) return;

    updateTooltip(data, indexMap.get(itemId), percentsMap?.get(itemId));
  }
});

export const getPeriodTooltip = <DataType extends PeriodChartTransformed>(
  tooltipContainer: RefObject<HTMLDivElement | null>,
  updateTooltip: ChartContextProps['updateTooltip'],
  dataMap: Map<number, DataType>,
  indexMap: Map<number, number>
): NonNullable<Chart['options']['plugins']>['tooltip'] => ({
  enabled: false,
  position: 'nearest',
  external: ({ tooltip }) => {
    if (!tooltip.opacity && tooltipContainer.current) {
      tooltipContainer.current.style.opacity = '0';
      return;
    }

    const valueKey = tooltip.title[0];
    const itemId = Number(tooltip.dataPoints[0].dataset.label ?? '0');
    const data = dataMap.get(itemId);
    const storedId = tooltipContainer.current?.dataset['item'];

    if (tooltipContainer.current) {
      tooltipContainer.current.style.opacity = '1';
      tooltipContainer.current.style.left = `${tooltip.caretX}px`;
      tooltipContainer.current.style.top = `${tooltip.caretY}px`;
    }

    if (!data || storedId?.toString() === itemId.toString()) return;

    updateTooltip(
      {
        ...data,
        value: data.countByPeriod[valueKey] ?? data.value
      },
      indexMap.get(itemId)
    );
  }
});
