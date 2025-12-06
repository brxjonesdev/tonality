import { ReviewRepo } from "../review.repo";
import { Review } from "../types";
const sampleReviews: Review[] = [
  {
    id: "r1",
    userId: "u1",
    itemId: "track_123",
    rating: 5,
    reviewText: "This track has been on repeat all week. The mix is so clean.",
    createdAt: "2025-01-01T12:00:00Z",
    updatedAt: "2025-01-01T12:00:00Z",
  },
  {
    id: "r2",
    userId: "u2",
    itemId: "album_555",
    rating: 4,
    reviewText: "Solid album. A few skips but the highs are really high.",
    createdAt: "2025-01-03T10:21:00Z",
    updatedAt: "2025-01-03T10:21:00Z",
  },
  {
    id: "r3",
    userId: "u3",
    itemId: "artist_redvelvet",
    rating: 5,
    reviewText: "They never miss. Incredible vocals and production.",
    createdAt: "2025-01-04T09:10:00Z",
    updatedAt: "2025-01-04T09:10:00Z",
  },
  {
    id: "r4",
    userId: "u1",
    itemId: "album_989",
    rating: 3,
    reviewText: "Good ideas but the pacing felt off. Still enjoyable.",
    createdAt: "2025-01-05T14:00:00Z",
    updatedAt: "2025-01-05T14:00:00Z",
  },
  {
    id: "r5",
    userId: "u4",
    itemId: "track_945",
    rating: 2,
    reviewText: "Production was muddy. Not really for me.",
    createdAt: "2025-01-06T18:42:00Z",
    updatedAt: "2025-01-06T18:42:00Z",
  },
  {
    id: "r6",
    userId: "u2",
    itemId: "artist_777",
    rating: 4,
    reviewText: "Saw them live last year—this review is basically nostalgia.",
    createdAt: "2025-01-07T11:30:00Z",
    updatedAt: "2025-01-07T11:30:00Z",
  },
  {
    id: "r7",
    userId: "u5",
    itemId: "track_333",
    rating: 5,
    reviewText: "One of the best chorus melodies I've heard in a long time.",
    createdAt: "2025-01-08T08:20:00Z",
    updatedAt: "2025-01-08T08:20:00Z",
  },
  {
    id: "r8",
    userId: "u3",
    itemId: "album_1010",
    rating: 1,
    reviewText: "Really disappointed… felt rushed and repetitive.",
    createdAt: "2025-01-09T22:15:00Z",
    updatedAt: "2025-01-09T22:15:00Z",
  },
  {
    id: "r9",
    userId: "u6",
    itemId: "artist_123",
    rating: 5,
    reviewText: "Been a fan for years. Their discography has no weak points.",
    createdAt: "2025-01-10T15:00:00Z",
    updatedAt: "2025-01-10T15:00:00Z",
  },
  {
    id: "r10",
    userId: "u1",
    itemId: "track_888",
    rating: 4,
    reviewText: "Energetic, catchy, and perfect for driving at night.",
    createdAt: "2025-01-12T13:00:00Z",
    updatedAt: "2025-01-12T13:00:00Z",
  }
];


export function createInMemoryReviewRepo(): ReviewRepo {
  const reviews = new Map<string, Review>();
  const likes = new Map<string, Set<string>>();
  // add sample reviews to the in-memory store
    for (const review of sampleReviews) {
      reviews.set(review.id, review);
    }

  function generateId() {
    return Math.random().toString(36).slice(2);
  }

  return {
    async crate(userId, itemId, rating, reviewText) {
      const id = generateId();
      const now = new Date().toISOString();

      const review: Review = {
        id,
        userId,
        itemId,
        rating,
        reviewText,
        createdAt: now,
        updatedAt: now,
      };

      reviews.set(id, review);
      return review;
    },

    async getById(reviewId) {
      return reviews.get(reviewId) ?? null;
    },

    async update(userId, reviewId, rating, reviewText) {
      const existing = reviews.get(reviewId);
      if (!existing) return null;
      if (existing.userId !== userId) return null; // naive permission check

      const updated: Review = {
        ...existing,
        rating: rating ?? existing.rating,
        reviewText: reviewText ?? existing.reviewText,
        updatedAt: new Date().toISOString(),
      };

      reviews.set(reviewId, updated);
      return updated;
    },

    async delete(reviewId) {
      likes.delete(reviewId);
      return reviews.delete(reviewId);
    },

    async like(reviewId, userId) {
      if (!reviews.has(reviewId)) return false;

      if (!likes.has(reviewId)) {
        likes.set(reviewId, new Set());
      }

      likes.get(reviewId)!.add(userId);
      return true;
    },

    async unlike(reviewId, userId) {
      if (!likes.has(reviewId)) return false;
      return likes.get(reviewId)!.delete(userId);
    },

    async getArtistReviews(artistId) {
      return [...reviews.values()].filter(r => r.itemId === artistId);
    },

    async getAlbumReviews(albumId) {
      return [...reviews.values()].filter(r => r.itemId === albumId);
    },

    async getTrackReviews(trackId) {
      return [...reviews.values()].filter(r => r.itemId === trackId);
    },
  };
}
