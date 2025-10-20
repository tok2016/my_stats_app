'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { clamp } from '@lib/utils';
type PaginationProps = {
  pages: number;
  current: number;
};

const getPages = (count: number, current: number) => {
  const pages: number[] = [];
  const boundary = 2 + Number(current === 1 || current === count);

  for (let i = 1; i <= count; i++) {
    if (
      i <= 1 + Number(count - current < 2)
      || i >= count - Number(current - 1 < 2)
      || (i > current - boundary && i < current + boundary)
    ) {
      pages.push(i);
    }
  }

  const pagesWithDots: number[] = [];
  pages.forEach((page, i) => {
    pagesWithDots.push(page);
    const diff = pages[i + 1] - page;
    if (diff > 1) {
      pagesWithDots.push(diff === 2 ? page + 1 : -page);
    }
  });

  return pagesWithDots;
};

export default function Pagination({ pages, current }: PaginationProps) {
  const pathname = usePathname();

  const currentPage = clamp(current, 1, pages);
  const pagesWithDots = getPages(pages, currentPage);

  return (
    <div className='pagination'>
      {pagesWithDots.map((page, i) => {
        const params = new URLSearchParams();
        const linkedPage =
          page > 0
            ? page
            : Math.floor((pagesWithDots[i - 1] + pagesWithDots[i + 1]) / 2);
        params.set('page', linkedPage.toString());

        return (
          <Link
            key={page}
            href={`${pathname}?${params.toString()}`}
            className={page === currentPage ? 'current' : ''}
          >
            {page < 0 ? '...' : page}
          </Link>
        );
      })}
    </div>
  );
}
