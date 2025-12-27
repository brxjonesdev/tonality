import { SpotifyError, SpotifySearchType } from "./config";
import { SearchResponse } from "./types/search";
import { getSpotifyToken } from "./utils";
import { Result, ok, err } from "@/lib/utils";

export async function spotifySearch(
  query: string,
  type: SpotifySearchType = "album",
): Promise<Result<SearchResponse, SpotifyError>> {
  const token = await getSpotifyToken();

  const params = new URLSearchParams({ q: query, type });

  const res = await fetch(`https://api.spotify.com/v1/search?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return err(await res.json());
  }

  const data: SearchResponse = await res.json();
  return ok(data[(type + "s") as keyof SearchResponse]);
}
