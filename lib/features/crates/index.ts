import { CratesRepo } from "./crates-repo";
import { createCratesService } from "./crates-service";
export const cratesService = createCratesService({} as CratesRepo);