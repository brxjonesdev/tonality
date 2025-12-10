import { Result, ok, err} from "@/lib/utils"; 
import { Review, ReviewCreateDTO, ReviewUpdateDTO } from "./types";
import { ReviewRepo } from "./review.repo";

export interface Sorting {
  sortBy: "date" | "rating";
  order: "asc" | "desc";
  filterBy?: "albumId" | "trackId";
  filterValue?: string;
  page?: number;
  pageSize?: number;
}
export interface ReviewService {
  createReview(review: ReviewCreateDTO ): Promise<Result<Review, string>>;

  getReviewById(reviewId: string): Promise<Result<Review, string>>;

  updateReview(userID: string ,review: ReviewUpdateDTO
  ): Promise<Result<Review, string>>;

  deleteReview(userId: string, reviewId: string): Promise<Result<boolean, string>>;

  likeReview(reviewId: string, userId: string): Promise<Result<boolean| string, string>>;
  unlikeReview(reviewId: string, userId: string): Promise<Result<boolean | string, string>>;

  getArtistReviews(artistId: string, sort:Sorting): Promise<Result<Review[], string>>;
  getAlbumReviews(albumId: string, sort:Sorting): Promise<Result<Review[], string>>;
  getTrackReviews(trackId: string, sort:Sorting): Promise<Result<Review[], string>>;
}



export function createReviewService(repo: ReviewRepo): ReviewService {
  return {
    async createReview({ userId, itemId, rating, reviewText }: ReviewCreateDTO) {
      if (!userId || !itemId) {
        return err("Invalid userId or itemId");
      }
      if (rating < 1 || rating > 5) {
        return err("Rating must be between 1 and 5");
      }
      const saveResult = await repo.create(userId, itemId, rating, reviewText);
      if(!saveResult.ok){
        return err("Failed to create review");
      }
      return ok(saveResult.data);
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

    async updateReview(userId, { reviewId, rating, reviewText }: ReviewUpdateDTO) {
      if (!reviewId) {
        return err("Invalid reviewId");
      }
      if (rating !== undefined && (rating < 1 || rating > 5)) {
        return err("Rating must be between 1 and 5");
      }
      const updatedReview = await repo.update(userId, reviewId, rating, reviewText);
      if (!updatedReview) {
        return err("Failed to update review");
      }
      return ok(updatedReview);
    },

    async deleteReview(userId, reviewId) {
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