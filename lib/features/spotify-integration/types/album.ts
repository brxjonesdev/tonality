import { ExternalUrls, Image, PaginatedResults } from "./shared";
import { SimplifiedArtist } from "./artist";

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

export type AlbumSearchResults = PaginatedResults<Album>
