import { ExternalRatings } from '@ts/games/rating';

import Rating from '@components/Rating';

type MultipleRatingProps = ExternalRatings & {
  userOwnRating?: number;
  className?: string;
};

type RatingSourceProps = {
  source: string;
  rating?: number;
};

function RatingSource({ source, rating }: RatingSourceProps) {
  return (
    <div className='rating-source'>
      <span className='small'>{source}</span>
      <Rating value={rating} />
    </div>
  );
}

export default function MultipleRating({
  className = '',
  criticsRating,
  usersRating,
  userOwnRating
}: MultipleRatingProps) {
  return (
    <div className={`multiple-ratings ${className}`}>
      <RatingSource source='You' rating={userOwnRating} />
      <RatingSource source='Critics' rating={criticsRating} />
      <RatingSource source='Users' rating={usersRating} />
    </div>
  );
}
