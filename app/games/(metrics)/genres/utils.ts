import { RecommendedMetric } from '@ts/games/metric';

export const RecommendationCategories: Record<keyof RecommendedMetric, string> =
  {
    favorite: 'Games of your favorite genres',
    other: 'Games of genres you might like'
  };

export const RecommendationIds: Record<keyof RecommendedMetric, string> = {
  favorite: 'of-favorite-genres',
  other: 'of-rare-genres'
};
