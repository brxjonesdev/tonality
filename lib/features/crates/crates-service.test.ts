import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CratesService, createCratesService } from "./crates-service";
import { CratesRepo } from "./crates-repo";
import { ok, err } from "../../../lib/utils";

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

    cratesService = createCratesService(mockRepo);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });


  /** ---------------------- FETCHERS ---------------------- **/

  describe("getCrateById", () => {
    it("should fetch a crate by ID", () => {
      // TODO
    });
  });

  describe("getCratesIncludingTrack", () => {
    it("should fetch crates containing a track", () => {
      // TODO
    });
  });

  describe("getPopularCrates", () => {
    it("should fetch popular crates", () => {
      // TODO
    });
  });

  describe("getNewCrates", () => {
    it("should fetch new crates", () => {
      // TODO
    });
  });

  describe("getUserCrates", () => {
    it("should fetch user crates", () => {
      // TODO
    });
  });

  describe("getCrateSubmissions", () => {
    it("should fetch crate submissions", () => {
      // TODO
    });
  });


  /** ---------------------- MUTATORS ---------------------- **/

  describe("createNewCrate", () => {
    it("should create a new crate", () => {
      // TODO
    });
  });

  describe("updateCrate", () => {
    it("should update a crate", () => {
      // TODO
    });
  });

  describe("deleteCrate", () => {
    it("should delete a crate", () => {
      // TODO
    });
  });


  /** ---------------------- TRACK ACTIONS ---------------------- **/

  describe("addTrackToCrate", () => {
    it("should add a track to a crate", () => {
      // TODO
    });
  });

  describe("removeTrackFromCrate", () => {
    it("should remove a track from a crate", () => {
      // TODO
    });
  });

  describe("reorderTracks", () => {
    it("should reorder tracks", () => {
      // TODO
    });
  });

  describe("getTracksInCrate", () => {
    it("should get tracks in a crate", () => {
      // TODO
    });
  });


  /** ---------------------- SUBMISSIONS ---------------------- **/

  describe("submitTrackToCrate", () => {
    it("should submit a track to a crate", () => {
      // TODO
    });
  });

  describe("acceptTrackSubmission", () => {
    it("should accept a track submission", () => {
      // TODO
    });
  });

  describe("rejectTrackSubmission", () => {
    it("should reject a track submission", () => {
      // TODO
    });
  });


  /** ---------------------- COLLABORATORS ---------------------- **/

  describe("addCollaborator", () => {
    it("should add a collaborator to a crate", () => {
      // TODO
    });
  });

  describe("removeCollaborator", () => {
    it("should remove a collaborator from a crate", () => {
      // TODO
    });
  });

});
