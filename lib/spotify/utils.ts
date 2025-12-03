/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultItemProps } from "../features/search-music/components/searchresult";
import { SpotifyError, SpotifyResponse, SpotifySearchType, SearchResponse} from "./types";
import {Result, ok, err} from "@/lib/utils"


export async function spotifySearch(query: string, type: SpotifySearchType = "album"): Promise<Result<SearchResponse, SpotifyError>> {
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
        const errorData: SpotifyError = await res.json();
        return err(errorData);
    }  
    const data: SearchResponse = await res.json();
    const typeMap: Record<SpotifySearchType, keyof SearchResponse> = {
        album: "albums",
        artist: "artists",
        track: "tracks",
    };

    return ok(data[typeMap[type]]);
}
export function formatSpotifyResults(data: any, type: SpotifySearchType): ResultItemProps[] {
    switch (type) {
        case "album":
            return data.items.map((album: any) => ({
                type: 'album',
                id: album.id,
                spotifyId: album.id,
                title: album.name,
                albumArtUrl: album.images[0]?.url,
                artistName: album.artists.map((artist: any) => artist.name).join(", "),
            }));
        case "artist":
            return data.items.map((artist: any) => ({
                type: 'artist',
                id: artist.id,
                spotifyId: artist.id,
                title: artist.name,
                albumArtUrl: artist.images[0]?.url,
            }));
        case "track":
            return data.items.map((track: any) => ({
                type: 'track',
                id: track.id,
                spotifyId: track.id,
                title: track.name,
                albumArtUrl: track.album.images[0]?.url,
                albumTitle: track.album.name,
                artistName: track.artists.map((artist: any) => artist.name).join(", "),
            }));
        default:
            return [];
    }
}
