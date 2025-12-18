import { Result } from '@/lib/utils';
import { Review, Sorting } from './types';

export interface ReviewRepo {
  create(review: Review): Promise<Result<Review, string>>;
  getById(reviewId: string): Promise<Result<Review, string>>;
  getByUserAndItem(
    userId: string,
    itemId: string
  ): Promise<Result<Review | null, string>>;
  update(
    reviewId: string,
    rating?: number,
    reviewText?: string
  ): Promise<Result<Review, string>>;
  delete(reviewId: string): Promise<Result<boolean, string>>;
  like(
    reviewId: string,
    userId: string
  ): Promise<Result<boolean | string, string>>;
  unlike(
    reviewId: string,
    userId: string
  ): Promise<Result<boolean | string, string>>;
  getArtistReviews(
    artistId: string,
    sort: Sorting
  ): Promise<Result<Review[], string>>;
  getAlbumReviews(
    albumId: string,
    sort: Sorting
  ): Promise<Result<Review[], string>>;
  getTrackReviews(
    trackId: string,
    sort: Sorting
  ): Promise<Result<Review[], string>>;
}
