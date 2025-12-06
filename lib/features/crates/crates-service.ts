import { Crate } from "./types";

export interface CratesService {
    getCrateById(crateId: string): Promise<Crate | null>;
    get
}