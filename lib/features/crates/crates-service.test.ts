import {describe, it, expect, vi, beforeEach} from "vitest";
import { CratesService, createCratesService } from "./crates-service";
import { CratesRepo } from "./crates-repo";
import { ok, err } from "../../../lib/utils";
import { Crate } from "./types";

describe("CratesService", () => {
    let mockRepo: CratesRepo;
    let cratesService: CratesService;
    
    beforeEach(() => {
        mockRepo = {
            getById: vi.fn(),
            getByTrackID: vi.fn(),
            getCrates: vi.fn(),
            getByUserID: vi.fn(),
            getSubmissions: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            addTrack: vi.fn(),
            removeTrack: vi.fn(),
            reorderTracks: vi.fn(),
            addCollaborator: vi.fn(),
            removeCollaborator: vi.fn(),
            getTracks: vi.fn(),
            submitTrack: vi.fn(),
        };
        const cratesService = createCratesService(mockRepo);
    })
})