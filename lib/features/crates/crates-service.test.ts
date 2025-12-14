/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CratesService, createCratesService } from "./crates-service";
import { CratesRepo } from "./crates-repo";
import { ok, err } from "../../../lib/utils";
import { Crate, CrateSubmission, CrateTrack, CreateCrateDTO } from "./types";
import { nanoid } from "nanoid";

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
  };

  const generateCrates = (count: number): Crate[] => {
    const crates: Crate[] = [];
    for (let i = 0; i < count; i++) {
      crates.push({
        id: `crate${i}`,
        name: `Crate ${i}`,
        description: `Description for crate ${i}`,
        coverImage: `http://example.com/cover${i}.jpg`,
        tags: [`tag${i}`, `tag${i + 1}`],
        creatorId: `user${i % 5}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return crates;
  };

  const generateTracks = (count: number): CrateTrack[] => {
    const tracks: CrateTrack[] = [];
    for (let i = 0; i < count; i++) {
      tracks.push({
        id: `track${i}`,
        crateId: `crate${i}`,
        trackId: `track${nanoid(16)}`,
        order: i,
      });
    }
    return tracks;
  };

  const generateSubmissions = (count: number): CrateSubmission[] => {
    const submissions: CrateSubmission[] = [];
    for (let i = 0; i < count; i++) {
      submissions.push({
        id: `submission${i}`,
        crateID: `crate${i % 3}`,
        trackId: `track${i}`,
        fromID: `user${i % 4}`,
        toID: `user${(i + 1) % 4}`,
        message: `Please add my track ${i} to your crate!`,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return submissions;
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
      getTracks: vi.fn(),
      submitTrack: vi.fn(),
      checkTrackExists: vi.fn(),
      resolveSubmission: vi.fn(),
      getBySubmissionID: vi.fn(),
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
    it("returns error on repo failure", async () => {
      vi.mocked(mockRepo.getById).mockResolvedValueOnce(err("Database error"));
      const result = await cratesService.getCrateById("crate1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Database error");
      }
      expect(mockRepo.getById).toHaveBeenCalledWith("crate1");
    });
    it("returns error on repo exception", async () => {
      vi.mocked(mockRepo.getById).mockRejectedValueOnce(
        new Error("Unexpected error"),
      );
      const result = await cratesService.getCrateById("crate1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Unexpected error");
      }
      expect(mockRepo.getById).toHaveBeenCalledWith("crate1");
    });
    it("returns error when id is invalid", async () => {
      const result = await cratesService.getCrateById("");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Invalid crate ID");
      }
      expect(mockRepo.getById).not.toHaveBeenCalled();
    });
  });

  describe("getCratesIncludingTrack", () => {
    it("returns crates on success", async () => {
      const crates = generateCrates(3);
      vi.mocked(mockRepo.getByTrackID).mockResolvedValueOnce(ok(crates));
      const result = await cratesService.getCratesIncludingTrack("track1");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(crates);
      }
      expect(mockRepo.getByTrackID).toHaveBeenCalledWith("track1");
    });
    it("returns empty array if no crates found", async () => {
      vi.mocked(mockRepo.getByTrackID).mockResolvedValueOnce(ok([]));
      const result = await cratesService.getCratesIncludingTrack("track1");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual([]);
      }
      expect(mockRepo.getByTrackID).toHaveBeenCalledWith("track1");
    });
    it("returns error if trackId is invalid", async () => {
      const result = await cratesService.getCratesIncludingTrack("");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Invalid track ID");
      }
      expect(mockRepo.getByTrackID).not.toHaveBeenCalled();
    });
    it("returns error on repo failure", async () => {
      vi.mocked(mockRepo.getByTrackID).mockResolvedValueOnce(
        err("Database error"),
      );
      const result = await cratesService.getCratesIncludingTrack("track1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Database error");
      }
      expect(mockRepo.getByTrackID).toHaveBeenCalledWith("track1");
    });
  });

  describe("getPopularCrates", () => {
    it("returns crates on success", async () => {
      const popularCrates = generateCrates(5);
      vi.mocked(mockRepo.getCrates).mockResolvedValueOnce(popularCrates);
      const result = await cratesService.getPopularCrates();
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(popularCrates);
      }
      expect(mockRepo.getCrates).toHaveBeenCalledWith("popular");
    });
    it("returns empty list if none found", async () => {
      vi.mocked(mockRepo.getCrates).mockResolvedValueOnce([]);
      const result = await cratesService.getPopularCrates();
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual([]);
      }
      expect(mockRepo.getCrates).toHaveBeenCalledWith("popular");
    });
    it("returns error if repo returns malformed data", async () => {
      vi.mocked(mockRepo.getCrates).mockResolvedValueOnce(null as any);
      const result = await cratesService.getPopularCrates();
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Malformed data received from repository");
      }
      expect(mockRepo.getCrates).toHaveBeenCalledWith("popular");
    });
    it("returns error on repo failure", async () => {
      vi.mocked(mockRepo.getCrates).mockRejectedValueOnce(
        new Error("Database error"),
      );
      const result = await cratesService.getPopularCrates();
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Database error");
      }
      expect(mockRepo.getCrates).toHaveBeenCalledWith("popular");
    });
  });

  describe("getNewCrates", () => {
    it("returns crates on success", async () => {
      const newCrates = generateCrates(4);
      vi.mocked(mockRepo.getCrates).mockResolvedValueOnce(newCrates);
      const result = await cratesService.getNewCrates();
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(newCrates);
      }
      expect(mockRepo.getCrates).toHaveBeenCalledWith("new");
    });
    it("returns empty list if repo has no new crates", async () => {
      // checks crates made in the last 3 days
      vi.mocked(mockRepo.getCrates).mockResolvedValueOnce([]);
      const result = await cratesService.getNewCrates();
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual([]);
      }
      expect(mockRepo.getCrates).toHaveBeenCalledWith("new");
    });
    it("returns error on repo failure", async () => {
      vi.mocked(mockRepo.getCrates).mockRejectedValueOnce(
        new Error("Database error"),
      );
      const result = await cratesService.getNewCrates();
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Database error");
      }
      expect(mockRepo.getCrates).toHaveBeenCalledWith("new");
    });
    it("returns error on repo exception", async () => {
      vi.mocked(mockRepo.getCrates).mockRejectedValueOnce(
        new Error("Unexpected error"),
      );
      const result = await cratesService.getNewCrates();
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Unexpected error");
      }
      expect(mockRepo.getCrates).toHaveBeenCalledWith("new");
    });
    it("returns error if crate shape is invalid", async () => {
      vi.mocked(mockRepo.getCrates).mockResolvedValueOnce([null as any]);
      const result = await cratesService.getNewCrates();
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Malformed data received from repository");
      }
      expect(mockRepo.getCrates).toHaveBeenCalledWith("new");
    });
  });

  describe("getUserCrates", () => {
    it("returns user crates on success", async () => {
      const userCrates = generateCrates(2).filter(
        (c) => c.creatorId === "user1",
      );
      vi.mocked(mockRepo.getByUserID).mockResolvedValueOnce(userCrates);
      const result = await cratesService.getUserCrates("user1");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(userCrates);
      }
      expect(mockRepo.getByUserID).toHaveBeenCalledWith("user1");
    });
    it("returns empty list if user has no crates", async () => {
      vi.mocked(mockRepo.getByUserID).mockResolvedValueOnce([]);
      const result = await cratesService.getUserCrates("user2");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual([]);
      }
      expect(mockRepo.getByUserID).toHaveBeenCalledWith("user2");
    });
    it("returns error if userId is invalid", async () => {
      const result = await cratesService.getUserCrates("");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Invalid or Missing user ID");
      }
      expect(mockRepo.getByUserID).not.toHaveBeenCalled();
    });
    it("returns error on repo failure", async () => {
      vi.mocked(mockRepo.getByUserID).mockRejectedValueOnce(
        new Error("Database error"),
      );
      const result = await cratesService.getUserCrates("user1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Database error");
      }
      expect(mockRepo.getByUserID).toHaveBeenCalledWith("user1");
    });
    it("returns error on repo exception", async () => {
      vi.mocked(mockRepo.getByUserID).mockRejectedValueOnce(
        new Error("Unexpected error"),
      );
      const result = await cratesService.getUserCrates("user1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Unexpected error");
      }
      expect(mockRepo.getByUserID).toHaveBeenCalledWith("user1");
    });
  });

  describe("getCrateSubmissions", () => {
    it("returns submissions on success", async () => {
      const submissions = generateSubmissions(3);
      vi.mocked(mockRepo.getSubmissions).mockResolvedValueOnce(submissions);
      const result = await cratesService.getCrateSubmissions("user1", "crate1");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(submissions);
      }
      expect(mockRepo.getSubmissions).toHaveBeenCalledWith("crate1");
    });
    it("returns error if userID doesn't own the crate", async () => {
      const result = await cratesService.getCrateSubmissions("user2", "crate1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("User does not own the crate");
      }
      expect(mockRepo.getSubmissions).not.toHaveBeenCalled();
    });
    it("returns empty list if no submissions exist", async () => {
      vi.mocked(mockRepo.getSubmissions).mockResolvedValueOnce([]);
      const result = await cratesService.getCrateSubmissions("user1", "crate1");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual([]);
      }
      expect(mockRepo.getSubmissions).toHaveBeenCalledWith("crate1");
    });
    it("returns error if crateId is invalid", async () => {
      const result = await cratesService.getCrateSubmissions("user1", "");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Invalid crate ID");
      }
      expect(mockRepo.getSubmissions).not.toHaveBeenCalled();
    });
    it("returns error on repo failure", async () => {
      vi.mocked(mockRepo.getSubmissions).mockRejectedValueOnce(
        new Error("Database error"),
      );
      const result = await cratesService.getCrateSubmissions("user1", "crate1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Database error");
      }
      expect(mockRepo.getSubmissions).toHaveBeenCalledWith("crate1");
    });
    it("returns error on repo exception", async () => {
      vi.mocked(mockRepo.getSubmissions).mockRejectedValueOnce(
        new Error("Unexpected error"),
      );
      const result = await cratesService.getCrateSubmissions("user1", "crate1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Unexpected error");
      }
      expect(mockRepo.getSubmissions).toHaveBeenCalledWith("crate1");
    });
    it("returns error on malformed submission data", async () => {
      vi.mocked(mockRepo.getSubmissions).mockResolvedValueOnce([null as any]);
      const result = await cratesService.getCrateSubmissions("user1", "crate1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Malformed data received from repository");
      }
      expect(mockRepo.getSubmissions).toHaveBeenCalledWith("crate1");
    });
  });

  describe("createNewCrate", () => {
    it("creates crate successfully", async () => {
      vi.mocked(mockRepo.create).mockResolvedValueOnce(ok(sampleCrate));
      const crateData: CreateCrateDTO = {
        name: "Chill Vibes",
        description: "A collection of relaxing tracks.",
        coverImage: "http://example.com/cover.jpg",
        tags: ["chill", "relax"],
      };
      const result = await cratesService.createNewCrate(crateData, "user1");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(sampleCrate);
      }
      expect(mockRepo.create).toHaveBeenCalledWith(crateData, "user1");
    });
    it("returns error if crateData missing fields", async () => {
      const crateData: Partial<CreateCrateDTO> = {
        description: "A collection of relaxing tracks.",
      };
      const result = await cratesService.createNewCrate(
        crateData as CreateCrateDTO,
        "user1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Missing required crate data");
      }
    });
    it("returns error if crateData has invalid types", async () => {
      const crateData: any = {
        name: 12345,
        description: "A collection of relaxing tracks.",
      };
      const result = await cratesService.createNewCrate(crateData, "user1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Invalid crate data types");
        expect(mockRepo.create).not.toHaveBeenCalled();
      }
    });
    it("returns error on repo failure", async () => {
      vi.mocked(mockRepo.create).mockResolvedValueOnce(err("Database error"));
      const crateData: CreateCrateDTO = {
        name: "Chill Vibes",
        description: "A collection of relaxing tracks.",
        coverImage: "http://example.com/cover.jpg",
        tags: ["chill", "relax"],
      };
      const result = await cratesService.createNewCrate(crateData, "user1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Database error");
      }
      expect(mockRepo.create).toHaveBeenCalledWith(crateData, "user1");
    });
    it("returns error on repo exception", async () => {
      vi.mocked(mockRepo.create).mockRejectedValueOnce(
        new Error("Unexpected error"),
      );
      const crateData: CreateCrateDTO = {
        name: "Chill Vibes",
        description: "A collection of relaxing tracks.",
        coverImage: "http://example.com/cover.jpg",
        tags: ["chill", "relax"],
      };
      const result = await cratesService.createNewCrate(crateData, "user1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Unexpected error");
      }
      expect(mockRepo.create).toHaveBeenCalledWith(crateData, "user1");
    });
  });

  describe("updateCrate", () => {
    it("updates crate successfully", async () => {
      const updatedCrate = { ...sampleCrate, name: "Updated Crate Name" };
      vi.mocked(mockRepo.update).mockResolvedValueOnce(ok(updatedCrate));
      const updateData = { name: "Updated Crate Name" };
      const result = await cratesService.updateCrate(
        "crate1",
        updateData,
        "user1",
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(updatedCrate);
      }
      expect(mockRepo.update).toHaveBeenCalledWith(
        "crate1",
        updateData,
        "user1",
      );
    });
    it("returns error if crate does not exist", async () => {
      vi.mocked(mockRepo.update).mockResolvedValueOnce(err("Crate not found"));
      const updateData = { name: "Updated Crate Name" };
      const result = await cratesService.updateCrate(
        "nonexistent",
        updateData,
        "user1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Crate not found");
      }
      expect(mockRepo.update).toHaveBeenCalledWith(
        "nonexistent",
        updateData,
        "user1",
      );
    });
    it("returns error if updateData invalid", async () => {
      const updateData: any = { name: 12345 };
      const result = await cratesService.updateCrate(
        "crate1",
        updateData,
        "user1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Invalid update data types");
      }
      expect(mockRepo.update).not.toHaveBeenCalled();
    });
    it("returns error if updateData empty", async () => {
      const updateData = {};
      const result = await cratesService.updateCrate(
        "crate1",
        updateData,
        "user1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("No update data provided");
      }
      expect(mockRepo.update).not.toHaveBeenCalled();
    });
    it("returns error if repo returns null", async () => {
      vi.mocked(mockRepo.update).mockResolvedValueOnce(null as any);
      const updateData = { name: "Updated Crate Name" };
      const result = await cratesService.updateCrate(
        "crate1",
        updateData,
        "user1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Malformed data received from repository");
      }
      expect(mockRepo.update).toHaveBeenCalledWith(
        "crate1",
        updateData,
        "user1",
      );
    });
    it("returns error if repo returns undefined", async () => {
      vi.mocked(mockRepo.update).mockResolvedValueOnce(undefined as any);
      const updateData = { name: "Updated Crate Name" };
      const result = await cratesService.updateCrate(
        "crate1",
        updateData,
        "user1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Malformed data received from repository");
      }
      expect(mockRepo.update).toHaveBeenCalledWith(
        "crate1",
        updateData,
        "user1",
      );
    });
    it("returns error on repo failure", async () => {
      vi.mocked(mockRepo.update).mockResolvedValueOnce(err("Database error"));
      const updateData = { name: "Updated Crate Name" };
      const result = await cratesService.updateCrate(
        "crate1",
        updateData,
        "user1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Database error");
      }
      expect(mockRepo.update).toHaveBeenCalledWith(
        "crate1",
        updateData,
        "user1",
      );
    });
    it("returns error on repo exception", async () => {
      vi.mocked(mockRepo.update).mockRejectedValueOnce(
        new Error("Unexpected error"),
      );
      const updateData = { name: "Updated Crate Name" };
      const result = await cratesService.updateCrate(
        "crate1",
        updateData,
        "user1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Unexpected error");
      }
      expect(mockRepo.update).toHaveBeenCalledWith(
        "crate1",
        updateData,
        "user1",
      );
    });
  });

  describe("deleteCrate", () => {
    it("deletes crate successfully", async () => {
      vi.mocked(mockRepo.delete).mockResolvedValueOnce(ok(true));
      const result = await cratesService.deleteCrate("crate1");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toBe(true);
      }
      expect(mockRepo.delete).toHaveBeenCalledWith("crate1");
    });
    it("returns error if crate does not exist", async () => {
      const result = await cratesService.deleteCrate("nonexistent");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Crate not found");
      }
      expect(mockRepo.getById).toHaveBeenCalledWith("nonexistent");
      expect(mockRepo.delete).not.toHaveBeenCalled();
    });
    it("returns error if repo prevents deletion due to constraints", async () => {
      vi.mocked(mockRepo.delete).mockResolvedValueOnce(
        err("Crate cannot be deleted due to existing constraints"),
      );
      const result = await cratesService.deleteCrate("crate1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe(
          "Crate cannot be deleted due to existing constraints",
        );
      }
      expect(mockRepo.delete).toHaveBeenCalledWith("crate1");
    });
    it("returns error on repo failure", async () => {
      vi.mocked(mockRepo.delete).mockRejectedValueOnce(
        new Error("Database error"),
      );
      const result = await cratesService.deleteCrate("crate1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Database error");
      }
      expect(mockRepo.delete).toHaveBeenCalledWith("crate1");
    });
    it("returns error on repo exception", async () => {
      vi.mocked(mockRepo.delete).mockRejectedValueOnce(
        new Error("Unexpected error"),
      );
      const result = await cratesService.deleteCrate("crate1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Unexpected error");
      }
      expect(mockRepo.delete).toHaveBeenCalledWith("crate1");
    });
  });

  describe("addTrackToCrate", () => {
    it("adds track successfully", async () => {
      vi.mocked(mockRepo.addTrack).mockResolvedValueOnce(ok(true));
      const result = await cratesService.addTrackToCrate("crate1", "track1");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toBe(true);
      }
      expect(mockRepo.addTrack).toHaveBeenCalledWith("crate1", "track1");
    });
    it("returns error if crate does not exist", async () => {
      const result = await cratesService.addTrackToCrate(
        "nonexistent",
        "track1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Crate not found");
      }
      expect(mockRepo.getById).toHaveBeenCalledWith("nonexistent");
      expect(mockRepo.addTrack).not.toHaveBeenCalled();
    });
    it("returns error if track already exists", async () => {
      const result = await cratesService.addTrackToCrate(
        "crate1",
        "existingTrack",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Track already exists in crate");
      }
      expect(mockRepo.checkTrackExists).toHaveBeenCalledWith(
        "crate1",
        "existingTrack",
      );
      expect(mockRepo.addTrack).not.toHaveBeenCalled();
    });
    it("returns error if trackId invalid", async () => {
      const result = await cratesService.addTrackToCrate("crate1", "");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Invalid track ID");
      }
      expect(mockRepo.addTrack).not.toHaveBeenCalled();
    });
    it("returns error if repo returns undefined", async () => {
      vi.mocked(mockRepo.addTrack).mockResolvedValueOnce(undefined as any);
      const result = await cratesService.addTrackToCrate("crate1", "track1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Malformed data received from repository");
      }
      expect(mockRepo.addTrack).toHaveBeenCalledWith("crate1", "track1");
    });
    it("returns error on repo failure", async () => {
      vi.mocked(mockRepo.addTrack).mockRejectedValueOnce(
        new Error("Database error"),
      );
      const result = await cratesService.addTrackToCrate("crate1", "track1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Database error");
      }
      expect(mockRepo.addTrack).toHaveBeenCalledWith("crate1", "track1");
    });
  });

  describe("removeTrackFromCrate", () => {
    it("removes track successfully", async () => {
      vi.mocked(mockRepo.removeTrack).mockResolvedValueOnce(ok(true));
      const result = await cratesService.removeTrackFromCrate(
        "crate1",
        "track1",
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toBe(true);
      }
      expect(mockRepo.removeTrack).toHaveBeenCalledWith("crate1", "track1");
    });
    it("returns error if crate does not exist", async () => {
      const result = await cratesService.removeTrackFromCrate(
        "nonexistent",
        "track1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Crate not found");
      }
      expect(mockRepo.getById).toHaveBeenCalledWith("nonexistent");
      expect(mockRepo.removeTrack).not.toHaveBeenCalled();
    });
    it("returns error if track not found in crate", async () => {
      const result = await cratesService.removeTrackFromCrate(
        "crate1",
        "missingTrack",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Track not found in crate");
      }
      expect(mockRepo.checkTrackExists).toHaveBeenCalledWith(
        "crate1",
        "missingTrack",
      );
      expect(mockRepo.removeTrack).not.toHaveBeenCalled();
    });
    it("returns error if repo returns undefined", async () => {
      vi.mocked(mockRepo.removeTrack).mockResolvedValueOnce(undefined as any);
      const result = await cratesService.removeTrackFromCrate(
        "crate1",
        "track1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Malformed data received from repository");
      }
      expect(mockRepo.removeTrack).toHaveBeenCalledWith("crate1", "track1");
    });
    it("returns error on repo failure", async () => {
      vi.mocked(mockRepo.removeTrack).mockRejectedValueOnce(
        new Error("Database error"),
      );
      const result = await cratesService.removeTrackFromCrate(
        "crate1",
        "track1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Database error");
      }
      expect(mockRepo.removeTrack).toHaveBeenCalledWith("crate1", "track1");
    });
  });

  describe("reorderTracks", () => {
    it("reorders tracks successfully", async () => {});
    it("returns error if order array does not match existing tracks");
    it("returns error if order contains missing ids");
    it("returns error if order contains extra ids");
    it("returns error if repo returns undefined");
    it("returns error on repo failure");
    it("returns error on repo exception");
    it("returns error if crate does not exist");
  });

  describe("getTracksInCrate", () => {
    it("returns tracks on success", async () => {
      const tracks = generateTracks(3);
      const result = await cratesService.getTracksInCrate("crate1");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(tracks);
      }
    });
    it("returns empty list when crate has no tracks", async () => {
      const result = await cratesService.getTracksInCrate("crate2");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual([]);
      }
    });
    it("returns error if crateId invalid", async () => {
      const result = await cratesService.getTracksInCrate("invalid");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toEqual("Invalid crateId");
      }
    });
    it("returns error if repo returns undefined", async () => {
      const result = await cratesService.getTracksInCrate("undefined");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toEqual("Repo returned undefined");
      }
    });
    it("returns error on repo failure", async () => {
      const result = await cratesService.getTracksInCrate("failure");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toEqual("Repo failed");
      }
    });
  });

  describe("submitTrackToCrate", () => {
    it("submits track successfully", async () => {
      vi.mocked(mockRepo.submitTrack).mockResolvedValueOnce(ok(true));
      const result = await cratesService.submitTrackToCrate(
        "user1",
        "user2",
        "crate1",
        "track1",
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(true);
      }
    });
    it("returns a notice if track already submitted");
    it("returns error if crate does not exist", async () => {
      vi.mocked(mockRepo.submitTrack).mockResolvedValueOnce(
        err("Crate not found"),
      );
      const result = await cratesService.submitTrackToCrate(
        "user1",
        "user2",
        "crateBAD",
        "track1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toEqual("Crate not found");
      }
    });
    it("returns error if trackId invalid", async () => {
      vi.mocked(mockRepo.submitTrack).mockResolvedValueOnce(
        err("TrackId invalid"),
      );
      const result = await cratesService.submitTrackToCrate(
        "user1",
        "user2",
        "crate1",
        "trackBAD",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toEqual("TrackId invalid");
      }
    });
    it("returns error if repo returns undefined", async () => {
      vi.mocked(mockRepo.submitTrack).mockResolvedValueOnce(
        err("Unexpected error"),
      );
      const result = await cratesService.submitTrackToCrate(
        "user1",
        "user2",
        "crate1",
        "track1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toEqual("Unexpected error");
      }
    });
    it("returns an error if the receiving user doesn't exist", async () => {
      vi.mocked(mockRepo.submitTrack).mockResolvedValueOnce(
        err("Receiving user not found"),
      );
      const result = await cratesService.submitTrackToCrate(
        "user1",
        "user2",
        "crate1",
        "track1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toEqual("Receiving user not found");
      }
    });
    it("returns an error if the sending user doesn't exist", async () => {
      vi.mocked(mockRepo.submitTrack).mockResolvedValueOnce(
        err("Sending user not found"),
      );
      const result = await cratesService.submitTrackToCrate(
        "user1",
        "user2",
        "crate1",
        "track1",
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toEqual("Sending user not found");
      }
    });
  });

  describe("acceptTrackSubmission", () => {
    it("fetches all submissions for the crate", async () => {
      const submissions = generateSubmissions(10);
      vi.mocked(mockRepo.getSubmissions).mockResolvedValueOnce(submissions);
      const result = await cratesService.getCrateSubmissions("user1", "crate1");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(submissions);
      }
    });
    it("accepts submission successfully", async () => {
      vi.mocked(mockRepo.resolveSubmission).mockResolvedValueOnce(ok(true));
      const result = await cratesService.acceptTrackSubmission("submission1");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(true);
      }
    });
    it("returns error if submission does not exist", async () => {
      vi.mocked(mockRepo.getBySubmissionID).mockResolvedValueOnce(
        err("Submission not found"),
      );
      const result = await cratesService.acceptTrackSubmission("submission1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toEqual("Submission not found");
      }
    });
    it("returns error if submission already accepted", async () => {
      vi.mocked(mockRepo.resolveSubmission).mockResolvedValueOnce(ok(false));
      const result = await cratesService.acceptTrackSubmission("submission1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toEqual("Submission already accepted");
      }
    });
    it("returns error if submission already rejected", async () => {
      vi.mocked(mockRepo.resolveSubmission).mockResolvedValueOnce(ok(true));
      const result = await cratesService.acceptTrackSubmission("submission1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toEqual("Submission already rejected");
      }
    });
    it("returns error on repo failure", async () => {
      vi.mocked(mockRepo.resolveSubmission).mockResolvedValueOnce(
        err("Repo error"),
      );
      const result = await cratesService.acceptTrackSubmission("submission1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toEqual("Repo error");
      }
    });
  });

  describe("rejectTrackSubmission", () => {
    it("rejects submission successfully", async () => {
      vi.mocked(mockRepo.resolveSubmission).mockResolvedValueOnce(ok(false));
      const result = await cratesService.rejectTrackSubmission("submission1");
      expect(result.ok).toBe(true);
      expect(mockRepo.resolveSubmission).toHaveBeenCalledWith("rejected");
      if (result.ok) {
        expect(result.data).toEqual("Submission rejected");
      }
    });
    it("returns error if submission does not exist", async () => {
      vi.mocked(mockRepo.resolveSubmission).mockResolvedValueOnce(
        err("Submission not found"),
      );
      const result = await cratesService.rejectTrackSubmission("submission1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toEqual("Submission not found");
      }
    });
    it("returns error if repo returns undefined", async () => {
      vi.mocked(mockRepo.resolveSubmission).mockResolvedValueOnce(
        err("undefined response"),
      );
      const result = await cratesService.rejectTrackSubmission("submission1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toEqual("Repo error");
      }
    });
    it("returns error on repo failure", async () => {
      vi.mocked(mockRepo.resolveSubmission).mockRejectedValueOnce(
        new Error("Repo error"),
      );
      const result = await cratesService.rejectTrackSubmission("submission1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toEqual("Repo error");
      }
    });
  });
});
