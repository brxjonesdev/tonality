import { describe, it, beforeEach, afterEach, vi, expect } from "vitest";
import { ReviewService, Sorting, createReviewService } from "./review.service";
import { ReviewRepo } from "./review.repo";
import { Review, ReviewCreateDTO, ReviewUpdateDTO } from "./types";
import { ok, err, Result } from "@/lib/utils";

describe("ReviewService", () => {
  let reviewService: ReviewService;
  let mockRepo: ReviewRepo;

  const sampleReview: Review = {
    id: "rev1",
    userId: "user1",
    itemId: "item1",
    rating: 5,
    reviewText: "Great album!",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    edited: false,
    type: "album",
  };

  const newReview: ReviewCreateDTO = {
    userId: "user1",
    itemId: "item1",
    rating: 5,
    reviewText: "Great album!",
  };

  const defaultSort: Sorting = {
    sortBy: "date",
    order: "desc",
  };

  const generateReviews = (count: number, type: "album" | "track") => {
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
        type,
      });
    }
  };

  beforeEach(() => {
    mockRepo = {
      create: vi.fn(),
      getById: vi.fn(),
      getByUserAndItem: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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
      const newReviewCreate: ReviewCreateDTO = {
        userId: "user1",
        itemId: "item1",
        rating: 5,
        reviewText: "Great album!",
      };
      const review: Review = {
        ...newReviewCreate,
        id: "rev1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        edited: false,
        type: "album",
      };
      vi.mocked(mockRepo.create).mockResolvedValue(ok(review));
      vi.mocked(mockRepo.getByUserAndItem).mockResolvedValue(ok(null));

      const result = await reviewService.createReview(newReviewCreate);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(review);
      }
      expect(mockRepo.create).toHaveBeenCalledWith(
        newReviewCreate.userId,
        newReviewCreate.itemId,
        newReviewCreate.rating,
        newReviewCreate.reviewText,
      );
    });

    it("prevents creating duplicate reviews for the same user and item", async () => {
      const duplicateReviewCreate: ReviewCreateDTO = {
        userId: "user1",
        itemId: "item1",
        rating: 4,
        reviewText: "Good album.",
      };
      vi.mocked(mockRepo.getByUserAndItem).mockResolvedValue(ok(sampleReview));

      const result = await reviewService.createReview(duplicateReviewCreate);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("You have already reviewed this item");
      }
      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it("returns an error for invalid input", async () => {
      const invalidReviewCreate: ReviewCreateDTO = {
        userId: "",
        itemId: "item1",
        rating: 6,
        reviewText: "Great album!",
      };
      vi.mocked(mockRepo.create).mockResolvedValue(
        err("Failed to create review"),
      );

      const result = await reviewService.createReview(invalidReviewCreate);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Invalid userId or itemId");
      }
      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it("returns an error if repo fails", async () => {
      const validReviewCreate: ReviewCreateDTO = {
        userId: "user1",
        itemId: "item1",
        rating: 5,
        reviewText: "Great album!",
      };
      vi.mocked(mockRepo.create).mockResolvedValue(
        err("Database error: unable to create review"),
      );
      const result = await reviewService.createReview(validReviewCreate);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Failed to create review");
      }
      expect(mockRepo.create).toHaveBeenCalledWith(
        validReviewCreate.userId,
        validReviewCreate.itemId,
        validReviewCreate.rating,
        validReviewCreate.reviewText,
      );
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
        expect(result.error).toBe("Review not found");
      }
      expect(mockRepo.getById).toHaveBeenCalledWith("rev1");
    });
  });

  describe("updateReview", () => {
    it("updates a review and marks it as edited", async () => {
      const orginalReview: Review = {
        id: "rev1",
        userId: "user1",
        itemId: "item1",
        rating: 5,
        reviewText: "Great album!",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        edited: false,
        type: "album",
      };
      const updates: ReviewUpdateDTO = {
        reviewId: "rev1",
        rating: 4,
        reviewText: "Good album.",
      };
      const updatedReview: Review = {
        ...orginalReview,
        rating: updates.rating!,
        reviewText: updates.reviewText,
        updatedAt: new Date().toISOString(),
        edited: true,
      };
      vi.mocked(mockRepo.update).mockResolvedValue(ok(updatedReview));
      vi.mocked(mockRepo.getById).mockResolvedValue(ok(orginalReview));

      const result = await reviewService.updateReview("user1", updates);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(updatedReview);
      }
      expect(mockRepo.update).toHaveBeenCalledWith(
        "user1",
        updates.reviewId,
        updates.rating,
        updates.reviewText,
      );
    });

    it("prevents updating a review the user does not own", async () => {
      const updates: ReviewUpdateDTO = {
        reviewId: "rev1",
        rating: 4,
        reviewText: "Good album.",
      };
      vi.mocked(mockRepo.update).mockResolvedValue(
        err("You do not own this review"),
      );
      vi.mocked(mockRepo.getById).mockResolvedValue(ok(sampleReview));
      const result = await reviewService.updateReview("user2", updates);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("You do not own this review");
      }
      expect(mockRepo.update).toHaveBeenCalledWith(
        "user2",
        updates.reviewId,
        updates.rating,
        updates.reviewText,
      );
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
        expect(result.error).toBe("You do not own this review");
      }
      expect(mockRepo.delete).toHaveBeenCalledWith("rev1");
    });

    it("returns an error when review does not exist", async () => {
      vi.mocked(mockRepo.delete).mockResolvedValue(err("Review not found"));
      vi.mocked(mockRepo.getById).mockResolvedValue(err("Review not found"));
      const result = await reviewService.deleteReview(
        "user1",
        "nonexistent-rev",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("You do not own this review");
      }
      expect(mockRepo.delete).toHaveBeenCalledWith("nonexistent-rev");
    });
  });

  describe("likeReview", () => {
    it("likes a review", async () => {
      vi.mocked(mockRepo.like).mockResolvedValue(ok(true));
      const result = await reviewService.likeReview("rev1", "user2");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toBe(true);
      }
      expect(mockRepo.like).toHaveBeenCalledWith("rev1", "user2");
    });

    it("prevents liking own review", async () => {
      vi.mocked(mockRepo.getByUserAndItem).mockResolvedValue(ok(sampleReview));
      const result = await reviewService.likeReview("rev1", "user1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe(
          "You cannot like your own review, narassist!",
        );
      }
      expect(mockRepo.like).not.toHaveBeenCalled();
    });
    it("handles repo errors", async () => {
      vi.mocked(mockRepo.like).mockResolvedValueOnce(
        err("Database Error: couldn't like review"),
      );
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

  describe("getting review relating to an artistID", async () => {
    it("returns reviews for a given artistID", async () =>
    })
  })
  describe("getting review relating to an albumID", async () => {
    it("returns reviews for a given albumID", async () => {
  })
  describe("getting review relating to a trackID", async () => {})
});
