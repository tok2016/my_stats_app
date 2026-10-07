'use client';

import { ChevronDown, ChevronUp, ChevronUpDown } from '@mynaui/icons-react';

import { SortDirection } from '@ts/games/filter';
import { ChartData } from '@ts/ui/charts-data';

type TableHeader<DataType extends ChartData> = {
  title: string;
  renderRow?: (value: DataType, i: number, header: string) => React.ReactNode;
  minWidth?: string;
  width?: string;
  sort?: boolean;
  headerCellClassName?: string;
  bodyCellClassName?: string;
};

type TableProps<DataType extends ChartData> = {
  id?: string;
  data: DataType[];
  headers: Partial<Record<keyof Omit<DataType, 'id'>, TableHeader<DataType>>>;
  className?: string;
  sortField?: keyof DataType;
  sortDirection?: SortDirection;
  onSort?: (field: keyof DataType) => void;
};

const ROW_ANIMATION_DELAY = 75;
const MIN_COLUMNS_TO_SHOW_BORDERS = 4;

/**
 * @param props
 * @param props.id - Table id.
 * @param props.data - Chart data to distribute into cells.
 * @param props.header - Fields with render data that will be columns headers. Default width is 1fr.
 * @param props.sortField - Field that the data sorted by.
 * @param props.sortDirection - Direction of sorted data: ascending / descending.
 * @param props.onSort - On header's sort button click. Delivers field that the date should be sorted by.
 * @param props.className
 * @returns
 */
export default function Table<DataType extends ChartData>({
  id,
  data,
  headers,
  className = '',
  sortField,
  sortDirection,
  onSort
}: TableProps<DataType>) {
  //Calculates width of every grid column and table min width.
  const widths: string[] = [];
  const minWidths: string[] = [];

  Object.values(headers).forEach((header) => {
    widths.push(header.width ?? '1fr');
    minWidths.push(header.minWidth ?? header.width ?? '1fr');
  });

  const columns = widths.join(' ');

  return (
    <div
      role='table'
      id={id}
      className={`table ${Object.keys(headers).length < MIN_COLUMNS_TO_SHOW_BORDERS ? 'table--hide-borders' : ''} ${className}`}
      style={{
        minWidth: `calc(${minWidths.join(' + ')})`
      }}
    >
      <div
        role='rowheader'
        className='table__header'
        style={{ gridTemplateColumns: columns }}
      >
        {Object.entries(headers).map(([key, header]) => (
          <div
            role='columnheader'
            key={key}
            className={`table__header__cell ${onSort && header.sort ? 'table__header__cell--sort' : ''} ${header.headerCellClassName ?? ''}`}
            onClick={() => onSort?.(key as keyof DataType)}
          >
            {header.title}
            {onSort && header.sort && (
              <div
                className={`table__header__cell__sort-button ${sortField === key ? 'colored' : ''}`}
              >
                <ChevronUpDown
                  className={!!sortDirection ? 'hidden' : ''}
                  role='banner'
                />
                <ChevronUp
                  role='banner'
                  className={
                    sortDirection === 'asc' && key === sortField ? '' : 'hidden'
                  }
                />
                <ChevronDown
                  role='banner'
                  className={
                    sortDirection !== 'desc' && key === sortField
                      ? 'hidden'
                      : ''
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {data.map((value, i) => (
        <div
          role='row'
          key={value.id}
          className={`table__row ${i === 0 ? 'top-row' : ''}`}
          style={{
            animationDelay: `${ROW_ANIMATION_DELAY * i}ms`,
            gridTemplateColumns: columns
          }}
        >
          {Object.entries(headers).map(([key, header]) => (
            <div
              role='cell'
              key={`${value.id}-${key}`}
              className={`table__row__cell ${header.bodyCellClassName ?? ''}`}
            >
              {header.renderRow
                ? header.renderRow(value, i, key)
                : value[key as keyof DataType]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
