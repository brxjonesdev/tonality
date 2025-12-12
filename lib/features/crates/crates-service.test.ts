import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CratesService, createCratesService } from "./crates-service";
import { CratesRepo } from "./crates-repo";
import { ok, err } from "../../../lib/utils";
import { Crate } from "./types";

describe("CratesService", () => {
  let mockRepo: CratesRepo;
  let cratesService: CratesService;
  const sampleCrate: Crate = {
    id: "crate1",
    name: "Chill Vibes",
    description: "A collection of relaxing tracks.",
    coverImage: "http://example.com/cover.jpg",
    tags: ["chill", "relax"],
    creatorId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  // random ammount of crates
  const generateCrates = (count: number): Crate[] => {
    const crates: Crate[] = [];
    for (let i = 0; i < count; i++) {
      crates.push({
        id: `crate${i}`,
        name: `Crate ${i}`,
        description: `Description for crate ${i}`,
        coverImage: `http://example.com/cover${i}.jpg`,
        tags: [`tag${i}`, `tag${i+1}`],
        creatorId: `user${i % 5}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return crates;
  };

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

  describe("getCrateById", () => {
    it("returns crate on success", async () => {
      vi.mocked(mockRepo.getById).mockResolvedValueOnce(ok(sampleCrate));
      const result = await cratesService.getCrateById("crate1");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(sampleCrate);
      }
      expect(mockRepo.getById).toHaveBeenCalledWith("crate1");
    });
    it("returns error when crate does not exist", async () => {
      vi.mocked(mockRepo.getById).mockResolvedValueOnce(err("Crate not found"));
      const result = await cratesService.getCrateById("nonexistent");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Crate not found");
      }
      expect(mockRepo.getById).toHaveBeenCalledWith("nonexistent");
    });
    it("returns error when repo returns undefined");
    it("returns error on repo failure");
    it("returns error on repo exception");
    it("returns error when id is invalid");
  });

  describe("getCratesIncludingTrack", () => {
    it("returns crates on success");
    it("returns empty array if no crates found");
    it("returns error if trackId is invalid");
    it("returns error on repo failure");
    it("returns error on repo exception");
    it("returns error if repo returns undefined");
  });

  describe("getPopularCrates", () => {
    it("returns crates on success");
    it("returns empty list if none found");
    it("returns error if repo returns malformed data");
    it("returns error on repo failure");
    it("returns error on repo exception");
    it("returns error if repo returns undefined");
  });

  describe("getNewCrates", () => {
    it("returns crates on success");
    it("returns empty list if repo has no new crates");
    it("returns error on repo failure");
    it("returns error on repo exception");
    it("returns error if repo returns undefined");
    it("returns error if crate shape is invalid");
  });

  describe("getUserCrates", () => {
    it("returns user crates on success");
    it("returns empty list if user has no crates");
    it("returns error if userId is invalid");
    it("returns error on repo failure");
    it("returns error on repo exception");
    it("returns error if repo returns undefined");
  });

  describe("getCrateSubmissions", () => {
    it("returns submissions on success");
    it("returns empty list if no submissions exist");
    it("returns error if crateId is invalid");
    it("returns error if repo returns undefined");
    it("returns error on repo failure");
    it("returns error on repo exception");
    it("returns error on malformed submission data");
  });

  describe("createNewCrate", () => {
    it("creates crate successfully");
    it("returns error if crateData missing fields");
    it("returns error if crateData has invalid types");
    it("returns error if crate with same name exists");
    it("returns error if repo returns null");
    it("returns error if repo returns undefined");
    it("returns error on repo failure");
    it("returns error on repo exception");
  });

  describe("updateCrate", () => {
    it("updates crate successfully");
    it("returns error if crate does not exist");
    it("returns error if updateData invalid");
    it("returns error if updateData empty");
    it("returns error if repo returns null");
    it("returns error if repo returns undefined");
    it("returns error on repo failure");
    it("returns error on repo exception");
  });

  describe("deleteCrate", () => {
    it("deletes crate successfully");
    it("returns error if crate does not exist");
    it("returns error if repo returns undefined");
    it("returns error if repo prevents deletion due to constraints");
    it("returns error on repo failure");
    it("returns error on repo exception");
  });

  describe("addTrackToCrate", () => {
    it("adds track successfully");
    it("returns error if crate does not exist");
    it("returns error if track already exists");
    it("returns error if trackId invalid");
    it("returns error if repo returns undefined");
    it("returns error on repo failure");
    it("returns error on repo exception");
  });

  describe("removeTrackFromCrate", () => {
    it("removes track successfully");
    it("returns error if crate does not exist");
    it("returns error if track not found in crate");
    it("returns error if repo returns undefined");
    it("returns error on repo failure");
    it("returns error on repo exception");
  });

  describe("reorderTracks", () => {
    it("reorders tracks successfully");
    it("returns error if order array does not match existing tracks");
    it("returns error if order contains missing ids");
    it("returns error if order contains extra ids");
    it("returns error if repo returns undefined");
    it("returns error on repo failure");
    it("returns error on repo exception");
    it("returns error if crate does not exist");
  });

  describe("getTracksInCrate", () => {
    it("returns tracks on success");
    it("returns empty list when crate has no tracks");
    it("returns error if crateId invalid");
    it("returns error if repo returns undefined");
    it("returns error on repo failure");
    it("returns error on repo exception");
    it("returns error on malformed track entry");
  });

  describe("submitTrackToCrate", () => {
    it("submits track successfully");
    it("returns error if track already submitted");
    it("returns error if crate does not exist");
    it("returns error if trackId invalid");
    it("returns error if repo returns undefined");
    it("returns error on repo failure");
    it("returns error on repo exception");
  });

  describe("acceptTrackSubmission", () => {
    it("accepts submission successfully");
    it("returns error if submission does not exist");
    it("returns error if submission already accepted");
    it("returns error if repo returns undefined");
    it("returns error on repo failure");
    it("returns error on repo exception");
  });

  describe("rejectTrackSubmission", () => {
    it("rejects submission successfully");
    it("returns error if submission does not exist");
    it("returns error if repo returns undefined");
    it("returns error on repo failure");
    it("returns error on repo exception");
  });

  describe("addCollaborator", () => {
    it("adds collaborator successfully");
    it("returns error if crate does not exist");
    it("returns error if collaborator already exists");
    it("returns error if userId invalid");
    it("returns error if repo returns undefined");
    it("returns error on repo failure");
    it("returns error on repo exception");
  });

  describe("removeCollaborator", () => {
    it("removes collaborator successfully");
    it("returns error if crate does not exist");
    it("returns error if collaborator not found");
    it("returns error if repo returns undefined");
    it("returns error on repo failure");
    it("returns error on repo exception");
  });
});
