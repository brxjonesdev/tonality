import { Crate } from "./types";

export interface CratesService {
    getCrateById(crateId: string): Promise<Crate | null>;
    getCratesIncludingTrack(trackId: string): Promise<Crate[]>;
}

export function createCratesService(repo: any): CratesService {
    return {
        async getCrateById(crateId: string): Promise<Crate | null> {
            // Placeholder implementation
            const crate = await repo.findCrateById(crateId);
            return crate || null;
        },
        async getCratesIncludingTrack(trackId: string): Promise<Crate[]> {
            // Placeholder implementation
            const crates = [];
            return crates || [];
        }
    };
}

export const cratesService = createCratesService(null);