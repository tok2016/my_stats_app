'use client';

import { ChevronDown, ChevronUp, ChevronUpDown } from '@mynaui/icons-react';

import { SortDirection } from '@ts/games/filter';
import { ChartData } from '@ts/ui/charts-data';

type TableHeader<DataType extends ChartData> = {
  title: string;
  renderRow?: (value: DataType, i: number, header: string) => React.ReactNode;
  width?: string;
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
  const columnsWidths = Object.values(headers)
    .map((header) => header.width ?? '1fr')
    .join(' ');

  return (
    <div
      id={id}
      className={`table ${Object.keys(headers).length < MIN_COLUMNS_TO_SHOW_BORDERS ? 'hide-borders' : ''} ${className}`}
    >
      <div
        className='table-header'
        style={{ gridTemplateColumns: columnsWidths }}
      >
        {Object.entries(headers).map(([key, header]) => (
          <div
            key={key}
            className={`header-cell ${onSort ? 'sort-header' : ''}`}
            onClick={() => onSort?.(key as keyof DataType)}
          >
            {header.title}
            {!onSort || (
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

      <div className='table-body'>
        {data.map((value, i) => (
          <div
            key={value.id}
            className={`table-row ${i === 0 ? 'top-row' : ''}`}
            style={{
              animationDelay: `${ROW_ANIMATION_DELAY * i}ms`,
              gridTemplateColumns: columnsWidths
            }}
          >
            {Object.entries(headers).map(([key, header]) => (
              <div key={`${value.id}-${key}`} className='table-cell'>
                {header.renderRow
                  ? header.renderRow(value, i, key)
                  : value[key as keyof DataType]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
