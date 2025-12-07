import { Result, ok, err} from "@/lib/utils"; 
import { Review } from "./types";
import { ReviewRepo } from "./review.repo";
export interface ReviewService {
  createReview(
    userId: string,
    itemId: string,
    rating: number,
    reviewText: string
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


export function createReviewService(repo: ReviewRepo): ReviewService {
  return {
    async createReview(userId, itemId, rating, reviewText) {
      if (!userId || !itemId) {
        return err("Invalid userId or itemId");
      }
      if (rating < 1 || rating > 5) {
        return err("Rating must be between 1 and 5");
      }
      const saveResult = await repo.create(userId, itemId, rating, reviewText);
      if(!saveResult){
        return err("Failed to create review");
      }
      return ok(saveResult);
    },

    async getReviewById(reviewId) {
      if (!reviewId) {
        return err("Invalid reviewId");
      }
      const review = await repo.getById(reviewId);
      if (!review) {
        return err("Review not found");
      }
      return ok(review);
    },

    async updateReview(reviewId, rating, reviewText) {
      if (!reviewId) {
        return err("Invalid reviewId");
      }
      const updatedReview = await repo.update(reviewId, rating, reviewText);
      if (!updatedReview) {
        return err("Failed to update review");
      }
      return ok(updatedReview);
    },

    async deleteReview(reviewId) {
      if (!reviewId) {
        return err("Invalid reviewId");
      }
      const deleted = await repo.delete(reviewId);
      if (!deleted) {
        return err("Failed to delete review");
      }
      return ok(true);
    },

    async likeReview(reviewId, userId) {
      if (!reviewId || !userId) {
        return err("Invalid reviewId or userId");
      }
      const liked = await repo.like(reviewId, userId);
      if (!liked) {
        return err("Failed to like review");
      }
      return ok(true);
    },

    async unlikeReview(reviewId, userId) {
      if (!reviewId || !userId) {
        return err("Invalid reviewId or userId");
      }
      const unliked = await repo.unlike(reviewId, userId);
      if (!unliked) {
        return err("Failed to unlike review");
      }
      return ok(true);
    },

    async getArtistReviews(artistId) {
      if (!artistId) {
        return err("Invalid artistId");
      }
      const artistReview = await repo.getArtistReviews(artistId);
      if (!artistReview) {
        return err("No reviews found for artist");
      }
      return ok<Review[]>(artistReview);
    },

    async getAlbumReviews(albumId) {
      if (!albumId) {
        return err("Invalid albumId");
      }
      const albumReview = await repo.getAlbumReviews(albumId);
      if (!albumReview) {
        return err("No reviews found for album");
      }
      return ok<Review[]>(albumReview);
    },

    async getTrackReviews(trackId) {
      if (!trackId) {
        return err("Invalid trackId");
      }
      const trackReview = await repo.getTrackReviews(trackId);
      if (!trackReview) {
        return err("No reviews found for track");
      }
      return ok<Review[]>(trackReview);
    },
  };
}