// Star Rating Types
export type StarRating = 1 | 2 | 3 | 4 | 5;

// Review Types
export interface MediaRateReview {
  id: string;
  userId: string;
  itemId: string;
  rating: StarRating;
  reviewText?: string;
  createdAt: Date;
  updatedAt: Date;
}
