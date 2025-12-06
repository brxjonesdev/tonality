export type Crate = {
    id: string;
}

export type CreateCrate = {
    name: string;
    description: string;
    isPublic: boolean;
}

export type CrateSubmission = {
    id: string;
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
