import { getSingularOrPlural } from '@lib/utils';

type PlaytimeRatingProps = {
  value?: number;
};

export default function PlaytimeRating({ value }: PlaytimeRatingProps) {
  return (
    <div
      className={`playtime-rating ${typeof value === 'undefined' ? 'empty' : ''}`}
    >
      <span className='playtime-value'>{value ?? '—'}</span>
      <span className='playtime-label'>
        {getSingularOrPlural(value ?? 0, 'hour', 'hours')}
      </span>
    </div>
  );
}
