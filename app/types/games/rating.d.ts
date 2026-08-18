export interface ExternalRatings {
  criticsRating?: number;
  usersRating?: number;
}

export interface RatingDetialed {
  value: number;
  generalPosition: number;
  seriesPosition?: number;
}

export interface Ratings {
  rating?: RatingDetialed;
  criticsRating?: RatingDetialed;
  usersRating?: RatingDetialed;
  hours: RatingDetialed;
}
