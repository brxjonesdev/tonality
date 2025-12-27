export type Crate = {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  tags: string[];
  creatorId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface CreateCrateDTO {
  name: string;
  description?: string;
  coverImage?: string;
  tags?: string[];
}

export interface UpdateCrateDTO {
  name?: string;
  description?: string;
  coverImage?: string;
  tags?: string[];
}

export type CreateCrate = {
  name: string;
  description: string;
  isPublic: boolean;
};

export type CrateSubmission = {
  id: string;
  fromID: string;
  trackId: string;
  crateID: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  message?: string;
};

export type CrateCollaborator = {
  id: string;
  userId: string;
  crateId: string;
};

export type CrateTrack = {
  id: string;
  crateId: string;
  trackId: string;
  order: number;
};
