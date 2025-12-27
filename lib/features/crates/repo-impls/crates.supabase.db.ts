import { CratesRepo } from "../crates-repo";
import { createClient } from "@/lib/supabase/client";
import { ok, err, Result } from "@/lib/utils";
import { Crate, CrateSubmission, CrateTrack } from "../types";

export function crateSupabaseDbImpl(): CratesRepo {
  const supabase = createClient();
  return {
    async checkTrackExists(
      trackId: string,
      crateId: string,
    ): Promise<Result<boolean, string>> {
      const { data, error } = await supabase
        .from("crate_tracks")
        .select("track_id")
        .eq("track_id", trackId)
        .eq("crate_id", crateId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return ok(false); // No rows found
        }
        return err(`Error checking track existence: ${error.message}`);
      }
      return ok(true);
    },
    async getById(crateId: string): Promise<Result<Crate, string>> {
      const { data, error } = await supabase
        .from("crates")
        .select("*")
        .eq("id", crateId)
        .single();

      if (error) {
        return err(`Error fetching crate by ID: ${error.message}`);
      }
      return ok(data as Crate);
    },
    async getByTrackID(track_id: string): Promise<Result<Crate[], string>> {
      const { data, error } = await supabase
        .from("crates")
        .select("*")
        .eq("track_id", track_id);

      if (error) {
        if (error.code === "42703") {
          // column does not exist, meaning no crates have that track
          // return empty array
          return ok([]);
        }
        return err(
          `Error fetching crates by track ID: ${error.message} ${error.code}`,
        );
      }
      return ok(data as Crate[]);
    },
    async getCrates(type: "popular" | "new"): Promise<Result<Crate[], string>> {
      // just return all crates for now sorted by createdAt desc
      const { data, error } = await supabase
        .from("crates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        return err(`Error fetching crates: ${error.message}`);
      }
      return ok(data as Crate[]);
    },
    async getByUserID(userId: string): Promise<Result<Crate[], string>> {
      const { data, error } = await supabase
        .from("crates")
        .select("*")
        .eq("creator_id", userId);

      if (error) {
        return err(`Error fetching crates by user ID: ${error.message}`);
      }
      return ok(data as Crate[]);
    },
    async getBySubmissionID(
      submissionId: string,
    ): Promise<Result<CrateSubmission, string>> {
      const { data, error } = await supabase
        .from("crate_submissions")
        .select("*")
        .eq("id", submissionId)
        .single();

      if (error) {
        return err(`Error fetching crate submission by ID: ${error.message}`);
      }
      return ok(data as CrateSubmission);
    },
    async getSubmissions(
      crateId: string,
    ): Promise<Result<CrateSubmission[], string>> {
      const { data, error } = await supabase
        .from("crate_submissions")
        .select("*")
        .eq("crate_id", crateId);

      if (error) {
        return err(`Error fetching crate submissions: ${error.message}`);
      }
      return ok(data as CrateSubmission[]);
    },
    async resolveSubmission(
      submissionId: string,
      status: "accepted" | "rejected",
    ): Promise<Result<boolean, string>> {
      const { error } = await supabase
        .from("crate_submissions")
        .update({ status })
        .eq("id", submissionId);

      if (error) {
        return err(`Error resolving crate submission: ${error.message}`);
      }
      return ok(true);
    },
    async create(crateData: Crate): Promise<Result<Crate, string>> {
      const { data, error } = await supabase
        .from("crates")
        .insert(crateData)
        .select()
        .single();

      if (error) {
        return err(`Error creating crate: ${error.message}`);
      }
      return ok(data as Crate);
    },
    async update(updatedCrate: Crate): Promise<Result<Crate, string>> {
      const { data, error } = await supabase
        .from("crates")
        .update(updatedCrate)
        .eq("id", updatedCrate.id)
        .select()
        .single();

      if (error) {
        return err(`Error updating crate: ${error.message}`);
      }
      return ok(data as Crate);
    },
    async delete(crateId: string): Promise<Result<boolean, string>> {
      const { error } = await supabase
        .from("crates")
        .delete()
        .eq("id", crateId);

      if (error) {
        return err(`Error deleting crate: ${error.message}`);
      }

      return ok(true);
    },
    async addTrack(
      crateId: string,
      trackId: string,
    ): Promise<Result<boolean | string, string>> {
      const { error } = await supabase
        .from("crate_tracks")
        .insert({ crate_id: crateId, track_id: trackId });

      if (error) {
        return err(`Error adding track to crate: ${error.message}`);
      }
      return ok(true);
    },
    async removeTrack(
      crateId: string,
      trackId: string,
    ): Promise<Result<boolean, string>> {
      const { error } = await supabase
        .from("crate_tracks")
        .delete()
        .eq("crate_id", crateId)
        .eq("track_id", trackId);

      if (error) {
        return err(`Error removing track from crate: ${error.message}`);
      }
      return ok(true);
    },
    async reorderTracks(
      crateId: string,
      newOrder: string[],
    ): Promise<Result<boolean, string>> {
      // Supabase doesn't support batch updates, so we need to update each track individually
      // This is not ideal for large crates, but works for now
      // In the future, consider using a stored procedure or a different database that supports batch updates
      // Alternatively, we could delete all tracks and re-insert them in the new order
      for (let i = 0; i < newOrder.length; i++) {
        const trackId = newOrder[i];
        const { error } = await supabase
          .from("crate_tracks")
          .update({ order: i })
          .eq("crate_id", crateId)
          .eq("track_id", trackId);

        if (error) {
          return err(`Error reordering tracks: ${error.message}`);
        }
      }
      return ok(true);
    },
    async getTracks(crateId: string): Promise<Result<CrateTrack[], string>> {
      const { data, error } = await supabase
        .from("crate_tracks")
        .select("*")
        .eq("crate_id", crateId)
        .order("id", { ascending: true });

      if (error) {
        return err(`Error fetching crate tracks: ${error.message}`);
      }
      return ok(data as CrateTrack[]);
    },
    async submitTrack(
      crateId: string,
      trackId: string,
      fromID: string,
      message?: string,
    ): Promise<Result<boolean, string>> {
      const { error } = await supabase.from("crate_submissions").insert({
        crate_id: crateId,
        track_id: trackId,
        from_id: fromID,
        message: message || null,
      });

      if (error) {
        return err(`Error submitting track to crate: ${error.message}`);
      }
      return ok(true);
    },
  };
}
