export interface SpotifyApiConfig {
    clientId: string;
    clientSecret: string;
}

export interface SpotifyResponse {
    access_token: string;
    expires_in: number;
    cached?: boolean;
}

export interface SpotifyError {
    status: number;
    error: string;
}

export type SpotifySearchType = "album" | "artist" | "playlist" | "track" | "show" | "episode" | "audiobook";

