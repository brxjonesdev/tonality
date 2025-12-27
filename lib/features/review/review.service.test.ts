import { describe, it, beforeEach, afterEach, vi, expect } from "vitest";
import { ReviewService, createReviewService } from "./review.service";
import { ReviewRepo } from "./review.repo";
import { Review, ReviewCreateDTO, ReviewUpdateDTO, Sorting } from "./types";
import { ok, err } from "@/lib/utils";

describe("ReviewService", () => {
  let reviewService: ReviewService;
  let mockRepo: ReviewRepo;

  const sampleReview: Review = {
    id: "rev1",
    userId: "user1",
    itemId: "item1",
    rating: 5,
    artistID: "artist1",
    reviewText: "Great album!",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    edited: false,
    type: "album",
  };

  const defaultSort: Sorting = {
    sortBy: "date",
    order: "desc",
    page: 1,
    pageSize: 10,
  };

  const generateReviews = (
    count: number,
    type: "album" | "track",
  ): Review[] => {
    const reviews: Review[] = [];
    for (let i = 0; i < count; i++) {
      reviews.push({
        id: `rev${i + 1}`,
        userId: `user${(i % 5) + 1}`,
        itemId: `item${(i % 3) + 1}`,
        rating: (i % 5) + 1,
        reviewText: `Review text ${i + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        edited: false,
        artistID: `artist${(i % 2) + 1}`,
        type,
      });
    }
    return reviews;
  };

  beforeEach(() => {
    mockRepo = {
      create: vi.fn(),
      getById: vi.fn(),
      getByUserAndItem: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      hasUserLiked: vi.fn(),
      like: vi.fn(),
      unlike: vi.fn(),
      getArtistReviews: vi.fn(),
      getAlbumReviews: vi.fn(),
      getTrackReviews: vi.fn(),
    };
    reviewService = createReviewService(mockRepo);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("createReview", () => {
    it("creates a review with valid input", async () => {
      vi.mocked(mockRepo.create).mockResolvedValue(ok(sampleReview));
      vi.mocked(mockRepo.getByUserAndItem).mockResolvedValue(ok(null));
      const reviewCreateInput: ReviewCreateDTO = {
        itemId: "item1",
        rating: 5,
        reviewText: "Great album!",
        artistID: "artist1",
        type: "album",
      };
      const creationResult = await reviewService.createReview(
        reviewCreateInput,
        "user1",
      );
      expect(creationResult.ok).toBe(true);
      if (creationResult.ok) {
        expect(creationResult.data).toEqual(sampleReview);
      }
      expect(mockRepo.create).toHaveBeenCalledWith({
        id: "",
        userId: "user1",
        itemId: reviewCreateInput.itemId,
        rating: reviewCreateInput.rating,
        artistID: reviewCreateInput.artistID,
        reviewText: reviewCreateInput.reviewText,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        edited: false,
        type: reviewCreateInput.type,
      });
    });

    it("prevents creating duplicate reviews for the same user and item", async () => {
      vi.mocked(mockRepo.getByUserAndItem).mockResolvedValue(ok(sampleReview));
      const duplicateReviewCreate: ReviewCreateDTO = {
        itemId: "item1",
        rating: 5,
        reviewText: "Great album!",
        artistID: "artist1",
        type: "album",
      };
      const result = await reviewService.createReview(
        duplicateReviewCreate,
        "user1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("User has already reviewed this item");
      }
      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it("returns an error for invalid rating", async () => {
      const invalidReviewCreate: ReviewCreateDTO = {
        itemId: "item1",
        rating: 67,
        reviewText: "Great album!",
        artistID: "artist1",
        type: "album",
      };
      const result = await reviewService.createReview(
        invalidReviewCreate,
        "user1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Rating must be between 1 and 5");
      }
      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it("returns an error for invalid reviewText", async () => {
      const invalidReviewCreate: ReviewCreateDTO = {
        itemId: "item1",
        rating: 4,
        reviewText: "A".repeat(1001),
        artistID: "artist1",
        type: "album",
      };
      const result = await reviewService.createReview(
        invalidReviewCreate,
        "user1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe(
          "Review text exceeds maximum length of 1000 characters",
        );
      }
    });

    it("returns an error if repo fails", async () => {
      vi.mocked(mockRepo.getByUserAndItem).mockResolvedValue(ok(null));
      vi.mocked(mockRepo.create).mockResolvedValue(
        err("Database error: unable to create review"),
      );
      const reviewCreateInput: ReviewCreateDTO = {
        itemId: "item1",
        rating: 5,
        reviewText: "Great album!",
        artistID: "artist1",
        type: "album",
      };
      const result = await reviewService.createReview(
        reviewCreateInput,
        "user1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Database error: unable to create review");
      }
      expect(mockRepo.create).toHaveBeenCalled();
    });
  });

  describe("getReviewById", () => {
    it("returns a review when found", async () => {
      vi.mocked(mockRepo.getById).mockResolvedValue(ok(sampleReview));
      const result = await reviewService.getReviewById("rev1");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(sampleReview);
      }
      expect(mockRepo.getById).toHaveBeenCalledWith("rev1");
    });

    it("returns an error when not found or invalid id", async () => {
      vi.mocked(mockRepo.getById).mockResolvedValue(err("Review not found"));
      const result = await reviewService.getReviewById("invalid-id");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Review not found");
      }
      expect(mockRepo.getById).toHaveBeenCalledWith("invalid-id");
    });

    it("handles repo failure", async () => {
      vi.mocked(mockRepo.getById).mockResolvedValue(
        err("Database error: unable to fetch review"),
      );
      const result = await reviewService.getReviewById("rev1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Database error: unable to fetch review");
      }
      expect(mockRepo.getById).toHaveBeenCalledWith("rev1");
    });
  });

  describe("updateReview", () => {
    it("updates a review and marks it as edited", async () => {
      vi.mocked(mockRepo.getById).mockResolvedValue(ok(sampleReview));
      vi.mocked(mockRepo.update).mockResolvedValue(
        ok({ ...sampleReview, rating: 4 }),
      );
      const updates: ReviewUpdateDTO = {
        reviewId: "rev1",
        rating: 4,
      };
      const result = await reviewService.updateReview("user1", updates);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.rating).toBe(4);
      }
      expect(mockRepo.update).toHaveBeenCalledWith(
        updates.reviewId,
        updates.rating,
        updates.reviewText,
      );
    });

    it("prevents updating a review the user does not own", async () => {
      vi.mocked(mockRepo.getById).mockResolvedValue(ok(sampleReview));
      const updates: ReviewUpdateDTO = {
        reviewId: "rev1",
        rating: 4,
      };
      const result = await reviewService.updateReview("user2", updates);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe(
          "Unauthorized: You can only update your own reviews",
        );
      }
      expect(mockRepo.update).not.toHaveBeenCalled();
    });

    it("returns an error for invalid update input", async () => {
      const invalidUpdates: ReviewUpdateDTO = {
        reviewId: "rev1",
        rating: 6,
      };
      const result = await reviewService.updateReview("user1", invalidUpdates);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Rating must be between 1 and 5");
      }
      expect(mockRepo.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteReview", () => {
    it("deletes a review the user owns", async () => {
      vi.mocked(mockRepo.delete).mockResolvedValue(ok(true));
      vi.mocked(mockRepo.getById).mockResolvedValue(ok(sampleReview));
      const result = await reviewService.deleteReview("user1", "rev1");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toBe(true);
      }
      expect(mockRepo.delete).toHaveBeenCalledWith("rev1");
    });

    it("prevents deleting a review the user does not own", async () => {
      vi.mocked(mockRepo.delete).mockResolvedValue(
        err("You do not own this review"),
      );
      vi.mocked(mockRepo.getById).mockResolvedValue(ok(sampleReview));
      const result = await reviewService.deleteReview("user2", "rev1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe(
          "Unauthorized: You can only delete your own reviews",
        );
      }
    });

    it("returns an error when review does not exist", async () => {
      vi.mocked(mockRepo.getById).mockResolvedValue(err("Review not found"));
      const result = await reviewService.deleteReview(
        "user1",
        "nonexistent-rev",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Review not found");
      }
    });
  });

  describe("likeReview", () => {
    it("likes a review", async () => {
      vi.mocked(mockRepo.like).mockResolvedValue(ok(true));
      vi.mocked(mockRepo.hasUserLiked).mockResolvedValue(ok(false));
      const result = await reviewService.likeReview("rev1", "user2");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toBe(true);
      }
      expect(mockRepo.like).toHaveBeenCalledWith("rev1", "user2");
    });

    it("prevents liking own review", async () => {
      vi.mocked(mockRepo.hasUserLiked).mockResolvedValue(ok(true));
      const result = await reviewService.likeReview("rev1", "user1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("User has already liked this review");
      }
      expect(mockRepo.like).not.toHaveBeenCalled();
    });
    it("handles repo errors", async () => {
      vi.mocked(mockRepo.like).mockResolvedValue(
        err("Database error: unable to like review"),
      );
      vi.mocked(mockRepo.hasUserLiked).mockResolvedValue(ok(false));
      const result = await reviewService.likeReview("rev1", "user2");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Failed to like review");
      }
      expect(mockRepo.like).toHaveBeenCalledWith("rev1", "user2");
    });
  });

  describe("unlikeReview", () => {
    it("unlikes a previously liked review", async () => {
      vi.mocked(mockRepo.unlike).mockResolvedValue(ok(true));
      vi.mocked(mockRepo.getByUserAndItem).mockResolvedValue(ok(sampleReview));

      const result = await reviewService.unlikeReview("rev1", "user2");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toBe(true);
      }
      expect(mockRepo.unlike).toHaveBeenCalledWith("rev1", "user2");
    });

    it("returns an error if review was not liked", async () => {
      vi.mocked(mockRepo.unlike).mockResolvedValue(err("Review not liked"));
      vi.mocked(mockRepo.getByUserAndItem).mockResolvedValue(ok(sampleReview));

      const result = await reviewService.unlikeReview("rev1", "user2");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Failed to unlike review");
      }
      expect(mockRepo.unlike).toHaveBeenCalledWith("rev1", "user2");
    });
  });

  describe("getAllReviewsRelatedToArtist", () => {
    it("retrieves all reviews for a given artist", async () => {
      const artistReviews = generateReviews(15, "album");
      vi.mocked(mockRepo.getArtistReviews).mockResolvedValue(ok(artistReviews));
      const result = await reviewService.getAllReviewsRelatedToArtist(
        "artist1",
        defaultSort,
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(artistReviews);
      }
      expect(mockRepo.getArtistReviews).toHaveBeenCalledWith(
        "artist1",
        defaultSort,
      );
    });

    it("handles repo errors when fetching artist reviews", async () => {
      vi.mocked(mockRepo.getArtistReviews).mockResolvedValue(
        err("Database error: unable to fetch artist reviews"),
      );
      const result = await reviewService.getAllReviewsRelatedToArtist(
        "artist1",
        defaultSort,
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe(
          "Database error: unable to fetch artist reviews",
        );
      }
      expect(mockRepo.getArtistReviews).toHaveBeenCalledWith(
        "artist1",
        defaultSort,
      );
    });

    it("returns in the sort format given", async () => {
      const artistReviews = generateReviews(100000, "track");
      const customSort: Sorting = {
        sortBy: "rating",
        order: "asc",
        page: 2,
        pageSize: 5,
      };
      const paginatedReviews = artistReviews
        .sort((a, b) =>
          customSort.order === "asc"
            ? a.rating - b.rating
            : b.rating - a.rating,
        )
        .slice(
          (customSort.page - 1) * customSort.pageSize,
          customSort.page * customSort.pageSize,
        );
      vi.mocked(mockRepo.getArtistReviews).mockResolvedValue(
        ok(paginatedReviews),
      );
      const result = await reviewService.getAllReviewsRelatedToArtist(
        "artist2",
        customSort,
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(paginatedReviews);
      }
      expect(mockRepo.getArtistReviews).toHaveBeenCalledWith(
        "artist2",
        customSort,
      );
    });
  });

  describe("getting reviews related to an album", () => {
    it("retrieves all reviews for a given album", async () => {
      const albumReviews = generateReviews(20, "album");
      vi.mocked(mockRepo.getAlbumReviews).mockResolvedValue(ok(albumReviews));
      const result = await reviewService.getAlbumReviews("album1", defaultSort);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(albumReviews);
      }
      expect(mockRepo.getAlbumReviews).toHaveBeenCalledWith(
        "album1",
        defaultSort,
      );
    });
    it("handles repo errors when fetching album reviews", async () => {
      vi.mocked(mockRepo.getAlbumReviews).mockResolvedValue(
        err("Database error: unable to fetch album reviews"),
      );
      const result = await reviewService.getAlbumReviews("album1", defaultSort);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe(
          "Database error: unable to fetch album reviews",
        );
      }
      expect(mockRepo.getAlbumReviews).toHaveBeenCalledWith(
        "album1",
        defaultSort,
      );
    });
    it("returns in the given sort order", async () => {
      const albumReviews = generateReviews(50, "album");
      const customSort: Sorting = {
        sortBy: "rating",
        order: "desc",
        page: 1,
        pageSize: 10,
      };
      const sortedReviews = albumReviews
        .sort((a, b) =>
          customSort.order === "asc"
            ? a.rating - b.rating
            : b.rating - a.rating,
        )
        .slice(
          (customSort.page - 1) * customSort.pageSize,
          customSort.page * customSort.pageSize,
        );
      vi.mocked(mockRepo.getAlbumReviews).mockResolvedValue(ok(sortedReviews));
      const result = await reviewService.getAlbumReviews("album2", customSort);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(sortedReviews);
      }
      expect(mockRepo.getAlbumReviews).toHaveBeenCalledWith(
        "album2",
        customSort,
      );
    });
  });

  describe("getting reviews related to a track", () => {
    it("retrieves all reviews for a given track", async () => {
      const trackReviews = generateReviews(25, "track");
      vi.mocked(mockRepo.getTrackReviews).mockResolvedValue(ok(trackReviews));
      const result = await reviewService.getTrackReviews("track1", defaultSort);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(trackReviews);
      }
      expect(mockRepo.getTrackReviews).toHaveBeenCalledWith(
        "track1",
        defaultSort,
      );
    });
    it("handles repo errors when fetching track reviews", async () => {
      vi.mocked(mockRepo.getTrackReviews).mockResolvedValue(
        err("Database error: unable to fetch track reviews"),
      );
      const result = await reviewService.getTrackReviews("track1", defaultSort);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe(
          "Database error: unable to fetch track reviews",
        );
      }
      expect(mockRepo.getTrackReviews).toHaveBeenCalledWith(
        "track1",
        defaultSort,
      );
    });
    it("returns in the given sort order", async () => {
      const trackReviews = generateReviews(40, "track");
      const customSort: Sorting = {
        sortBy: "rating",
        order: "asc",
        page: 3,
        pageSize: 5,
      };
      const sortedReviews = trackReviews
        .sort((a, b) =>
          customSort.order === "asc"
            ? a.rating - b.rating
            : b.rating - a.rating,
        )
        .slice(
          (customSort.page - 1) * customSort.pageSize,
          customSort.page * customSort.pageSize,
        );
      vi.mocked(mockRepo.getTrackReviews).mockResolvedValue(ok(sortedReviews));
      const result = await reviewService.getTrackReviews("track2", customSort);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(sortedReviews);
      }
      expect(mockRepo.getTrackReviews).toHaveBeenCalledWith(
        "track2",
        customSort,
      );
    });
  });
});
