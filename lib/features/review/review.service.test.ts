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

    describe("creating a review", () => {});
    describe("getting a review by ID", () => {});
    describe("updating a review", () => {});
    describe("deleting a review", () => {});
    describe("liking a review", () => {});
    describe("unliking a review", () => {});
    describe("getting artist reviews    ", () => {});
    describe("getting album reviews", () => {});
    describe("getting track reviews", () => {});
})