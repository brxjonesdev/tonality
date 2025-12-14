import { Result } from "@/lib/utils";
import { Review } from "./types";

export interface ReviewRepo {
  create(
    userId: string,
    itemId: string,
    rating: number,
    reviewText?: string,
  ): Promise<Result<Review, string>>;
  getById(reviewId: string): Promise<Result<Review, string>>;
  getByUserAndItem(
    userId: string,
    itemId: string,
  ): Promise<Result<Review | null, string>>;
  update(
    userId: string,
    reviewId: string,
    rating?: number,
    reviewText?: string,
  ): Promise<Result<Review, string>>;
  delete(reviewId: string): Promise<Result<boolean, string>>;
  like(
    reviewId: string,
    userId: string,
  ): Promise<Result<boolean | string, string>>;
  unlike(
    reviewId: string,
    userId: string,
  ): Promise<Result<boolean | string, string>>;
  getArtistReviews(artistId: string): Promise<Result<Review[], string>>;
  getAlbumReviews(albumId: string): Promise<Result<Review[], string>>;
  getTrackReviews(trackId: string): Promise<Result<Review[], string>>;
}
