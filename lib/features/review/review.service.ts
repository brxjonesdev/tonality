import { Result, ok, err } from '@/lib/utils';
import { Review, ReviewCreateDTO, ReviewUpdateDTO, Sorting } from './types';
import { ReviewRepo } from './review.repo';

export interface ReviewService {
  createReview(
    review: ReviewCreateDTO,
    userID: string
  ): Promise<Result<Review, string>>;

  getReviewById(reviewId: string): Promise<Result<Review, string>>;

  updateReview(
    userID: string,
    review: ReviewUpdateDTO
  ): Promise<Result<Review, string>>;

  deleteReview(
    userId: string,
    reviewId: string
  ): Promise<Result<boolean, string>>;

  likeReview(
    reviewId: string,
    userId: string
  ): Promise<Result<boolean | string, string>>;
  unlikeReview(
    reviewId: string,
    userId: string
  ): Promise<Result<boolean | string, string>>;

  getAllReviewsRelatedToArtist(
    artistID: string,
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

export function createReviewService(repo: ReviewRepo): ReviewService {
  return {
    async createReview(
      { itemId, rating, reviewText, type, artistID }: ReviewCreateDTO,
      userId: string
    ) {
      if (rating < 1 || rating > 5) {
        return err('Rating must be between 1 and 5');
      }

      if (reviewText && reviewText.length > 1000) {
        return err('Review text exceeds maximum length of 1000 characters');
      }

      // check if there is already a review by this user for this item
      const duplicateCheckResult = await repo.getByUserAndItem(userId, itemId);
      if (!duplicateCheckResult.ok) {
        return err(duplicateCheckResult.error);
      }
      if (duplicateCheckResult.data) {
        return err('User has already reviewed this item');
      }
      const formattedText = reviewText ? reviewText.trim() : '';
      const newReview: Review = {
        id: '',
        userId,
        itemId,
        rating,
        artistID,
        reviewText: formattedText,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        edited: false,
        type,
      };

      const createdResult = await repo.create(newReview);
      if (!createdResult.ok) {
        return err(createdResult.error);
      }
      return ok(createdResult.data);
    },

    async getReviewById(reviewId) {
      if (!reviewId) {
        return err('Invalid reviewId');
      }
      const reviewResult = await repo.getById(reviewId);
      if (!reviewResult.ok) {
        return err(reviewResult.error);
      }
      return ok(reviewResult.data);
    },

    async updateReview(
      userId,
      { reviewId, rating, reviewText }: ReviewUpdateDTO
    ) {
      if (!reviewId) {
        return err('Invalid reviewId');
      }
      if (rating !== undefined && (rating < 1 || rating > 5)) {
        return err('Rating must be between 1 and 5');
      }

      const existingReviewResult = await repo.getById(reviewId);
      if (!existingReviewResult.ok) {
        return err(existingReviewResult.error);
      }
      const existingReview = existingReviewResult.data;
      if (existingReview.userId !== userId) {
        return err('Unauthorized: You can only update your own reviews');
      }

      const updatedReviewResult = await repo.update(
        reviewId,
        rating,
        reviewText
      );
      if (!updatedReviewResult.ok) {
        return err(updatedReviewResult.error);
      }
      return ok(updatedReviewResult.data);
    },

    async deleteReview(userId, reviewId) {
      if (!reviewId) {
        return err('Invalid reviewId');
      }

      const existingReviewResult = await repo.getById(reviewId);
      if (!existingReviewResult.ok) {
        return err(existingReviewResult.error);
      }
      const existingReview = existingReviewResult.data;
      if (existingReview.userId !== userId) {
        return err('Unauthorized: You can only delete your own reviews');
      }

      const deletedResult = await repo.delete(reviewId);
      if (!deletedResult.ok) {
        return err('Failed to delete review');
      }
      return ok(deletedResult.data);
    },

    async likeReview(reviewId, userId) {
      if (!reviewId || !userId) {
        return err('Invalid reviewId or userId');
      }
      const existingLikeResult = await repo.hasUserLiked(reviewId, userId);
      if (!existingLikeResult.ok) {
        return err('Failed to check existing likes');
      }
      if (existingLikeResult.data) {
        return err('User has already liked this review');
      }
      const thelikening = await repo.like(reviewId, userId);
      if (!thelikening.ok) {
        return err('Failed to like review');
      }
      if (thelikening.data === 'Review does not exist') {
        return err('Review does not exist');
      }
      return ok(true);
    },

    async unlikeReview(reviewId, userId) {
      if (!reviewId || !userId) {
        return err('Invalid reviewId or userId');
      }
      const theunlikening = await repo.unlike(reviewId, userId);
      if (!theunlikening.ok) {
        return err('Failed to unlike review');
      }
      if (theunlikening.data === 'Review does not exist') {
        return err('Review does not exist');
      }
      return ok(true);
    },

    async getAllReviewsRelatedToArtist(artistID, sort) {
      if (!artistID) {
        return err('Invalid artistID');
      }

      const artistReviewsResult = await repo.getArtistReviews(artistID, sort);

      if (!artistReviewsResult.ok) {
        return err(artistReviewsResult.error);
      }
      return ok(artistReviewsResult.data);
    },

    async getAlbumReviews(albumId, sort) {
      if (!albumId) {
        return err('Invalid albumId');
      }
      const albumReviewsResult = await repo.getAlbumReviews(albumId, sort);
      if (!albumReviewsResult.ok) {
        return err(albumReviewsResult.error);
      }
      return ok(albumReviewsResult.data);
    },

    async getTrackReviews(trackId, sort) {
      if (!trackId) {
        return err('TrackID is invalid or empty');
      }
      const trackReviewsResult = await repo.getTrackReviews(trackId, sort);
      if (!trackReviewsResult.ok) {
        return err(trackReviewsResult.error);
      }
      return ok(trackReviewsResult.data);
    },
  };
}
