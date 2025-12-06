import { create } from "domain";
import { createReviewService } from "./review.service";

export const reviewService = createReviewService(null);