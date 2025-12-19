import { createNeonReviewRepo } from './repo-impls/review.repo.neon';
import { createReviewService } from './review.service';

const neonImpl = createNeonReviewRepo();
export const reviewService = createReviewService(neonImpl);
