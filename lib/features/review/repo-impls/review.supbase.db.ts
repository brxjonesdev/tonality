import { ReviewRepo } from "../review.repo";
import { createClient } from "@/lib/supabase/client";
import { ok, err, Result } from "@/lib/utils";
import { Review, Sorting } from "../types";

export function reviewSupabaseDbImpl(): ReviewRepo {
  const supabase = createClient();

  return {
    async create(review: Review): Promise<Result<Review, string>> {
      // Map camelCase to snake_case DB columns
      const dbRow = {
        id: review.id || undefined,
        user_id: review.userId,
        item_id: review.itemId,
        artist_id: review.artistID,
        rating: review.rating,
        review_text: review.reviewText ?? null,
        created_at: review.createdAt ?? new Date().toISOString(),
        updated_at: review.updatedAt ?? new Date().toISOString(),
        edited: review.edited ?? false,
        type: review.type,
      };

      const { data, error } = await supabase
        .from("reviews")
        .insert(dbRow)
        .select()
        .single();

      if (error) {
        return err(`Error creating review: ${error.message}`);
      }
      return ok(data as Review);
    },

    async getById(reviewId: string): Promise<Result<Review, string>> {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("id", reviewId)
        .single();

      if (error) {
        return err(`Error fetching review by ID: ${error.message}`);
      }
      return ok(data as Review);
    },

    async getByUserAndItem(
      userId: string,
      itemId: string,
    ): Promise<Result<Review | null, string>> {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", userId)
        .eq("item_id", itemId)
        .single();

      if (error) {
        // PGRST116: no rows found for single()
        if ((error as any).code === "PGRST116") {
          return ok(null);
        }
        return err(`Error fetching review by user and item: ${error.message}`);
      }
      return ok(data as Review);
    },

    async update(
      reviewId: string,
      rating?: number,
      reviewText?: string,
    ): Promise<Result<Review, string>> {
      const updatePayload: any = {
        updated_at: new Date().toISOString(),
        edited: true,
      };
      if (rating !== undefined) updatePayload.rating = rating;
      if (reviewText !== undefined) updatePayload.review_text = reviewText;

      const { data, error } = await supabase
        .from("reviews")
        .update(updatePayload)
        .eq("id", reviewId)
        .select()
        .single();

      if (error) {
        return err(`Error updating review: ${error.message}`);
      }
      return ok(data as Review);
    },

    async delete(reviewId: string): Promise<Result<boolean, string>> {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) {
        return err(`Error deleting review: ${error.message}`);
      }
      return ok(true);
    },

    async hasUserLiked(
      reviewId: string,
      userId: string,
    ): Promise<Result<boolean, string>> {
      const { data, error } = await supabase
        .from("review_likes")
        .select("id")
        .eq("review_id", reviewId)
        .eq("user_id", userId)
        .single();

      if (error) {
        if ((error as any).code === "PGRST116") {
          return ok(false);
        }
        return err(`Error checking like existence: ${error.message}`);
      }
      return ok(true);
    },

    async like(
      reviewId: string,
      userId: string,
    ): Promise<Result<boolean | string, string>> {
      // check review exists
      const { data: reviewData, error: reviewError } = await supabase
        .from("reviews")
        .select("id")
        .eq("id", reviewId)
        .single();

      if (reviewError) {
        if ((reviewError as any).code === "PGRST116") {
          return ok("Review does not exist");
        }
        return err(`Error checking review existence: ${reviewError.message}`);
      }

      const { error } = await supabase.from("review_likes").insert({
        review_id: reviewId,
        user_id: userId,
        created_at: new Date().toISOString(),
      });

      if (error) {
        return err(`Error liking review: ${error.message}`);
      }
      return ok(true);
    },

    async unlike(
      reviewId: string,
      userId: string,
    ): Promise<Result<boolean | string, string>> {
      const { data, error } = await supabase
        .from("review_likes")
        .delete()
        .eq("review_id", reviewId)
        .eq("user_id", userId)
        .select();

      if (error) {
        return err(`Error unliking review: ${error.message}`);
      }

      // If no rows were deleted, treat as "does not exist"
      if (!data || (Array.isArray(data) && data.length === 0)) {
        return ok("Review does not exist");
      }

      return ok(true);
    },

    async getArtistReviews(
      artistId: string,
      sort: Sorting,
    ): Promise<Result<Review[], string>> {
      const { sortBy, order, page, pageSize } = sort;
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      const orderBy = sortBy === "rating" ? "rating" : "created_at"; // default to date

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("artist_id", artistId)
        .order(orderBy, { ascending: order === "asc" })
        .range(start, end);

      if (error) {
        return err(`Error fetching artist reviews: ${error.message}`);
      }
      return ok(data as Review[]);
    },

    async getAlbumReviews(
      albumId: string,
      sort: Sorting,
    ): Promise<Result<Review[], string>> {
      const { sortBy, order, page, pageSize } = sort;
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      const orderBy = sortBy === "rating" ? "rating" : "created_at"; // default to date

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("item_id", albumId)
        .eq("type", "album")
        .order(orderBy, { ascending: order === "asc" })
        .range(start, end);

      if (error) {
        return err(`Error fetching album reviews: ${error.message}`);
      }
      return ok(data as Review[]);
    },

    async getTrackReviews(
      trackId: string,
      sort: Sorting,
    ): Promise<Result<Review[], string>> {
      const { sortBy, order, page, pageSize } = sort;
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      const orderBy = sortBy === "rating" ? "rating" : "created_at"; // default to date

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("item_id", trackId)
        .eq("type", "track")
        .order(orderBy, { ascending: order === "asc" })
        .range(start, end);

      if (error) {
        return err(`Error fetching track reviews: ${error.message}`);
      }
      return ok(data as Review[]);
    },
  };
}
