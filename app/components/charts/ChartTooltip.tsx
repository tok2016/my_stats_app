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
  fieldsInfo: FieldsInfo<DataType>;
  ref: RefObject<HTMLDivElement | null>;
  showRank?: boolean;
  colored?: boolean;
};

type ChartTooltipFieldProps<DataType extends ChartData> = {
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

/**
 * Coeffients to relative position number value by position type.
 */
const PositionMult: Record<TooltipPosition, number> = {
  start: 0,
  center: 0.5,
  end: 1
};

/**
 * @param props
 * @param props.data - Data entry which the tooltip points to.
 * @param props.field - Field of data which value will be displayed on tooltip.
 * @param props.fieldData - Data about field render including it's name and render function.
 * @returns Value of given field of data for tooltip.
 */
function ChartTooltipField<DataType extends ChartData>({
  data,
  field,
  fieldData
}: ChartTooltipFieldProps<DataType>) {
  let valueComponent = null;

  //Default value component by it's type.
  if (isNumberOrString(data?.[field]))
    valueComponent = <span className='colored'>{data[field]}</span>;
  else if (isNumberOrStringArray(data?.[field]))
    valueComponent = <span className='colored'>{data[field].join(', ')}</span>;
  else if (!data?.[field]) valueComponent = 'no data';

  //Skips field string if render function is not provided and default value component was not assigned.
  if (!valueComponent && !fieldData.renderValue) return;

  return (
    <div className='tooltip__content__key'>
      {fieldData.renderKey?.(field, data) ?? <span>{fieldData.name}: </span>}
      {fieldData.renderValue?.(data) ?? valueComponent}
    </div>
  );
}

/**
 * Displays displays given data which chart element was hovered.
 * Always displays name of data. Displays percents if given.
 * @param props
 * @param props.data - Data entry which the tooltip points to.
 * @param props.displayFields - Fields to display on tooltip.
 * @param props.fieldsInfo - Fields render data with names that for tooltip and chart.
 * @param props.ref - Referense to control the tooltip by.
 * @param props.showRank - If true, renders rank of given data among other chart data. Defined by index field.
 * @param props.colored - If true, colors tooltip highlight text and border by data rank.
 * @returns Tooltip that displays given data.
 */
export default function ChartTooltip<DataType extends ChartData>({
  data,
  displayFields,
  fieldsInfo,
  ref,
  showRank,
  colored
}: ChartTooltipProps<DataType>) {
  const rank = (data?.index ?? -1) + 1;

  //Hides tooltip if data is not given.
  return (
    <div
      style={{
        opacity: !data ? '0' : undefined,
        maxWidth: `${MAX_WIDTH}rem`
      }}
      className='tooltip'
      data-item={data?.id}
      ref={ref}
    >
      <div
        className='tooltip__content'
        data-rank={colored ? data?.index : undefined}
        style={{ maxWidth: '100%' }}
      >
        <h3 className='tooltip__content__title colored'>{data?.name}</h3>

        {displayFields.map((field) => (
          <ChartTooltipField
            key={field.toString()}
            field={field}
            data={data}
            fieldData={fieldsInfo[field]}
          />
        ))}

        {showRank && rank && (
          <div className='tooltip__content__badge tooltip__content__badge--rank'>
            <h3>{rank}</h3>
          </div>
        )}

        {!data?.percent || (
          <div className='tooltip__content__badge tooltip__content__badge--percent'>
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

/**
 * Makes tooltip invisible.
 * @param tooltipRef - Tooltip referense.
 */
export const hideTooltip = (tooltipRef: RefObject<HTMLDivElement | null>) => {
  if (tooltipRef.current) tooltipRef.current.style.opacity = '0';
};

/**
 * Adjusts tooltip position, so it won't get beyond the screen.
 * @param tooltipRef - Tooltip component referense.
 * @param tooltipTransform - Tooltip transform with values from default chart.js tooltip.
 * @param horizontalPos - Horizontal position relative to hovered chart element.
 * @param verticalPos - Vertical position relative to hovered chart element.
 * @param enableTransition - If true, sets transition of tooltip positions.
 */
const adjustTooltipPosition = (
  tooltipRef: RefObject<HTMLDivElement | null>,
  tooltipTransform: TooltipTransform,
  horizontalPos: TooltipPosition,
  verticalPos: TooltipPosition,
  enableTransition: boolean = true
) => {
  if (tooltipRef.current) {
    //X and Y positions with given relative position taken in account.
    const originX =
      tooltipTransform.caretX
      - tooltipRef.current.offsetWidth * PositionMult[horizontalPos];
    const originY =
      tooltipTransform.caretY
      - tooltipRef.current.offsetHeight * PositionMult[verticalPos];

    //Chart.js return position relative to viewport.
    const { top, left } = tooltipTransform.boundaries;

    //Clamps relative left position between chart left and right borders with viewport position taken in account.
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

    //Clamps relative top position between chart top and bottom borders with viewport position taken in account.
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

    //Makes tooltip visible.
    if (!Number(tooltipRef.current.style.opacity))
      tooltipRef.current.style.opacity = '1';
    else if (enableTransition)
      tooltipRef.current.style.transition = 'all 100ms ease';
  }
};

const tooltipTitleToNumber = (title?: string) =>
  Number(title?.toString().replace(/[\s,]/g, '') ?? '0');

/**
 * Tooltip options and rerender function for chart options.
 * Chart.js does not have render function that would accept React node.
 * Gives tooltip the data that will be displayed.
 * @param tooltipRef - Tooltip component referense.
 * @param updateTooltip - Update state function that will force tooltip rerender.
 * @param dataMap - Map of data and its id.
 * @param horizontalPos - Horizontal position relative to hovered chart element.
 * @param verticalPos - Vertical position relative to hovered chart element.
 * @param enableTransition - If true, sets transition of tooltip positions.
 * @returns Tooltip options for chart with rerender function.
 */
export const setTooltip = <DataType extends ChartData>(
  tooltipRef: RefObject<HTMLDivElement | null>,
  updateTooltip: ChartContextProps<DataType>['updateTooltip'],
  dataMap: Map<number | string, DataType>,
  horizontalPos: TooltipPosition = 'start',
  verticalPos: TooltipPosition = 'start',
  enableTransition: boolean = true
): NonNullable<Chart['options']['plugins']>['tooltip'] => ({
  enabled: false,
  position: 'nearest',
  external: ({ tooltip: defaultTooltip }) => {
    //Default tooltip is the tooltip implemented by chart.js.
    //If opacity of default tooltip equals 0 hides tooltip component and resets its position.
    if (!defaultTooltip.opacity && tooltipRef.current) {
      resetTooltip(tooltipRef);
      return;
    }

    //Finds data by id that was set in global labels of data elements.
    //Default tooltips renders global label in title.
    const itemId = tooltipTitleToNumber(defaultTooltip.title?.[0]);
    const data = dataMap.get(itemId);

    //Calculates new tooltip position. Default tooltip contains new position that is near the hovered element.
    const tooltipTransform: TooltipTransform = {
      caretX: defaultTooltip.caretX,
      caretY: defaultTooltip.caretY,
      boundaries: defaultTooltip.chart.canvas.getBoundingClientRect()
    };

    adjustTooltipPosition(
      tooltipRef,
      tooltipTransform,
      horizontalPos,
      verticalPos,
      enableTransition
    );

    //If found data is the same as the one that tooltip is pointing to, skips rerender.
    const storedId = tooltipRef.current?.dataset['item'];
    if (!data || storedId?.toString() === itemId.toString()) return;

    updateTooltip(data);
  }
});

/**
 * Tooltip options and rerender function for period bar chart options.
 * Chart.js does not have render function that would accept React node.
 * Gives tooltip the data that will be displayed.
 * @param tooltipRef - Tooltip component referense.
 * @param updateTooltip - Update state function that will force tooltip rerender.
 * @param dataMap - Map of data and its id.
 * @param
 * @param horizontalPos - Horizontal position relative to hovered chart element.
 * @param verticalPos - Vertical position relative to hovered chart element.
 * @param enableTransition - If true, sets transition of tooltip positions.
 * @returns Tooltip options for period bar chart with rerender function.
 */
export const setPeriodTooltip = <
  DataType extends PeriodChartTransformed,
  ValueKey extends keyof DataType
>(
  tooltipRef: RefObject<HTMLDivElement | null>,
  updateTooltip: ChartContextProps<DataType>['updateTooltip'],
  dataMap: Map<number | string, DataType>,
  valueField: ValueKey,
  horizontalPos: TooltipPosition = 'start',
  verticalPos: TooltipPosition = 'start',
  enableTransition: boolean = true
): NonNullable<Chart['options']['plugins']>['tooltip'] => ({
  enabled: false,
  position: 'nearest',
  external: ({ tooltip }) => {
    //Default tooltip is the tooltip implemented by chart.js.
    //If opacity of default tooltip equals 0 hides tooltip component and resets its position.
    if (!tooltip.opacity && tooltipRef.current) {
      resetTooltip(tooltipRef);
      return;
    }

    //Finds data by id. Period bar has multiple datasets, so data id is stored in label of item's dataset.
    //Default tooltips renders local label of data in dataPoints.
    const itemId = tooltipTitleToNumber(tooltip.dataPoints[0].dataset.label);
    const data = dataMap.get(itemId);

    //Calculates new tooltip position. Default tooltip contains new position that is near the hovered element.
    const tooltipTransform: TooltipTransform = {
      caretX: tooltip.caretX,
      caretY: tooltip.caretY,
      boundaries: tooltip.chart.canvas.getBoundingClientRect()
    };

    adjustTooltipPosition(
      tooltipRef,
      tooltipTransform,
      horizontalPos,
      verticalPos,
      enableTransition
    );

    if (!data) return;

    //Changes general value of field to it's period value.
    const period = tooltip.title?.[0];
    if (data.countByPeriod[period])
      data[valueField] = data.countByPeriod[period] as DataType[ValueKey];

    updateTooltip(data);
  }
});

/**
 * Gives tooltip the data that will be displayed. Forces rerender of tooltip.
 * @param tooltipRef - Tooltip component referense.
 * @param mapRef - Map chart referense.
 * @param target - Mouse target.
 * @param updateTooltip - Update state function that will force tooltip rerender.
 * @param dataMap - Map of data and its id.
 * @param horizontalPos - Horizontal position relative to hovered chart element.
 * @param verticalPos - Vertical position relative to hovered chart element.
 * @param enableTransition - If true, sets transition of tooltip positions.
 */
export const updateMapTooltipPos = <DataType extends ChartData>(
  tooltipRef: RefObject<HTMLDivElement | null>,
  mapRef: RefObject<HTMLDivElement | null>,
  target: EventTarget & SVGElement,
  updateTooltip: ChartContextProps<DataType>['updateTooltip'],
  dataMap: Map<number | string, DataType>,
  horizontalPos: TooltipPosition = 'start',
  verticalPos: TooltipPosition = 'start',
  enableTransition: boolean = true
) => {
  if (!mapRef.current || !tooltipRef.current) {
    resetTooltip(tooltipRef);
    return;
  }

  //Country code is stored as ID of path element in svg map.
  const country = target.id;
  const data = dataMap.get(country);

  //Hides tooltip if it points to the same data without position reset.
  //It helps avoid frequent positions calculations and rerender caused by rough borders of countries.
  const storedId = tooltipRef.current?.dataset['item'];
  if (!data || storedId?.toString() === country.toString()) {
    hideTooltip(tooltipRef);
    return;
  }

  //Calculates new position of tooltip.
  const {
    top: targetTop,
    left: targetLeft,
    height: targetHeight,
    width: targetWidth
  } = target.getBoundingClientRect();
  const { top: mapTop, left: mapLeft } = mapRef.current.getBoundingClientRect();

  const tooltipTransform: TooltipTransform = {
    caretX: targetLeft + targetWidth / 2 - mapLeft,
    caretY: targetTop + targetHeight / 2 - mapTop,
    boundaries: mapRef.current.getBoundingClientRect()
  };

  //Adjusts tooltip position.
  adjustTooltipPosition(
    tooltipRef,
    tooltipTransform,
    horizontalPos,
    verticalPos,
    enableTransition
  );

  updateTooltip(data);
};
