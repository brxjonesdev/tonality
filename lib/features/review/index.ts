import { createReviewService } from "./review.service";
import { createInMemoryReviewRepo } from "./impls/memory-repo";

export const reviewService = createReviewService(createInMemoryReviewRepo());