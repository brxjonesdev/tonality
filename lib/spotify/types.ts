/* eslint-disable @typescript-eslint/no-empty-object-type */
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


export interface ExternalUrls {
  spotify: string;
}

export interface Image {
  height: number;
  width: number;
  url: string;
}

export interface Followers {
  href: null;
  total: number;
}

export interface ExternalIds {
  isrc: string;
}


export interface PaginatedResults<T> {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: T[];
}



export interface SimplifiedArtist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}

export interface Artist extends SimplifiedArtist {
  followers: Followers;
  genres: string[];
  images: Image[];
  popularity: number;
}

export interface ArtistSearchResults extends PaginatedResults<Artist> {}
export interface SimplifiedAlbum {
  album_type: "album" | "single" | "compilation";
  artists: SimplifiedArtist[];
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  total_tracks: number;
  type: "album";
  uri: string;
}

export interface Album extends SimplifiedAlbum {
  is_playable?: boolean;
}

export interface AlbumSearchResults extends PaginatedResults<SimplifiedAlbum> {}



export interface Track {
  album: Album;
  artists: SimplifiedArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  is_playable: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
}

export interface TrackSearchResults extends PaginatedResults<Track> {}


export interface AlbumSearchResponse {
  albums: AlbumSearchResults;
}

export interface ArtistSearchResponse {
  artists: ArtistSearchResults;
}

export interface TrackSearchResponse {
  tracks: TrackSearchResults;
}

export type SearchResponse = 
  | AlbumSearchResponse 
  | ArtistSearchResponse 
  | TrackSearchResponse;