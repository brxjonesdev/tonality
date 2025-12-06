import { Crate, CrateSubmission, CrateTrack } from "./types";
import { Result, ok, err } from "@/lib/utils";

export interface CratesService {
  // Fetchers
  getCrateById(crateId: string): Promise<Result<Crate | null, string>>;
  getCratesIncludingTrack(trackId: string): Promise<Result<Crate[], string>>;
  getPopularCrates(): Promise<Result<Crate[], string>>;
  getNewCrates(): Promise<Result<Crate[], string>>;
  getUserCrates(userId: string): Promise<Result<Crate[], string>>;
  getRandomUserCrates(): Promise<Result<Crate[], string>>;

  // Submissions
  getCrateSubmissions(crateId: string): Promise<Result<CrateSubmission[], string>>;

  // Mutators
  createNewCrate(crateData: Crate): Promise<Result<Crate, string>>;
  updateCrate(crateId: string, updates: Partial<Crate>): Promise<Result<Crate, string>>;
  deleteCrate(crateId: string): Promise<Result<boolean, string>>;

  addTrackToCrate(crateId: string, trackId: string): Promise<Result<boolean, string>>;
  removeTrackFromCrate(crateId: string, trackId: string): Promise<Result<boolean, string>>;
  reorderTracks(crateId: string, newOrder: string[]): Promise<Result<boolean, string>>;
  getTracksInCrate(crateId: string): Promise<Result<CrateTrack[], string>>;

  submitTrackToCrate(
    fromID: string,
    toID: string,
    trackId: string,
    crateID: string
  ): Promise<Result<boolean, string>>;

  acceptTrackSubmission(submissionId: string): Promise<Result<boolean, string>>;
  rejectTrackSubmission(submissionId: string): Promise<Result<boolean, string>>;

  addCollaborator(crateId: string, userId: string): Promise<Result<boolean, string>>;
  removeCollaborator(crateId: string, userId: string): Promise<Result<boolean, string>>;
}

export function createCratesService(repo: any): CratesService {
  return {
    // FETCHERS
    async getCrateById(crateId: string) {
      return ok<Crate | null>(null);
    },

    async getCratesIncludingTrack(trackId: string) {
      return ok<Crate[]>([]);
    },

    async getPopularCrates() {
      return ok<Crate[]>([]);
    },

    async getNewCrates() {
      return ok<Crate[]>([]);
    },

    async getUserCrates(userId: string) {
      return ok<Crate[]>([]);
    },

    async getRandomUserCrates() {
      return ok<Crate[]>([]);
    },

    // SUBMISSIONS
    async getCrateSubmissions(crateId: string) {
      return ok<CrateSubmission[]>([]);
    },

    // MUTATORS
    async createNewCrate(crateData: any) {
      return err("not implemented");
    },

    async updateCrate(crateId: string, updates: Partial<Crate>) {
      return err("not implemented");
    },

    async deleteCrate(crateId: string) {
      return ok(false);
    },

    async addTrackToCrate(crateId: string, trackId: string) {
      return ok(false);
    },

    async removeTrackFromCrate(crateId: string, trackId: string) {
      return ok(false);
    },

    async reorderTracks(crateId: string, newOrder: string[]) {
      return ok(false);
    },

    async getTracksInCrate(crateId: string) {
      return ok<CrateTrack[]>([]);
    },

    async submitTrackToCrate(fromID, toID, trackId, crateID) {
      return ok(false);
    },

    async acceptTrackSubmission(submissionId: string) {
      return ok(false);
    },

    async rejectTrackSubmission(submissionId: string) {
      return ok(false);
    },

    async addCollaborator(crateId: string, userId: string) {
      return ok(false);
    },

    async removeCollaborator(crateId: string, userId: string) {
      return ok(false);
    },
  };
}

export const cratesService = createCratesService(null);
