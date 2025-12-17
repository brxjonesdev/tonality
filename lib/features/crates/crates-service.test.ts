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
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const generateCrates = (count: number, userID?: string): Crate[] => {
    const crates: Crate[] = [];
    for (let i = 0; i < count; i++) {
      crates.push({
        id: `crate${i}`,
        name: `Crate ${i}`,
        description: `Description for crate ${i}`,
        coverImage: `http://example.com/cover${i}.jpg`,
        tags: [`tag${i}`, `tag${i + 1}`],
        creatorId: userID ? userID : `user${i % 4}`,
        isPublic: i % 2 === 0,
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
      vi.mocked(mockRepo.getCrates).mockResolvedValueOnce(ok(popularCrates));
      const result = await cratesService.getPopularCrates();
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(popularCrates);
      }
      expect(mockRepo.getCrates).toHaveBeenCalledWith("popular");
    });
    it("returns error on repo failure", async () => {
      vi.mocked(mockRepo.getCrates).mockResolvedValueOnce(
        err("Database error"),
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
      vi.mocked(mockRepo.getCrates).mockResolvedValueOnce(ok(newCrates));
      const result = await cratesService.getNewCrates();
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(newCrates);
      }
      expect(mockRepo.getCrates).toHaveBeenCalledWith("new");
    });
    it("returns error on repo failure", async () => {
      vi.mocked(mockRepo.getCrates).mockResolvedValueOnce(
        err("Database error"),
      );
      const result = await cratesService.getNewCrates();
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Database error");
      }
      expect(mockRepo.getCrates).toHaveBeenCalledWith("new");
    });
  });

  describe("getUserCrates", () => {
    it("returns user crates on success", async () => {
      const userCrates = generateCrates(2, "user1");
      vi.mocked(mockRepo.getByUserID).mockResolvedValueOnce(ok(userCrates));
      const result = await cratesService.getUserCrates("user1");
      expect(result.ok).toBe(true);
      if (result.ok) {
        // Should return all crates since requesting own crates
        expect(result.data).toEqual(userCrates);
      }
      expect(mockRepo.getByUserID).toHaveBeenCalledWith("user1");
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
      vi.mocked(mockRepo.getByUserID).mockResolvedValueOnce(
        err("Database error"),
      );
      const result = await cratesService.getUserCrates("user1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Database error");
      }
      expect(mockRepo.getByUserID).toHaveBeenCalledWith("user1");
    });
    it("returns other user's crates", async () => {
      const otherUserCrates = generateCrates(2).filter(
        (c) => c.creatorId === "user2",
      );
      vi.mocked(mockRepo.getByUserID).mockResolvedValueOnce(
        ok(otherUserCrates),
      );
      const result = await cratesService.getUserCrates("user1", "user2");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(otherUserCrates);
        expect(result.data.every((c) => c.creatorId === "user2")).toBe(true);
        expect(result.data.every((c) => c.isPublic === true)).toBe(true);
      }
    });
  });

  describe("getCrateSubmissions", () => {
    it("returns submissions on success", async () => {
      const submissions = generateSubmissions(3);
      vi.mocked(mockRepo.getById).mockResolvedValueOnce(ok(sampleCrate));
      vi.mocked(mockRepo.getSubmissions).mockResolvedValueOnce(ok(submissions));
      const result = await cratesService.getCrateSubmissions("user1", "crate1");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual(submissions);
      }
      expect(mockRepo.getSubmissions).toHaveBeenCalledWith("crate1");
    });
    it("returns error if user does not own the crate", async () => {
      vi.mocked(mockRepo.getById).mockResolvedValueOnce(
        ok({ ...sampleCrate, creatorId: "owner-user" }),
      );

      const result = await cratesService.getCrateSubmissions(
        "other-user",
        "crate1",
      );

      expect(result.ok).toBe(false);

      if (!result.ok) {
        expect(result.error).toBe("Unauthorized: You do not own this crate");
      }

      expect(mockRepo.getSubmissions).not.toHaveBeenCalled();
    });

    it("returns error if crateId is invalid", async () => {
      const result = await cratesService.getCrateSubmissions("user1", "");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Invalid or Missing crate ID");
      }
      expect(mockRepo.getSubmissions).not.toHaveBeenCalled();
    });
    it("returns error on repo failure", async () => {
      vi.mocked(mockRepo.getSubmissions).mockResolvedValueOnce(
        err("Database error"),
      );
      vi.mocked(mockRepo.getById).mockResolvedValueOnce(ok(sampleCrate));
      const result = await cratesService.getCrateSubmissions("user1", "crate1");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Database error");
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
        expect(result.data).toBe(sampleCrate);
      }

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Chill Vibes",
          description: "A collection of relaxing tracks.",
          coverImage: "http://example.com/cover.jpg",
          tags: ["chill", "relax"],
          creatorId: "user1",
          isPublic: true,
          id: expect.stringMatching(/^crate-/),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

    it("returns error if crateData missing name", async () => {
      const result = await cratesService.createNewCrate(
        {} as CreateCrateDTO,
        "user1",
      );

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Missing required crate data");
      }

      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it("returns error if user ID is missing", async () => {
      const result = await cratesService.createNewCrate(
        { name: "Chill Vibes" } as CreateCrateDTO,
        "",
      );

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Invalid or Missing user ID");
      }

      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it("returns error on repo failure", async () => {
      vi.mocked(mockRepo.create).mockResolvedValueOnce(err("Database error"));

      const crateData: CreateCrateDTO = {
        name: "Chill Vibes",
      };

      const result = await cratesService.createNewCrate(crateData, "user1");

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe("Database error");
      }

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Chill Vibes",
          creatorId: "user1",
        }),
      );
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
  });

  //   describe("deleteCrate", () => {
  //     it("deletes crate successfully", async () => {
  //       vi.mocked(mockRepo.delete).mockResolvedValueOnce(ok(true));
  //       const result = await cratesService.deleteCrate("crate1");
  //       expect(result.ok).toBe(true);
  //       if (result.ok) {
  //         expect(result.data).toBe(true);
  //       }
  //       expect(mockRepo.delete).toHaveBeenCalledWith("crate1");
  //     });
  //     it("returns error if crate does not exist", async () => {
  //       vi.mocked(mockRepo.getById).mockResolvedValueOnce(err("Crate not found"));
  //       const result = await cratesService.deleteCrate("nonexistent");
  //       expect(result.ok).toBe(false);
  //       if (!result.ok) {
  //         expect(result.error).toBe("Crate not found");
  //       }
  //       expect(mockRepo.getById).toHaveBeenCalledWith("nonexistent");
  //       expect(mockRepo.delete).not.toHaveBeenCalled();
  //     });
  //     it("returns error on repo failure", async () => {
  //       vi.mocked(mockRepo.delete).mockResolvedValueOnce(err("Database error"));
  //       const result = await cratesService.deleteCrate("crate1");
  //       expect(result.ok).toBe(false);
  //       if (!result.ok) {
  //         expect(result.error).toBe("Database error");
  //       }
  //       expect(mockRepo.delete).toHaveBeenCalledWith("crate1");
  //     });
  //   });

  //   describe("addTrackToCrate", () => {
  //     it("adds track successfully", async () => {
  //       vi.mocked(mockRepo.addTrack).mockResolvedValueOnce(ok(true));
  //       const result = await cratesService.addTrackToCrate("crate1", "track1");
  //       expect(result.ok).toBe(true);
  //       if (result.ok) {
  //         expect(result.data).toBe(true);
  //       }
  //       expect(mockRepo.addTrack).toHaveBeenCalledWith("crate1", "track1");
  //     });
  //     it("returns error if crate does not exist", async () => {
  //       vi.mocked(mockRepo.getById).mockResolvedValueOnce(err("Crate not found"));
  //       const result = await cratesService.addTrackToCrate(
  //         "nonexistent",
  //         "track1",
  //       );
  //       expect(result.ok).toBe(false);
  //       if (!result.ok) {
  //         expect(result.error).toBe("Crate not found");
  //       }
  //       expect(mockRepo.getById).toHaveBeenCalledWith("nonexistent");
  //       expect(mockRepo.addTrack).not.toHaveBeenCalled();
  //     });
  //     it("returns error if track already exists", async () => {
  //       vi.mocked(mockRepo.getById).mockResolvedValueOnce(ok(sampleCrate));
  //       vi.mocked(mockRepo.checkTrackExists).mockResolvedValueOnce(ok(true));
  //       const result = await cratesService.addTrackToCrate(
  //         "crate1",
  //         "existingTrack",
  //       );
  //       expect(result.ok).toBe(false);
  //       if (!result.ok) {
  //         expect(result.error).toBe("Track already exists in crate");
  //       }
  //       expect(mockRepo.checkTrackExists).toHaveBeenCalledWith(
  //         "crate1",
  //         "existingTrack",
  //       );
  //       expect(mockRepo.addTrack).not.toHaveBeenCalled();
  //     });
  //     it("returns error if trackId invalid", async () => {
  //       const result = await cratesService.addTrackToCrate("crate1", "");
  //       expect(result.ok).toBe(false);
  //       if (!result.ok) {
  //         expect(result.error).toBe("Invalid track ID");
  //       }
  //       expect(mockRepo.addTrack).not.toHaveBeenCalled();
  //     });
  //     it("returns error on repo failure", async () => {
  //       vi.mocked(mockRepo.addTrack).mockResolvedValueOnce(err("Database error"));
  //       const result = await cratesService.addTrackToCrate("crate1", "track1");
  //       expect(result.ok).toBe(false);
  //       if (!result.ok) {
  //         expect(result.error).toBe("Database error");
  //       }
  //       expect(mockRepo.addTrack).toHaveBeenCalledWith("crate1", "track1");
  //     });
  //   });

  //   describe("removeTrackFromCrate", () => {
  //     it("removes track successfully", async () => {
  //       vi.mocked(mockRepo.removeTrack).mockResolvedValueOnce(ok(true));
  //       const result = await cratesService.removeTrackFromCrate(
  //         "crate1",
  //         "track1",
  //       );
  //       expect(result.ok).toBe(true);
  //       if (result.ok) {
  //         expect(result.data).toBe(true);
  //       }
  //       expect(mockRepo.removeTrack).toHaveBeenCalledWith("crate1", "track1");
  //     });
  //     it("returns error if crate does not exist", async () => {
  //       vi.mocked(mockRepo.getById).mockResolvedValueOnce(err("Crate not found"));
  //       const result = await cratesService.removeTrackFromCrate(
  //         "nonexistent",
  //         "track1",
  //       );
  //       expect(result.ok).toBe(false);
  //       if (!result.ok) {
  //         expect(result.error).toBe("Crate not found");
  //       }
  //       expect(mockRepo.getById).toHaveBeenCalledWith("nonexistent");
  //       expect(mockRepo.removeTrack).not.toHaveBeenCalled();
  //     });
  //     it("returns error if track not found in crate", async () => {
  //       vi.mocked(mockRepo.getById).mockResolvedValueOnce(ok(sampleCrate));
  //       vi.mocked(mockRepo.checkTrackExists).mockResolvedValueOnce(ok(false));
  //       const result = await cratesService.removeTrackFromCrate(
  //         "crate1",
  //         "missingTrack",
  //       );
  //       expect(result.ok).toBe(false);
  //       if (!result.ok) {
  //         expect(result.error).toBe("Track not found in crate");
  //       }
  //       expect(mockRepo.checkTrackExists).toHaveBeenCalledWith(
  //         "crate1",
  //         "missingTrack",
  //       );
  //       expect(mockRepo.removeTrack).not.toHaveBeenCalled();
  //     });
  //     it("returns error on repo failure", async () => {
  //       vi.mocked(mockRepo.removeTrack).mockResolvedValueOnce(
  //         err("Database error"),
  //       );
  //       const result = await cratesService.removeTrackFromCrate(
  //         "crate1",
  //         "track1",
  //       );
  //       expect(result.ok).toBe(false);
  //       if (!result.ok) {
  //         expect(result.error).toBe("Database error");
  //       }
  //       expect(mockRepo.removeTrack).toHaveBeenCalledWith("crate1", "track1");
  //     });
  //   });

  //   describe("reorderTracks", () => {
  //     it("reorders tracks successfully", async () => {});
  //     it("returns error for invalid order");
  //     it("handles repo failure");
  //   });

  //   describe("getTracksInCrate", () => {
  //     it("returns tracks on success", async () => {
  //       const tracks = generateTracks(3);
  //       vi.mocked(mockRepo.getTracks).mockResolvedValueOnce(ok(tracks));

  //       const result = await cratesService.getTracksInCrate("crate1");

  //       expect(result).toEqual(ok(tracks));
  //       expect(mockRepo.getTracks).toHaveBeenCalledWith("crate1");
  //     });

  //     it("returns error if crateId invalid", async () => {
  //       const result = await cratesService.getTracksInCrate("");

  //       expect(result).toEqual(err("Invalid crateId"));
  //       expect(mockRepo.getTracks).not.toHaveBeenCalled();
  //     });

  //     it("returns error on repo failure", async () => {
  //       vi.mocked(mockRepo.getTracks).mockResolvedValueOnce(err("Repo failed"));

  //       const result = await cratesService.getTracksInCrate("crate1");

  //       expect(result).toEqual(err("Repo failed"));
  //       expect(mockRepo.getTracks).toHaveBeenCalledWith("crate1");
  //     });
  //   });

  //   describe("submitTrackToCrate", () => {
  //     it("submits track successfully", async () => {
  //       vi.mocked(mockRepo.submitTrack).mockResolvedValueOnce(ok(true));
  //       const result = await cratesService.submitTrackToCrate(
  //         "user1",
  //         "user2",
  //         "crate1",
  //         "track1",
  //       );
  //       expect(result.ok).toBe(true);
  //       if (result.ok) {
  //         expect(result.data).toEqual(true);
  //       }
  //       expect(mockRepo.submitTrack).toHaveBeenCalledWith({
  //         fromID: "user1",
  //         toID: "user2",
  //         crateID: "crate1",
  //         trackId: "track1",
  //       });
  //     });
  //     it("returns a notice if track already submitted");
  //     it("returns error if crate does not exist", async () => {
  //       vi.mocked(mockRepo.submitTrack).mockResolvedValueOnce(
  //         err("Crate not found"),
  //       );
  //       const result = await cratesService.submitTrackToCrate(
  //         "user1",
  //         "user2",
  //         "crateBAD",
  //         "track1",
  //       );
  //       expect(result.ok).toBe(false);
  //       if (!result.ok) {
  //         expect(result.error).toEqual("Crate not found");
  //       }
  //     });
  //     it("returns error if trackId invalid", async () => {
  //       vi.mocked(mockRepo.submitTrack).mockResolvedValueOnce(
  //         err("TrackId invalid"),
  //       );
  //       const result = await cratesService.submitTrackToCrate(
  //         "user1",
  //         "user2",
  //         "crate1",
  //         "trackBAD",
  //       );
  //       expect(result.ok).toBe(false);
  //       if (!result.ok) {
  //         expect(result.error).toEqual("TrackId invalid");
  //       }
  //     });
  //     it("returns an error if the receiving user doesn't exist", async () => {
  //       vi.mocked(mockRepo.submitTrack).mockResolvedValueOnce(
  //         err("Receiving user not found"),
  //       );
  //       const result = await cratesService.submitTrackToCrate(
  //         "user1",
  //         "user2",
  //         "crate1",
  //         "track1",
  //       );
  //       expect(result.ok).toBe(false);
  //       if (!result.ok) {
  //         expect(result.error).toEqual("Receiving user not found");
  //       }
  //     });
  //     it("returns an error if the sending user doesn't exist", async () => {
  //       vi.mocked(mockRepo.submitTrack).mockResolvedValueOnce(
  //         err("Sending user not found"),
  //       );
  //       const result = await cratesService.submitTrackToCrate(
  //         "user1",
  //         "user2",
  //         "crate1",
  //         "track1",
  //       );
  //       expect(result.ok).toBe(false);
  //       if (!result.ok) {
  //         expect(result.error).toEqual("Sending user not found");
  //       }
  //     });
  //   });

  //   describe("acceptTrackSubmission", () => {
  //     it("accepts submission successfully", async () => {
  //       vi.mocked(mockRepo.resolveSubmission).mockResolvedValueOnce(ok(true));
  //       const result = await cratesService.acceptTrackSubmission("submission1");
  //       expect(result.ok).toBe(true);
  //       if (result.ok) {
  //         expect(result.data).toEqual(true);
  //       }
  //     });
  //     it("returns error if submission does not exist", async () => {
  //       vi.mocked(mockRepo.getBySubmissionID).mockResolvedValueOnce(
  //         err("Submission not found"),
  //       );
  //       const result = await cratesService.acceptTrackSubmission("submission1");
  //       expect(result.ok).toBe(false);
  //       if (!result.ok) {
  //         expect(result.error).toEqual("Submission not found");
  //       }
  //     });
  //     it("returns error on repo failure", async () => {
  //       vi.mocked(mockRepo.resolveSubmission).mockResolvedValueOnce(
  //         err("Repo error"),
  //       );
  //       const result = await cratesService.acceptTrackSubmission("submission1");
  //       expect(result.ok).toBe(false);
  //       if (!result.ok) {
  //         expect(result.error).toEqual("Repo error");
  //       }
  //     });
  //   });

  //   describe("rejectTrackSubmission", () => {
  //     it("rejects submission successfully", async () => {
  //       vi.mocked(mockRepo.resolveSubmission).mockResolvedValueOnce(ok(false));
  //       const result = await cratesService.rejectTrackSubmission("submission1");
  //       expect(result.ok).toBe(true);
  //       expect(mockRepo.resolveSubmission).toHaveBeenCalledWith("rejected");
  //       if (result.ok) {
  //         expect(result.data).toEqual("Submission rejected");
  //       }
  //     });
  //     it("returns error if submission does not exist", async () => {
  //       vi.mocked(mockRepo.resolveSubmission).mockResolvedValueOnce(
  //         err("Submission not found"),
  //       );
  //       const result = await cratesService.rejectTrackSubmission("submission1");
  //       expect(result.ok).toBe(false);
  //       if (!result.ok) {
  //         expect(result.error).toEqual("Submission not found");
  //       }
  //     });
  //     it("returns error on repo failure", async () => {
  //       vi.mocked(mockRepo.resolveSubmission).mockResolvedValueOnce(
  //         err("Repo error"),
  //       );
  //       const result = await cratesService.rejectTrackSubmission("submission1");
  //       expect(result.ok).toBe(false);
  //       if (!result.ok) {
  //         expect(result.error).toEqual("Repo error");
  //       }
  //     });
  //   });
});
