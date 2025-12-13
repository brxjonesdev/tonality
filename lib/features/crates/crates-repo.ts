/* eslint-disable @typescript-eslint/no-explicit-any */
import { Result } from "@/lib/utils";
import { Crate } from "./types";

export interface CratesRepo {
    checkTrackExists(trackId: string, crateId: string): Promise<Result<boolean, string>>;
    getById(crateId: string): Promise<Result<Crate, string>>;
    getByTrackID(trackId: string): Promise<Result<Crate[], string>>;
    getCrates(type: "popular" | "new"): Promise<Crate[]>;
    getByUserID(userId: string): Promise<Crate[]>;
    getSubmissions(crateId: string): Promise<any[]>;
    create(crateData: Crate): Promise<Result<Crate, string>>;
    update(crateId: string, updates: Partial<Crate>): Promise<Result<Crate, string>>;
    delete(crateId: string): Promise<Result<boolean, string>>;
    addTrack(crateId: string, trackId: string): Promise<Result<boolean, string>>;
    removeTrack(crateId: string, trackId: string): Promise<Result<boolean, string>>;
    reorderTracks(crateId: string, newOrder: string[]): Promise<Result<boolean, string>>;
    addCollaborator(crateId: string, userId: string): Promise<Result<boolean, string>>;
    removeCollaborator(crateId: string, userId: string): Promise<Result<boolean, string>>;
    getTracks(crateId: string): Promise<Result<string[], string>>;
    submitTrack(crateId: string, trackId: string, fromID: string, toID: string, message?: string): Promise<Result<boolean, string>>;
}