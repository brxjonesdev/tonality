/* eslint-disable @typescript-eslint/no-explicit-any */
import { Result } from "@/lib/utils";
import { Crate, CrateSubmission, CrateTrack } from "./types";

export interface CratesRepo {
  checkTrackExists(
    trackId: string,
    crateId: string,
  ): Promise<Result<boolean, string>>;
  getById(crateId: string): Promise<Result<Crate, string>>;
  getByTrackID(trackId: string): Promise<Result<Crate[], string>>;
  getCrates(type: "popular" | "new"): Promise<Result<Crate[], string>>;
  getByUserID(userId: string): Promise<Result<Crate[], string>>;
  getBySubmissionID(submissionId: string): Promise<Result<Crate, string>>;
  getSubmissions(crateId: string): Promise<Result<CrateSubmission[], string>>;
  resolveSubmission(
    status: "accepted" | "rejected",
  ): Promise<Result<boolean, string>>;
  create(crateData: Crate): Promise<Result<Crate, string>>;
  update(
    crateId: string,
    updates: Partial<Crate>,
  ): Promise<Result<Crate, string>>;
  delete(crateId: string): Promise<Result<boolean, string>>;
  addTrack(crateId: string, trackId: string): Promise<Result<boolean, string>>;
  removeTrack(
    crateId: string,
    trackId: string,
  ): Promise<Result<boolean, string>>;
  reorderTracks(
    crateId: string,
    newOrder: string[],
  ): Promise<Result<boolean, string>>;
  getTracks(crateId: string): Promise<Result<CrateTrack[], string>>;
  submitTrack(
    crateId: string,
    trackId: string,
    fromID: string,
    toID: string,
    message?: string,
  ): Promise<Result<boolean, string>>;
}
