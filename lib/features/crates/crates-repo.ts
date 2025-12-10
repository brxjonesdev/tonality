/* eslint-disable @typescript-eslint/no-explicit-any */
import { Crate } from "./types";

export interface CratesRepo {
    getById(crateId: string): Promise<Crate | null>;
    getByTrackID(trackId: string): Promise<Crate[]>;
    getCrates(type: "popular" | "new"): Promise<Crate[]>;
    getByUserID(userId: string): Promise<Crate[]>;
    getSubmissions(crateId: string): Promise<any[]>;
    create(crateData: Crate): Promise<Crate>;
    update(crateId: string, updates: Partial<Crate>): Promise<Crate>;
    delete(crateId: string): Promise<boolean>;
    addTrack(crateId: string, trackId: string): Promise<boolean>;
    removeTrack(crateId: string, trackId: string): Promise<boolean>;
    reorderTracks(crateId: string, newOrder: string[]): Promise<boolean>;
    addCollaborator(crateId: string, userId: string): Promise<boolean>;
    removeCollaborator(crateId: string, userId: string): Promise<boolean>;
    getTracks(crateId: string): Promise<string[]>;
    submitTrack(crateId: string, trackId: string, fromID: string, toID: string, message?: string): Promise<boolean>;
}