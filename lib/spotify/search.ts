import { SpotifyError, SpotifyResponse, SpotifySearchType } from "./types";


export async function spotifySearch(query: string, type: SpotifySearchType = "album") {
    const base = process.env.NEXT_PUBLIC_BASE_URL!;
    const tokenRes = await fetch(`${base}/api/spotify/token`, {
        cache: "no-store",
    });

    const tokenData: SpotifyResponse | SpotifyError = await tokenRes.json();
    if ('error' in tokenData){
        throw new Error(JSON.stringify(tokenData.error));
    }
    const token = tokenData.access_token;

    const params = new URLSearchParams({
        q: query,
        type,
    });

    const res = await fetch(`https://api.spotify.com/v1/search?${params}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        return {error: "Spotify API request failed"};
    }

    return res.json();
}
