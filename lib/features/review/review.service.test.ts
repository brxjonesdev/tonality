import { describe, it, beforeEach, afterEach, vi, expect } from "vitest";
import { ReviewService, createReviewService } from "./review.service";
import { ReviewRepo } from "./review.repo";
import { Review } from "./types";
import { ok, err } from "../../../lib/utils";

describe("ReviewService", () => {
    let reviewService: ReviewService;
    let mockRepo: ReviewRepo;
    const sampleReviews: Review[] = [
        {
            id: "rev1",
            userId: "user1",
            itemId: "item1",
            rating: 5,
            reviewText: "Great album!",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            edited: false,
            type: "album",
        }
    ];
    const sampleReview: Review = sampleReviews[0];

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

    describe("creating a review", () => {
        it("should create a new review given valid inputs", async () => {
            vi.mocked(mockRepo.create).mockResolvedValue(ok(sampleReview));
            const result = await reviewService.createReview("user1", "item1", 5, "Great album!");
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data).toEqual(sampleReview);
            }
            expect(mockRepo.create).toHaveBeenCalledWith("user1", "item1", 5, "Great album!");

        });
        it("should return an error for invalid userId or itemId", async () => {
            vi.mocked(mockRepo.create).mockResolvedValue(err("Invalid userId or itemId"));
            const result = await reviewService.createReview("", "item1", 5, "Great album!");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Invalid userId or itemId");
            }
            expect(mockRepo.create).not.toHaveBeenCalled();
        });
        it("should return an error for invalid rating", async () => {
            const result = await reviewService.createReview("user1", "item1", 6, "Great album!");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Rating must be between 1 and 5");
            }
            expect(mockRepo.create).not.toHaveBeenCalled();
        });
        it("should return an error for rating below minimum", async () => {
            const result = await reviewService.createReview("user1", "item1", 0, "Great album!");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Rating must be between 1 and 5");
            }
            expect(mockRepo.create).not.toHaveBeenCalled();
        });
        it("should return an error for rating above maximum", async () => {
            const result = await reviewService.createReview("user1", "item1", 10, "Great album!");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Rating must be between 1 and 5");
            }
            expect(mockRepo.create).not.toHaveBeenCalled();
        });
        it("should return an error for empty review text", async () => {
            const result = await reviewService.createReview("user1", "item1", 4, "");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Review text cannot be empty");
            }
            expect(mockRepo.create).not.toHaveBeenCalled();
        });
        it("should return an error for excessively long review text", async () => {
            // max is like twitter length
            const longText = "a".repeat(1001);
            const result = await reviewService.createReview("user1", "item1", 4, longText);
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Review text exceeds maximum length");
            }
            expect(mockRepo.create).not.toHaveBeenCalled();

        });
        it("should return an error for repo failure", async () => {
            vi.mocked(mockRepo.create).mockResolvedValue(err("Failed to create review"));
            const result = await reviewService.createReview("user1", "item1", 5, "Great album!");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Failed to create review");
            }
            expect(mockRepo.create).toHaveBeenCalledWith("user1", "item1", 5, "Great album!");
        });
        it('should call repo.create with correct parameters', async () => {
            vi.mocked(mockRepo.create).mockResolvedValue(ok(sampleReview));
            await reviewService.createReview("user1", "item1", 5, "Great album!");
            expect(mockRepo.create).toHaveBeenCalledWith("user1", "item1", 5, "Great album!");
        });
    });

    describe("getting a review by ID", () => {
        it("should return the review for a valid reviewId", async () => {
            vi.mocked(mockRepo.getById).mockResolvedValue(sampleReview);
            const result = await reviewService.getReviewById("rev1");
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data).toEqual(sampleReview);
            }
            expect(mockRepo.getById).toHaveBeenCalledWith("rev1");
        });
        it("should return an error for invalid reviewId", async () => {
            const result = await reviewService.getReviewById("");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Invalid reviewId");
            }
            expect(mockRepo.getById).not.toHaveBeenCalled();
        });
        it("should return an error if review not found", async () => {
            vi.mocked(mockRepo.getById).mockResolvedValue(null);
            const result = await reviewService.getReviewById("nonexistent");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Review not found");
            }
            expect(mockRepo.getById).toHaveBeenCalledWith("nonexistent");
        });
        it("should call repo.getById with correct parameters", async () => {
            vi.mocked(mockRepo.getById).mockResolvedValue(sampleReview);
            await reviewService.getReviewById("rev1");
            expect(mockRepo.getById).toHaveBeenCalledWith("rev1");
        });
    });

    describe("updating a review", () => {
        it("should update and return the review for valid inputs", async () => {
            const updatedReview: Review = {
                ...sampleReview,
                rating: 4,
                reviewText: "Good album!",
                updatedAt: new Date().toISOString(),
            };
            vi.mocked(mockRepo.update).mockResolvedValue(updatedReview);
            const result = await reviewService.updateReview("user1", "rev1", 4, "Good album!");
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data).toEqual(updatedReview);
            }
            expect(mockRepo.update).toHaveBeenCalledWith("rev1", 4, "Good album!");
        });
        it("should return an error for invalid reviewId", async () => {
            const result = await reviewService.updateReview('user1', "", 4, "Good album!");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Invalid reviewId");
            }
            expect(mockRepo.update).not.toHaveBeenCalled();
        });
        it("updating a review, should return with an 'edited' tag", async () => {
            const updatedReview: Review = {
                ...sampleReview,
                rating: 4,
                reviewText: "Good album! (edited)",
                updatedAt: new Date().toISOString(),
                edited: true,
            };
            vi.mocked(mockRepo.update).mockResolvedValue(updatedReview);
            const result = await reviewService.updateReview("user1", "rev1", 4, "Good album! (edited)");
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data).toEqual(updatedReview);
                expect(result.data.edited).toBe(true);
            }
            expect(mockRepo.update).toHaveBeenCalledWith("rev1", 4, "Good album! (edited)");
        });
        it("should return an error for invalid rating on update", async () => {
            const result = await reviewService.updateReview("user1", "rev1", 0, "Good album!");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Rating must be between 1 and 5");
            }
            expect(mockRepo.update).not.toHaveBeenCalled();
        });
        it("should return an error for repo failure", async () => {
            vi.mocked(mockRepo.update).mockResolvedValue(null);
            const result = await reviewService.updateReview("user1", "rev1", 4, "Good album!");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Failed to update review");
            }
            expect(mockRepo.update).toHaveBeenCalledWith("rev1", 4, "Good album!");
        });
        it("should call repo.update with correct parameters", async () => {
            vi.mocked(mockRepo.update).mockResolvedValue(sampleReview);
            await reviewService.updateReview("user1", "rev1", 5, "Great album!");
            expect(mockRepo.update).toHaveBeenCalledWith("rev1", 5, "Great album!");
        });
        it("only allows updating reviews that a user owns", async () => {
            const anotherUserReview: Review = {
                ...sampleReview,
                userId: "user2",
            };
            vi.mocked(mockRepo.getById).mockResolvedValue(anotherUserReview);
            const result = await reviewService.updateReview("user1", "rev1", 4, "Good album!");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Unauthorized to update this review");
            }
            expect(mockRepo.update).not.toHaveBeenCalled();
        });
    });

    describe("deleting a review", () => {
        it("should delete the review for a valid reviewId", async () => {
            vi.mocked(mockRepo.delete).mockResolvedValue(true);
            const result = await reviewService.deleteReview("user1", "rev1");
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data).toBe(true);
            }
            expect(mockRepo.delete).toHaveBeenCalledWith("rev1");
        });
        it("only allows deleting reviews that a user owns", async () => {
            const anotherUserReview: Review = {
                ...sampleReview,
                userId: "user2",
            };
            vi.mocked(mockRepo.getById).mockResolvedValue(anotherUserReview);
            const result = await reviewService.deleteReview("user1", "rev1");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Unauthorized to delete this review");
            }
            expect(mockRepo.delete).not.toHaveBeenCalled();
        });
        it("should return an error if review not found", async () => {
            vi.mocked(mockRepo.getById).mockResolvedValue(null);
            const result = await reviewService.deleteReview("user1", "nonexistent");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("No review found to delete");
            }
            expect(mockRepo.delete).not.toHaveBeenCalled();
        });
        // TODO: Add test to ensure related data (likes, comments) are also deleted
        it("should delete all related data (likes, comments) when deleting a review", async () => {
            vi.mocked(mockRepo.delete).mockResolvedValue(true);
            const result = await reviewService.deleteReview("user1", "rev1");
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data).toBe(true);
            }
            expect(mockRepo.delete).toHaveBeenCalledWith("rev1");
            // Here you would also check that related data deletion methods were called
            // e.g., mockRepo.deleteLikesForReview, mockRepo.deleteCommentsForReview, etc.
        });
        it("should return an error for invalid reviewId", async () => {
            const result = await reviewService.deleteReview("user1", "");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Invalid reviewId");
            }
            expect(mockRepo.delete).not.toHaveBeenCalled();
        });
        it("should call repo.delete with correct parameters", async () => {
            vi.mocked(mockRepo.delete).mockResolvedValue(true);
            await reviewService.deleteReview("user1", "rev1");
            expect(mockRepo.delete).toHaveBeenCalledWith("rev1");
        });
    });

    describe("liking a review", () => {
        it("should like the review for valid reviewId and userId", async () => {
            vi.mocked(mockRepo.like).mockResolvedValue(ok(true));
            const result = await reviewService.likeReview("rev1", "user1");
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data).toBe(true);
            }
            expect(mockRepo.like).toHaveBeenCalledWith("rev1", "user1");
        });
        it("should return an error for invalid reviewId or userId", async () => {
            const result = await reviewService.likeReview("", "user1");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Invalid reviewId or userId");
            }
            expect(mockRepo.like).not.toHaveBeenCalled();
        });
        it("should return an error if already liked", async () => {
            vi.mocked(mockRepo.like).mockResolvedValue(ok("Review already liked"));
            const result = await reviewService.likeReview("rev1", "user1");
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data).toBe("Review already liked");
            }
            expect(mockRepo.like).toHaveBeenCalledWith("rev1", "user1");
        });
        it("should prevent user from liking their own review", async () => {
            vi.mocked(mockRepo.like).mockResolvedValue(err("Cannot like your own review"));
            const result = await reviewService.likeReview("rev1", "user1");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Cannot like your own review");
            }
            expect(mockRepo.like).not.toHaveBeenCalled();
        });
        it("should call repo.like with correct parameters", async () => {
            vi.mocked(mockRepo.like).mockResolvedValue(ok(true));
            await reviewService.likeReview("rev1", "user1");
            expect(mockRepo.like).toHaveBeenCalledWith("rev1", "user1");

        });
    });

    describe("unliking a review", () => {
        it("should unlike the review for valid reviewId and userId", async () => {
            vi.mocked(mockRepo.unlike).mockResolvedValue(ok(true));
            const result = await reviewService.unlikeReview("rev1", "user1");
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data).toBe(true);
            }
            expect(mockRepo.unlike).toHaveBeenCalledWith("rev1", "user1");
        });
        it("should return an error for invalid reviewId or userId", async () => {
            const result = await reviewService.unlikeReview("", "user1");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Invalid reviewId or userId");
            }
            expect(mockRepo.unlike).not.toHaveBeenCalled();
        });
        it("should return an error if not previously liked", async () => {
            vi.mocked(mockRepo.unlike).mockResolvedValue(err("Review not previously liked"));
            const result = await reviewService.unlikeReview("rev1", "user1");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Review not previously liked");
            }
            expect(mockRepo.unlike).toHaveBeenCalledWith("rev1", "user1");
        });
        it("should call repo.unlike with correct parameters", async () => {
            vi.mocked(mockRepo.unlike).mockResolvedValue(ok(true));
            await reviewService.unlikeReview("rev1", "user1");
            expect(mockRepo.unlike).toHaveBeenCalledWith("rev1", "user1");
        });
    });

    describe("getting artist reviews", () => {
        it("should return reviews for a valid artistId", async () => {
            const sampleArtistReviews: Review[] = sampleReviews
            vi.mocked(mockRepo.getArtistReviews).mockResolvedValue(sampleArtistReviews);
            const result = await reviewService.getArtistReviews("red-velvet");
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data).toEqual(sampleArtistReviews);
            }
            expect(mockRepo.getArtistReviews).toHaveBeenCalledWith("red-velvet");
        });
        it("should return an error for invalid artistId", async () => {
            const result = await reviewService.getArtistReviews("");
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toBe("Invalid artistId");
            }
            expect(mockRepo.getArtistReviews).not.toHaveBeenCalled();
        });
        it("should return an empty array if there are no reviews", async () => {
            vi.mocked(mockRepo.getArtistReviews).mockResolvedValue([]);
            const result = await reviewService.getArtistReviews("unknown-artist" , { sortBy: "date", order: "desc" });
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data).toEqual([]);
            }
            expect(mockRepo.getArtistReviews).toHaveBeenCalledWith("unknown-artist", { sortBy: "date", order: "desc" });
        });
        it("should sort by review date descending by default", async () => {

        });
        it("should organize reviews by albumID when specified", async () => {});
        it("should return two arrays: one for album reviews and one for track reviews", async () => {});
        it("should call repo.getArtistReviews with correct parameters", async () => {});
    });

    describe("getting album reviews", () => {
        it("should return reviews for a valid albumId", async () => {});
        it("should return an error for invalid albumId", async () => {});
        it("should return an empty array if there are no reviews", async () => {});
        it("should support sorting options", async () => {});
        it("should call repo.getAlbumReviews with correct parameters", async () => {});
    });

    describe("getting track reviews", () => {
        it("should return reviews for a valid trackId", async () => {});
        it("should return an error for invalid trackId", async () => {});
        it("should return an empty array if there are no reviews", async () => {});
        it("should call repo.getTrackReviews with correct parameters", async () => {});
    });
});