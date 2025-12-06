export type Crate = {
    id: string;
    name: string;
    ownerId: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
    isPublic: boolean;
    isCollaborative: boolean;
    coverImageUrl?: string;
    trackCount: number;
    // tracks?: CrateTrack[];
}

