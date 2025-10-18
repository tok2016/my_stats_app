import Button from './Button';

type PaginationProps = {
  pages: number;
  current: number;
};

export default function Pagination({ pages, current }: PaginationProps) {
  return (
    <div className='pagination'>
      {Array.from({ length: pages }, (_, i) => (
        <Button key={i} variant={i === current - 1 ? 'primary' : 'outlined'}>
          {i + 1}
        </Button>
      ))}
    </div>
  );
}
