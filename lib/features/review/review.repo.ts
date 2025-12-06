import { Review } from "./types";

export interface ReviewRepo {
    crate(userId: string, itemId: string, rating: number, reviewText?: string): Promise<Review>;
    getById(reviewId: string): Promise<Review | null>;
    update(userId: string, reviewId: string, rating?: number, reviewText?: string): Promise<Review | null>;
    delete(reviewId: string): Promise<boolean>;
    like(reviewId: string, userId: string): Promise<boolean>;
    unlike(reviewId: string, userId: string): Promise<boolean>;
    getArtistReviews(artistId: string): Promise<Review[]>;
    getAlbumReviews(albumId: string): Promise<Review[]>;
    getTrackReviews(trackId: string): Promise<Review[]>;
}