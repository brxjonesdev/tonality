export interface ReviewService {
    createReview(userId: string, itemId: string, rating: number, reviewText?: string): Promise<any>;
    getReviewById(reviewId: string): Promise<any>;
    updateReview(userId:string, reviewId: string, rating?: number, reviewText?: string): Promise<any>;
    deleteReview(reviewId: string): Promise<void>;
    likeReview(reviewId: string, userId: string): Promise<void>;
    unlikeReview(reviewId: string, userId: string): Promise<void>;
    getArtistReviews(artistId: string): Promise<any[]>;
    getAlbumReviews(albumId: string): Promise<any[]>;
    getTrackReviews(trackId: string): Promise<any[]>;
}

export function createReviewService(repo: any): ReviewService {
    return {
        async createReview(userId: string, itemId: string, rating: number, reviewText?: string): Promise<any> {
            return [];
        },
        
        async getReviewById(reviewId: string): Promise<any> {
            return [];
        },
        
        async updateReview(userId: string, reviewId: string, rating?: number, reviewText?: string): Promise<any> {
            return [];
        },
        
        async deleteReview(reviewId: string): Promise<void> {
            return;
        },
        
        async likeReview(reviewId: string, userId: string): Promise<void> {
            return;
        },
        
        async unlikeReview(reviewId: string, userId: string): Promise<void> {
            return;
        },
        
        async getArtistReviews(artistId: string): Promise<any[]> {
            return [];
        },
        
        async getAlbumReviews(albumId: string): Promise<any[]> {
            return [];
        },
        
        async getTrackReviews(trackId: string): Promise<any[]> {
            return [];
        }
    };
}