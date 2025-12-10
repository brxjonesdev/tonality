import {describe, it, expect, beforeEach, vi} from "vitest";
import { createReviewService, ReviewService } from "./review.service";
import { ReviewRepo } from "./review.repo";
import { Review } from "./types";
import { after, afterEach } from "node:test";

describe("ReviewService", () => {
    let reviewService: ReviewService;
    let mockRepo: ReviewRepo;
    const sampleReviews : Review[] = [
        {
            id: "rev1",
            userId: "user1",
            itemId: "item1",
            rating: 5,
            reviewText: "Great album!",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ]
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
        }
        reviewService = createReviewService(mockRepo);
    })

    afterEach(()=> {
        vi.clearAllMocks();
    })

    describe("creating a review", () => {
        it("should create a new review given valid inputs", async () => {});
        it("should return an error for invalid userId or itemId", async () => {});
        it("should return an error for invalid rating", async () => {});
        it("should return an error for repo failure", async () => {});
        it('should call repo.create with correct parameters', async () => {});
    describe("getting a review by ID", () => {
        it("should return the review for a valid reviewId", async () => {});
        it("should return an error for invalid reviewId", async () => {});
        it("should return an error if review not found", async () => {});
        it("should call repo.getById with correct parameters", async () => {});
    });
    describe("updating a review", () => {
        it("should update and return the review for valid inputs", async () => {});
        it("should return an error for invalid reviewId", async () => {});
        it("updating a review, should return with an 'edited' tag", async () => {});
        it("should return an error for repo failure", async () => {});
        it("should call repo.update with correct parameters", async () => {});
    });
    describe("deleting a review", () => {
        it("should delete the review for a valid reviewId", async () => {});
        it("should return an error if review not found", async () => {});
        it("should delete all related data (likes, comments) when deleting a review", async () => {});
        it("should return an error for invalid reviewId", async () => {});
        it("should call repo.delete with correct parameters", async () => {});
    });
    describe("liking a review", () => {
        it("should like the review for valid reviewId and userId", async () => {});
        it("should return an error for invalid reviewId or userId", async () => {});
        it("should return an error if already liked", async () => {});
        it("should call repo.like with correct parameters", async () => {});
    });
    describe("unliking a review", () => {
        it("should unlike the review for valid reviewId and userId", async () => {});
        it("should return an error for invalid reviewId or userId", async () => {});
        it("should return an error if not previously liked", async () => {});
        it("should call repo.unlike with correct parameters", async () => {});
    });
    describe("getting artist reviews", () => {
        it("should return reviews for a valid artistId", async () => {});
        it("should return an error for invalid artistId", async () => {});
        it("should return an empty array if there are no reviews", async () => {});
        it("should call repo.getArtistReviews with correct parameters", async () => {});
    });
    describe("getting album reviews", () => {
        it("should return reviews for a valid albumId", async () => {});
        it("should return an error for invalid albumId", async () => {});
        it("should return an empty array if there are no reviews", async () => {});
        it("should call repo.getAlbumReviews with correct parameters", async () => {});
    });
    describe("getting track reviews", () => {
        it("should return reviews for a valid trackId", async () => {});
        it("should return an error for invalid trackId", async () => {});
        it("should return an empty array if there are no reviews", async () => {});
        it("should call repo.getTrackReviews with correct parameters", async () => {});
    
    });
})});