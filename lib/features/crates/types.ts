export type Crate = {
    id: string;
    name: string;
    description: string;
    coverImage?: string;
    tags: string[];
    creatorId: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateCrate = {
    name: string;
    description: string;
    isPublic: boolean;
}

export type CrateSubmission = {
    id: string;
    fromID: string;
    toID: string;
    trackId: string;
    crateID: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: Date;
    updatedAt: Date;
}

export type CrateCollaborator = {
    id: string;
    userId: string;
    crateId: string;
}

export type CrateTrack = {
    id: string;
    crateId: string;
    trackId: string;
    order: number;
}
