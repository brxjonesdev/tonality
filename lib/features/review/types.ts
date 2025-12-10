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

export interface Review {
  id: string;
  userId: string;
  itemId: string; 
  rating: number;
  reviewText?: string;
  createdAt: string;
  updatedAt: string;
  edited: boolean;
  type: "artist" | "album" | "track";
}

export interface ReviewCreateDTO {
  userId: string;
  itemId: string;
  rating: number;
  reviewText?: string;
}

export interface ReviewUpdateDTO {
  reviewId: string;
  rating?: number;
  reviewText?: string;
}