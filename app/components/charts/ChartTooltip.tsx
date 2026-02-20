'use client';

import { TooltipOptions } from 'chart.js';
import { renderToStaticMarkup } from 'react-dom/server';

import { IgdbBasic } from '@ts/games/api-response';
import { ChartData, DoughnutData } from '@ts/ui/charts-data';

type ChartTooltipProps<DataType extends IgdbBasic> = {
  data: DataType;
  displayFields: (keyof Omit<DataType, 'id' | 'name'>)[];
  fieldsNames: Record<keyof DataType, string>;
  index?: number;
  percent?: number;
};

export default function ChartTooltip<DataType extends ChartData>({
  data,
  displayFields,
  fieldsNames,
  index,
  percent
}: ChartTooltipProps<DataType>) {
  const rank = (index ?? -1) + 1;
  return (
    <div className='chart-tooltip' data-rank={index}>
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

      {!percent || (
        <div className='tooltip-badge tooltip-percent'>
          <h4>{percent}%</h4>
        </div>
      )}
    </div>
  );
}

export const getTooltip = <DataType extends DoughnutData>(
  tooltipContainer: HTMLElement | undefined,
  dataMap: Map<string | number, DataType>,
  displayFields: (keyof Omit<DataType, 'id' | 'name'>)[],
  fieldsNames: Record<keyof DataType, string>,
  indexMap: Map<string | number, number>,
  percentsMap: Map<string | number, number>
): Partial<TooltipOptions> => ({
  enabled: false,
  position: 'nearest',
  external: ({ tooltip }) => {
    if (!tooltipContainer) return;
    if (!tooltip.opacity) {
      tooltipContainer.style.opacity = '0';
      return;
    }

    const itemId = tooltip.title[0];
    const data = dataMap.get(itemId);
    if (!data || tooltipContainer?.dataset['item'] === itemId) return;

    const index = indexMap.get(itemId);
    const tooltopElement = renderToStaticMarkup(
      ChartTooltip({
        data,
        displayFields,
        fieldsNames,
        index: index,
        percent: percentsMap.get(itemId)
      })
    );

    tooltipContainer.dataset['item'] = itemId;
    tooltipContainer.dataset['rank'] = index?.toString();
    tooltipContainer.innerHTML = tooltopElement;
    tooltipContainer.style.opacity = '1';
    tooltipContainer.style.left = `${tooltip.caretX}px`;
    tooltipContainer.style.top = `${tooltip.caretY}px`;
  }
});
