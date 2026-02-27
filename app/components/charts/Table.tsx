'use client';

import { ChevronDown, ChevronUp, ChevronUpDown } from '@mynaui/icons-react';
import { useEffect, useRef } from 'react';

import { SortDirection } from '@ts/games/filter';
import { ChartData } from '@ts/ui/charts-data';

type TableProps<DataType extends ChartData> = {
  id?: string;
  data: DataType[];
  headers: Partial<Record<keyof Omit<DataType, 'id'>, string>>;
  className?: string;
  sortField?: keyof DataType;
  sortDirection?: SortDirection;
  rowContent: (data: DataType, index: number) => React.ReactNode;
  onSort?: (field: keyof DataType) => void;
};

const ROW_ANIMATION_DELAY = 75;

export default function Table<DataType extends ChartData>({
  id,
  data,
  headers,
  className = '',
  sortField,
  sortDirection,
  rowContent,
  onSort
}: TableProps<DataType>) {
  const headerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current && rowRef.current) {
      headerRef.current.style.width = `${rowRef.current.clientWidth}px`;
    }
  }, []);

  return (
    <div id={id} className={`table ${className}`}>
      <div ref={headerRef} className='table-header'>
        <div className='header-cell'>№</div>
        {Object.entries(headers).map(([key, name]) => (
          <div
            key={key}
            className={`header-cell ${onSort ? 'sort-header' : ''}`}
            onClick={() => onSort?.(key as keyof DataType)}
          >
            {name}
            {!onSort || (
              <div
                className={`sort-button ${sortField === key ? 'colored' : ''}`}
              >
                <ChevronUpDown className={!!sortDirection ? 'hidden' : ''} />
                <ChevronUp
                  className={sortDirection !== 'asc' ? 'hidden' : ''}
                />
                <ChevronDown
                  className={sortDirection !== 'desc' ? 'hidden' : ''}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className='table-body'>
        {data.map((value, i) => (
          <div
            ref={i === 0 ? rowRef : undefined}
            key={value.id}
            className={`table-row ${i === 0 ? 'top-row' : ''}`}
            style={{ animationDelay: `${ROW_ANIMATION_DELAY * i}ms` }}
          >
            {rowContent(value, i)}
          </div>
        ))}
      </div>
    </div>
  );
}
