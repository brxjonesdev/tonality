import { AlbumSearchResults } from './album';
import { ArtistSearchResults } from './artist';
import { TrackSearchResults } from './track';

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
