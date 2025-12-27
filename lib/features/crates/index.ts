import { CratesRepo } from "./crates-repo";
import { createCratesService } from "./crates-service";
import { crateSupabaseDbImpl } from "./repo-impls/crates.supabase.db";
const supabaseDB = crateSupabaseDbImpl();
export const cratesService = createCratesService(supabaseDB);
