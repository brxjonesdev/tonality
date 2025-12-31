import { SupabaseClient } from "@supabase/supabase-js";

export const isSignedIn = async (client: SupabaseClient) => {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error.message);
    return false;
  }
  if (user === null) {
    return false;
  }
  return true;
};
