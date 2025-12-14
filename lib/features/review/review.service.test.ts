import { describe, it, beforeEach, afterEach, vi, expect } from "vitest";
import { ReviewService, createReviewService } from "./review.service";
import { ReviewRepo } from "./review.repo";
import { Review, ReviewCreateDTO } from "./types";

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

  beforeEach(() => {
    mockRepo = {
      create: vi.fn(),
      getById: vi.fn(),
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
    it("creates a review with valid input", async () => {});

    it("returns an error for invalid input", async () => {});

    it("returns an error if repo fails", async () => {});
  });

  describe("getReviewById", () => {
    it("returns a review when found", async () => {});

    it("returns an error when not found or invalid id", async () => {});

    it("handles repo failure", async () => {});
  });

  describe("updateReview", () => {
    it("updates a review and marks it as edited", async () => {});

    it("prevents updating a review the user does not own", async () => {});

    it("returns an error for invalid update input", async () => {});

    it("handles no-op updates", async () => {});
  });

  describe("deleteReview", () => {
    it("deletes a review the user owns", async () => {});

    it("prevents deleting a review the user does not own", async () => {});

    it("returns an error when review does not exist", async () => {});
  });

  describe("likeReview", () => {
    it("likes a review", async () => {});

    it("prevents liking own review or duplicate likes", async () => {});
  });

  describe("unlikeReview", () => {
    it("unlikes a previously liked review", async () => {});

    it("returns an error if review was not liked", async () => {});
  });

  describe("getReviewsByEntity", () => {
    it("returns artist reviews both track and album", async () => {});

    it("returns album reviews", async () => {});

    it("returns track reviews", async () => {});
  });
});
