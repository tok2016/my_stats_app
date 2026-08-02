'use client';

import { Chart, ChartType, TooltipModel } from 'chart.js';
import { RefObject } from 'react';

import {
  ChartContextProps,
  ChartData,
  DisplayFields,
  FieldData,
  FieldsInfo,
  PeriodChartTransformed
} from '@ts/ui/charts-data';

import { isNumberOrString, isNumberOrStringArray } from '@lib/type-guards';
import { clamp } from '@lib/utils';

type ChartTooltipProps<DataType extends ChartData> = {
  data?: DataType;
  displayFields: DisplayFields<DataType>;
  fieldsNames: FieldsInfo<DataType>;
  ref: RefObject<HTMLDivElement | null>;
  showRank?: boolean;
  colored?: boolean;
};

type ChartTooltipKeyProps<DataType extends ChartData> = {
  data?: DataType;
  field: keyof DataType;
  fieldData: FieldData<DataType>;
};

type TooltipPosition = 'start' | 'center' | 'end';

type TooltipTransform = Pick<TooltipModel<ChartType>, 'caretX' | 'caretY'> & {
  boundaries: DOMRect;
};

const SCREEN_MARGIN = 20;
const MAX_WIDTH = 18;
const FONT_SIZE = 16;

const PositionMult: Record<TooltipPosition, number> = {
  start: 0,
  center: 0.5,
  end: 1
};

function ChartTooltipKey<DataType extends ChartData>({
  data,
  field,
  fieldData
}: ChartTooltipKeyProps<DataType>) {
  let valueComponent = null;

  if (isNumberOrString(data?.[field]))
    valueComponent = <span className='colored'>{data[field]}</span>;
  else if (isNumberOrStringArray(data?.[field]))
    valueComponent = <span className='colored'>{data[field].join(', ')}</span>;
  else if (!data?.[field]) valueComponent = 'no data';

  if (!valueComponent && !fieldData.renderValue) return;

  return (
    <div className='tooltip-key'>
      {fieldData.renderKey?.(field, data) ?? <span>{fieldData.name}: </span>}
      {fieldData.renderValue?.(data) ?? valueComponent}
    </div>
  );
}

