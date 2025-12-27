import { reviewSupabaseDbImpl } from "./repo-impls/review.supbase.db";
import { createReviewService } from "./review.service";

const supabaseDB = reviewSupabaseDbImpl();
export const reviewService = createReviewService(supabaseDB);
