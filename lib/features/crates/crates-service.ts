/* eslint-disable @typescript-eslint/no-explicit-any */
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
  getUserCrates(userId: string): Promise<Result<Crate[], string>>;
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
  deleteCrate(crateId: string): Promise<Result<boolean, string>>;

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
      return err("not implemented");
    },

    async getCratesIncludingTrack(trackId: string) {
      return err("not implemented");
    },

    async getPopularCrates() {
      return err("not implemented");
    },

    async getNewCrates() {
      return err("not implemented");
    },

    async getUserCrates(userId: string) {
      return err("not implemented");
    },

    // SUBMISSIONS
    async getCrateSubmissions(userId: string, crateId: string) {
      return err("not implemented");
    },

    // MUTATORS
    async createNewCrate(crateData: any) {
      return err("not implemented");
    },

    async updateCrate(crateId: string, updates: Partial<Crate>) {
      return err("not implemented");
    },

    async deleteCrate(crateId: string) {
      return err("not implemented");
    },

    async addTrackToCrate(crateId: string, trackId: string) {
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