export default function ChartTooltip<DataType extends ChartData>({
  data,
  displayFields,
  fieldsNames,
  ref,
  showRank,
  colored
}: ChartTooltipProps<DataType>) {
  const rank = (data?.index ?? -1) + 1;
  return (
    <div
      style={{
        opacity: !data ? '0' : undefined,
        maxWidth: `${MAX_WIDTH}rem`
      }}
      className='tooltip-container'
      data-item={data?.id}
      ref={ref}
    >
      <div
        className='chart-tooltip'
        data-rank={colored ? data?.index : undefined}
        style={{ maxWidth: '100%' }}
      >
        <h3 className='colored'>{data?.name}</h3>

        {displayFields.map((field) => (
          <ChartTooltipKey
            key={field.toString()}
            field={field}
            data={data}
            fieldData={fieldsNames[field]}
          />
        ))}

        {showRank && rank && (
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

const resetTooltip = (tooltipRef: RefObject<HTMLDivElement | null>) => {
  if (tooltipRef.current) {
    tooltipRef.current.style.opacity = '0';
    tooltipRef.current.style.top = '0px';
    tooltipRef.current.style.left = '0px';
    tooltipRef.current.style.transition = 'none';
  }
};

export const hideTooltip = (tooltipRef: RefObject<HTMLDivElement | null>) => {
  if (tooltipRef.current) tooltipRef.current.style.opacity = '0';
};

const adjustTooltipPosition = (
  tooltipRef: RefObject<HTMLDivElement | null>,
  tooltip: TooltipTransform,
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

    const { top, left } = tooltip.boundaries;

    const absLeft = left + window.pageXOffset;
    const adjustedLeft = clamp(
      originX,
      window.pageXOffset - absLeft + SCREEN_MARGIN,
      window.pageXOffset
        + window.innerWidth
        - MAX_WIDTH * FONT_SIZE
        - absLeft
        - SCREEN_MARGIN
    );

    const absTop = top + window.pageYOffset;
    const adjustedTop = clamp(
      originY,
      window.pageYOffset - absTop + SCREEN_MARGIN,
      window.pageYOffset
        + window.innerHeight
        - tooltipRef.current.offsetHeight
        - absTop
        - SCREEN_MARGIN
    );

    tooltipRef.current.style.left = `${adjustedLeft}px`;
    tooltipRef.current.style.top = `${adjustedTop}px`;

    if (!Number(tooltipRef.current.style.opacity))
      tooltipRef.current.style.opacity = '1';
    else tooltipRef.current.style.transition = 'all 100ms ease';
  }
};

const tooltipTitleToNumber = (title?: string) =>
  Number(title?.toString().replace(/\s/g, '') ?? '0');

export const getTooltip = <DataType extends ChartData>(
  tooltipRef: RefObject<HTMLDivElement | null>,
  updateTooltip: ChartContextProps<DataType>['updateTooltip'],
  dataMap: Map<number | string, DataType>,
  horizontalPos: TooltipPosition = 'start',
  verticalPos: TooltipPosition = 'start'
): NonNullable<Chart['options']['plugins']>['tooltip'] => ({
  enabled: false,
  position: 'nearest',
  external: ({ tooltip }) => {
    if (!tooltip.opacity && tooltipRef.current) {
      resetTooltip(tooltipRef);
      return;
    }

    const itemId = tooltipTitleToNumber(tooltip.title?.[0]);
    const data = dataMap.get(itemId);
    const storedId = tooltipRef.current?.dataset['item'];

    const tooltipTransform: TooltipTransform = {
      caretX: tooltip.caretX,
      caretY: tooltip.caretY,
      boundaries: tooltip.chart.canvas.getBoundingClientRect()
    };

    adjustTooltipPosition(
      tooltipRef,
      tooltipTransform,
      horizontalPos,
      verticalPos
    );

    if (!data || storedId?.toString() === itemId.toString()) return;

    updateTooltip(data);
  }
});

export const getPeriodTooltip = <DataType extends PeriodChartTransformed>(
  tooltipRef: RefObject<HTMLDivElement | null>,
  updateTooltip: ChartContextProps<DataType>['updateTooltip'],
  dataMap: Map<number | string, DataType>,
  horizontalPos: TooltipPosition = 'start',
  verticalPos: TooltipPosition = 'start'
): NonNullable<Chart['options']['plugins']>['tooltip'] => ({
  enabled: false,
  position: 'nearest',
  external: ({ tooltip }) => {
    if (!tooltip.opacity && tooltipRef.current) {
      resetTooltip(tooltipRef);
      return;
    }

    const itemId = tooltipTitleToNumber(tooltip.dataPoints[0].dataset.label);
    const data = dataMap.get(itemId);
    const storedId = tooltipRef.current?.dataset['item'];

    const tooltipTransform: TooltipTransform = {
      caretX: tooltip.caretX,
      caretY: tooltip.caretY,
      boundaries: tooltip.chart.canvas.getBoundingClientRect()
    };

    adjustTooltipPosition(
      tooltipRef,
      tooltipTransform,
      horizontalPos,
      verticalPos
    );

    if (!data || storedId?.toString() === itemId.toString()) return;

    updateTooltip({
      ...data
      //reservedValue: data.countByPeriod[valueKey] ?? data.reservedValue
    });
  }
});

export const updateMapTooltipPos = <DataType extends ChartData>(
  tooltipRef: RefObject<HTMLDivElement | null>,
  mapRef: RefObject<HTMLDivElement | null>,
  target: EventTarget & SVGElement,
  updateTooltip: ChartContextProps<DataType>['updateTooltip'],
  dataMap: Map<number | string, DataType>,
  horizontalPos: TooltipPosition = 'start',
  verticalPos: TooltipPosition = 'start'
) => {
  if (!mapRef.current || !tooltipRef.current) {
    resetTooltip(tooltipRef);
    return;
  }

  const country = target.id;
  const data = dataMap.get(country);
  const storedId = tooltipRef.current?.dataset['item'];

  const { top, left, height, width } = target.getBoundingClientRect();
  const { top: mapTop, left: mapLeft } = mapRef.current.getBoundingClientRect();

  const tooltipTransform: TooltipTransform = {
    caretX: left + width / 2 - mapLeft,
    caretY: top + height / 2 - mapTop,
    boundaries: mapRef.current.getBoundingClientRect()
  };

  if (data && storedId?.toString() !== country.toString()) {
    adjustTooltipPosition(
      tooltipRef,
      tooltipTransform,
      horizontalPos,
      verticalPos
    );

    updateTooltip(data);
  } else {
    hideTooltip(tooltipRef);
    return;
  }
};
