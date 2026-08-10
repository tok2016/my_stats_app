type RatingProps = {
  value?: number;
  className?: string;
};

type RatingCategory = 'nr' | 'low' | 'medium' | 'high';

const MAX_RATING = 100;
const MAX_ANGLE = 360;

const RatingCategoriesMinValues: Record<RatingCategory, number> = {
  high: 75,
  medium: 50,
  low: 0,
  nr: 0
};

const RatingColors: Record<RatingCategory, string> = {
  high: '#1fbb70',
  medium: '#d5c534',
  low: '#c33333',
  nr: '#7c7c7c'
};

const getRatingCategory = (rating?: number): RatingCategory => {
  if (rating === undefined) return 'nr';
  if (rating >= RatingCategoriesMinValues.high) return 'high';
  else if (rating >= RatingCategoriesMinValues.medium) return 'medium';
  return 'low';
};

const getAngle = (rating?: number) =>
  ((rating ?? MAX_RATING) * MAX_ANGLE) / MAX_RATING;

export default function Rating({ value, className = '' }: RatingProps) {
  const category = getRatingCategory(value);
  const angle = getAngle(value);

  return (
    <div
      className={`rating ${category} ${className}`}
      style={{
        background: `conic-gradient(
          ${RatingColors[category]} ${angle}deg,
          transparent ${angle}deg 360deg
        )`,
        color: RatingColors[category]
      }}
    >
      <span className='value'>{value ?? 'NR'}</span>
    </div>
  );
}
