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

export default function Table<DataType extends ChartData>({
  id,
  data,
  headers,
  className = '',
  sortField,
  sortDirection,
  onSort
}: TableProps<DataType>) {
  const widths: string[] = [];
  const minWidths: string[] = [];

  Object.values(headers).forEach((header) => {
    widths.push(header.width ?? '1fr');
    minWidths.push(header.minWidth ?? header.width ?? '1fr');
  });

  const columns = widths.join(' ');

  return (
    <div
      id={id}
      className={`table ${Object.keys(headers).length < MIN_COLUMNS_TO_SHOW_BORDERS ? 'hide-borders' : ''} ${className}`}
      style={{
        minWidth: `calc(${minWidths.join(' + ')})`
      }}
    >
      <div className='table-header' style={{ gridTemplateColumns: columns }}>
        {Object.entries(headers).map(([key, header]) => (
          <div
            key={key}
            className={`header-cell ${onSort && header.sort ? 'sort-header' : ''} ${header.headerCellClassName ?? ''}`}
            onClick={() => onSort?.(key as keyof DataType)}
          >
            {header.title}
            {onSort && header.sort && (
              <div
                className={`sort-button ${sortField === key ? 'colored' : ''}`}
              >
                <ChevronUpDown className={!!sortDirection ? 'hidden' : ''} />
                <ChevronUp
                  className={
                    sortDirection === 'asc' && key === sortField ? '' : 'hidden'
                  }
                />
                <ChevronDown
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
          key={value.id}
          className={`table-row ${i === 0 ? 'top-row' : ''}`}
          style={{
            animationDelay: `${ROW_ANIMATION_DELAY * i}ms`,
            gridTemplateColumns: columns
          }}
        >
          {Object.entries(headers).map(([key, header]) => (
            <div
              key={`${value.id}-${key}`}
              className={`table-cell ${header.bodyCellClassName ?? ''}`}
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
