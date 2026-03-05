'use client';

import { Chart, ChartType, TooltipModel } from 'chart.js';
import { RefObject } from 'react';

import {
  ChartContextProps,
  ChartData,
  DisplayFields,
  PeriodChartTransformed,
  TooltipData
} from '@ts/ui/charts-data';

import { clamp } from '@lib/utils';

type ChartTooltipProps<DataType extends ChartData> = {
  data?: TooltipData;
  displayFields: DisplayFields<DataType>;
  fieldsNames: Record<keyof DataType, string>;
  ref: RefObject<HTMLDivElement | null>;
};

type TooltipPosition = 'start' | 'center' | 'end';

const SCREEN_MARGIN = 20;

const PositionMult: Record<TooltipPosition, number> = {
  start: 0,
  center: 0.5,
  end: 1
};

export default function ChartTooltip<DataType extends ChartData>({
  data,
  displayFields,
  fieldsNames,
  ref
}: ChartTooltipProps<DataType>) {
  const rank = (data?.index ?? -1) + 1;
  return (
    <div
      style={{ opacity: !data ? '0' : undefined }}
      className='tooltip-container'
      data-item={data?.id}
      ref={ref}
    >
      <div className='chart-tooltip' data-rank={data?.index}>
        <h3 className='colored'>{data?.name}</h3>

        {displayFields.map((field) => (
          <div key={field.toString()} className='tooltip-key'>
            <span>{fieldsNames[field]}: </span>
            <span className='colored'>{data?.[field] ?? 'no data'}</span>
          </div>
        ))}

        {!rank || (
          <div className='tooltip-badge tooltip-rank'>
            <h3>{rank}</h3>
          </div>
        )}

        {!data?.percent || (
          <div className='tooltip-badge tooltip-percent'>
            <h4>{data?.percent}%</h4>
          </div>
        )}
      </div>
    </div>
  );
}

const adjustTooltipPosition = <T extends ChartType>(
  tooltipRef: RefObject<HTMLDivElement | null>,
  tooltip: TooltipModel<T>,
  horizontalPos: TooltipPosition,
  verticalPos: TooltipPosition
) => {
  if (tooltipRef.current) {
    const originX =
      tooltip.caretX
      - tooltipRef.current.offsetWidth * PositionMult[horizontalPos];
    const originY =
      tooltip.caretY
      - tooltipRef.current.offsetHeight * PositionMult[verticalPos];

    tooltipRef.current.style.opacity = '1';

    const { top, left } = tooltip.chart.canvas.getBoundingClientRect();

    const adjustedLeft = clamp(
      originX,
      -left / 2,
      window.innerWidth - tooltipRef.current.offsetWidth - left - SCREEN_MARGIN
    );

    const adjustedTop = clamp(
      originY,
      -top / 2,
      window.innerHeight - tooltipRef.current.offsetHeight - top - SCREEN_MARGIN
    );

    tooltipRef.current.style.left = `${adjustedLeft}px`;
    tooltipRef.current.style.top = `${adjustedTop}px`;
  }
};

const tooltipTitleToNumber = (title?: string) =>
  Number(title?.toString().replace(/\s/g, '') ?? '0');

export const getTooltip = <DataType extends ChartData>(
  tooltipRef: RefObject<HTMLDivElement | null>,
  updateTooltip: ChartContextProps['updateTooltip'],
  dataMap: Map<number, DataType>,
  indexMap: Map<number, number> | undefined,
  horizontalPos: TooltipPosition = 'start',
  verticalPos: TooltipPosition = 'start',
  percentsMap?: Map<number, number>
): NonNullable<Chart['options']['plugins']>['tooltip'] => ({
  enabled: false,
  position: 'nearest',
  external: ({ tooltip }) => {
    if (!tooltip.opacity && tooltipRef.current) {
      tooltipRef.current.style.opacity = '0';
      return;
    }

    const itemId = tooltipTitleToNumber(tooltip.title?.[0]);
    const data = dataMap.get(itemId);
    const storedId = tooltipRef.current?.dataset['item'];
    adjustTooltipPosition(tooltipRef, tooltip, horizontalPos, verticalPos);

    if (!data || storedId?.toString() === itemId.toString()) return;

    updateTooltip(data, indexMap?.get(itemId), percentsMap?.get(itemId));
  }
});

export const getPeriodTooltip = <DataType extends PeriodChartTransformed>(
  tooltipRef: RefObject<HTMLDivElement | null>,
  updateTooltip: ChartContextProps['updateTooltip'],
  dataMap: Map<number, DataType>,
  indexMap: Map<number, number> | undefined,
  horizontalPos: TooltipPosition = 'start',
  verticalPos: TooltipPosition = 'start'
): NonNullable<Chart['options']['plugins']>['tooltip'] => ({
  enabled: false,
  position: 'nearest',
  external: ({ tooltip }) => {
    if (!tooltip.opacity && tooltipRef.current) {
      tooltipRef.current.style.opacity = '0';
      return;
    }

    const valueKey = tooltip.title[0];
    const itemId = tooltipTitleToNumber(tooltip.dataPoints[0].dataset.label);
    const data = dataMap.get(itemId);
    const storedId = tooltipRef.current?.dataset['item'];
    adjustTooltipPosition(tooltipRef, tooltip, horizontalPos, verticalPos);

    if (!data || storedId?.toString() === itemId.toString()) return;

    updateTooltip(
      {
        ...data,
        value: data.countByPeriod[valueKey] ?? data.value
      },
      indexMap?.get(itemId)
    );
  }
});
