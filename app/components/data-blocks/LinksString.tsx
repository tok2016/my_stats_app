import Link from 'next/link';

type BasicItem = { id: number | string; name: string };

type LinksStringProps = {
  baseEndpoint: string;
  items: BasicItem[];
  groupKey: string;
  className?: string;
};

type LinkSubstringProps = {
  baseEndpoint: string;
  item: BasicItem;
  last?: boolean;
};

function LinkSubstring({
  baseEndpoint,
  item,
  last = false
}: LinkSubstringProps) {
  return (
    <>
      <Link href={`${baseEndpoint}/${item.id}`} className='underline wide'>
        {item.name}
      </Link>
      {last ? null : ', '}
    </>
  );
}

export function LinksString({
  baseEndpoint,
  items,
  groupKey,
  className = ''
}: LinksStringProps) {
  return (
    <p className={`link-string ${className}`}>
      {items.map((item, i) => (
        <LinkSubstring
          key={`${groupKey}-${item.id}`}
          baseEndpoint={baseEndpoint}
          item={item}
          last={i === items.length - 1}
        />
      ))}
    </p>
  );
}
