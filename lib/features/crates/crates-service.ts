/* eslint-disable @typescript-eslint/no-explicit-any */
import { nanoid } from "nanoid";
import { CratesRepo } from "./crates-repo";
import {
  Crate,
  CrateSubmission,
  CrateTrack,
  CreateCrateDTO,
  UpdateCrateDTO,
} from "./types";
import { Result, ok, err } from "@/lib/utils";

export interface CratesService {
  /** -------------------- FETCHERS -------------------- **/
  getCrateById(crateId: string): Promise<Result<Crate | null, string>>;
  getCratesIncludingTrack(trackId: string): Promise<Result<Crate[], string>>;
  getPopularCrates(): Promise<Result<Crate[], string>>;
  getNewCrates(): Promise<Result<Crate[], string>>;
  getUserCrates(
    userId: string,
    targetUserId?: string,
  ): Promise<Result<Crate[], string>>;
  getCrateSubmissions(
    userId: string,
    crateId: string,
  ): Promise<Result<CrateSubmission[], string>>;

  /** -------------------- MUTATORS -------------------- **/
  createNewCrate(
    crateData: CreateCrateDTO,
    userID: string,
  ): Promise<Result<Crate, string>>;
  updateCrate(
    crateId: string,
    updates: UpdateCrateDTO,
    userID: string,
  ): Promise<Result<Crate, string>>;
  deleteCrate(
    crateId: string,
    userID: string,
  ): Promise<Result<boolean, string>>;

  /** -------------------- TRACK ACTIONS -------------------- **/
  addTrackToCrate(
    crateId: string,
    trackId: string,
  ): Promise<Result<boolean, string>>;
  removeTrackFromCrate(
    crateId: string,
    trackId: string,
  ): Promise<Result<boolean, string>>;
  reorderTracks(
    crateId: string,
    newOrder: string[],
  ): Promise<Result<boolean, string>>;
  getTracksInCrate(crateId: string): Promise<Result<CrateTrack[], string>>;

  /** -------------------- SUBMISSIONS -------------------- **/
  submitTrackToCrate(
    fromID: string,
    toID: string,
    trackId: string,
    crateID: string,
  ): Promise<Result<boolean, string>>;

  acceptTrackSubmission(submissionId: string): Promise<Result<boolean, string>>;
  rejectTrackSubmission(submissionId: string): Promise<Result<boolean, string>>;
  getCrateSubmissions(
    userId: string,
    crateId: string,
  ): Promise<Result<CrateSubmission[], string>>;
}

export function createCratesService(repo: CratesRepo): CratesService {
  return {
    // FETCHERS
    async getCrateById(crateId: string) {
      if (!crateId) return err("Invalid crate ID");
      const result = await repo.getById(crateId);
      if (!result.ok) {
        return err(result.error);
      }
      return ok(result.data);
    },

    async getCratesIncludingTrack(trackId: string) {
      if (!trackId) return err("Invalid track ID");
      const result = await repo.getByTrackID(trackId);
      if (!result.ok) {
        return err(result.error);
      }
      return ok(result.data);
    },

    async getPopularCrates() {
      const result = await repo.getCrates("popular");
      if (!result.ok) {
        return err(result.error);
      }
      return ok(result.data);
    },

    async getNewCrates() {
      const result = await repo.getCrates("new");
      if (!result.ok) {
        return err(result.error);
      }
      return ok(result.data);
    },

    async getUserCrates(userId: string, targetUserId?: string) {
      if (!userId) return err("Invalid or Missing user ID");
      const result = await repo.getByUserID(userId);
      if (!result.ok) {
        return err(result.error);
      }
      const crates = result.data;

      if (userId === targetUserId || !targetUserId) {
        return ok(crates);
      }

      return ok(crates.filter((crate) => crate.isPublic));
    },

    // SUBMISSIONS
    async getCrateSubmissions(userId: string, crateId: string) {
      if (!userId) return err("Invalid or Missing user ID");
      if (!crateId) return err("Invalid or Missing crate ID");

      const crateResult = await repo.getById(crateId);
      if (!crateResult.ok) {
        return err(crateResult.error);
      }
      const crate = crateResult.data;
      if (crate.creatorId !== userId) {
        return err("Unauthorized: You do not own this crate");
      }

      const submissionsResult = await repo.getSubmissions(crateId);
      if (!submissionsResult.ok) {
        return err(submissionsResult.error);
      }
      return ok(submissionsResult.data);
    },

    // MUTATORS
    async createNewCrate(crateData: CreateCrateDTO, userID: string) {
      if (!userID) return err("Invalid or Missing user ID");
      if (!crateData.name) return err("Missing required crate data");

      const newCrate: Crate = {
        id: `crate-${nanoid(15)}`,
        name: crateData.name,
        description: crateData.description || "",
        coverImage: crateData.coverImage,
        tags: crateData.tags || [],
        creatorId: userID,
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await repo.create(newCrate);
      if (!result.ok) {
        return err(result.error);
      }
      return ok(result.data);
    },

    async updateCrate(
      crateId: string,
      updates: Partial<Crate>,
      userID: string,
    ) {
      if (!userID) return err("Invalid or Missing user ID");
      if (!crateId) return err("Invalid crate ID");

      const existingCrateResult = await repo.getById(crateId);
      if (!existingCrateResult.ok) {
        return err(existingCrateResult.error);
      }
      const existingCrate = existingCrateResult.data;
      if (!existingCrate) {
        return err("Crate not found");
      }
      if (existingCrate.creatorId !== userID) {
        return err("Unauthorized: You do not own this crate");
      }

      const updatedCrate: Crate = {
        ...existingCrate,
        ...updates,
        updatedAt: new Date(),
      };
      const result = await repo.update(updatedCrate);
      if (!result.ok) {
        return err(result.error);
      }
      return ok(result.data);
    },

    async deleteCrate(crateId: string, userID: string) {
      if (!userID) return err("Invalid or Missing user ID");
      if (!crateId) return err("Invalid crate ID");

      const existingCrateResult = await repo.getById(crateId);
      if (!existingCrateResult.ok) {
        return err(existingCrateResult.error);
      }
      const existingCrate = existingCrateResult.data;
      if (existingCrate.creatorId !== userID) {
        return err("Unauthorized: You do not own this crate");
      }
      const result = await repo.delete(crateId);
      if (!result.ok) {
        return err(result.error);
      }
      return ok(result.data);
    },

    async addTrackToCrate(crateId: string, trackId: string) {
      if (!crateId) return err("Invalid crate ID");
      if (!trackId) return err("Invalid track ID");
      return err("not implemented");
    },

    async removeTrackFromCrate(crateId: string, trackId: string) {
      return err("not implemented");
    },

    async reorderTracks(crateId: string, newOrder: string[]) {
      return err("not implemented");
    },

    async getTracksInCrate(crateId: string) {
      return err("not implemented");
    },

    async submitTrackToCrate(fromID, toID, trackId, crateID) {
      return err("not implemented");
    },

    async acceptTrackSubmission(submissionId: string) {
      return err("not implemented");
    },

    async rejectTrackSubmission(submissionId: string) {
      return err("not implemented");
    },
  };
}
