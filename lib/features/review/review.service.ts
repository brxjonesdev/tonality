import { Result, ok, err} from "@/lib/utils"; 
import { Review } from "./types";
export interface ReviewService {
  createReview(
    userId: string,
    itemId: string,
    rating: number,
    reviewText?: string
  ): Promise<Result<Review, string>>;

  getReviewById(reviewId: string): Promise<Result<Review, string>>;

  updateReview(
    userId: string,
    reviewId: string,
    rating?: number,
    reviewText?: string
  ): Promise<Result<Review, string>>;

  deleteReview(reviewId: string): Promise<Result<boolean, string>>;

  likeReview(reviewId: string, userId: string): Promise<Result<boolean, string>>;
  unlikeReview(reviewId: string, userId: string): Promise<Result<boolean, string>>;

  getArtistReviews(artistId: string): Promise<Result<Review[], string>>;
  getAlbumReviews(albumId: string): Promise<Result<Review[], string>>;
  getTrackReviews(trackId: string): Promise<Result<Review[], string>>;
}


export function createReviewService(repo: any): ReviewService {
  return {
    async createReview(userId, itemId, rating, reviewText) {
      return err("not implemented");
    },

    async getReviewById(reviewId) {
      return err("not implemented");
    },

    async updateReview(userId, reviewId, rating, reviewText) {
      return err("not implemented");
    },

    async deleteReview(reviewId) {
      return ok(false);
    },

    async likeReview(reviewId, userId) {
      return ok(false);
    },

    async unlikeReview(reviewId, userId) {
      return ok(false);
    },

    async getArtistReviews(artistId) {
      return ok<Review[]>([]);
    },

    async getAlbumReviews(albumId) {
      return ok<Review[]>([]);
    },

    async getTrackReviews(trackId) {
      return ok<Review[]>([]);
    },
  };
}