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

/**
 * @param props
 * @param props.source - The ones who gave this rating (critics, IGDB users, My Stats user).
 * @param props.rating - Rating value. If empty, shows NR (not rated).
 * @returns
 */
function RatingSource({ source, rating }: RatingSourceProps) {
  return (
    <div className='rating-source'>
      <span className='small'>{source}</span>
      <Rating value={rating} />
    </div>
  );
}

/**
 * @param props
 * @param props.criticsRating
 * @param props.usersRating
 * @param props.userOwnRating
 * @param props.className
 * @returns Flexbox with item ratings from critics, IGDB users and user.
 */
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
