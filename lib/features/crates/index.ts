import { CratesRepo } from './crates-repo';
import { createCratesService } from './crates-service';
import { createNeonCratesRepo } from './repo-implementations/crates-repo.neon';
const neonDB = createNeonCratesRepo();
export const cratesService = createCratesService(neonDB);
