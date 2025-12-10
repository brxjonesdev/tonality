import { Result } from "@/lib/utils";
import { Review } from "./types";

export interface ReviewRepo {
    create(userId: string, itemId: string, rating: number, reviewText?: string): Promise<Result<Review, string>>;
    getById(reviewId: string): Promise<Review | null>;
    update(userId: string, reviewId: string, rating?: number, reviewText?: string): Promise<Review | null>;
    delete(reviewId: string): Promise<boolean>;
    like(reviewId: string, userId: string): Promise<Result<boolean | string, string>>;
    unlike(reviewId: string, userId: string): Promise<Result<boolean | string, string>>;
    getArtistReviews(artistId: string): Promise<Review[]>;
    getAlbumReviews(albumId: string): Promise<Review[]>;
    getTrackReviews(trackId: string): Promise<Review[]>;
}