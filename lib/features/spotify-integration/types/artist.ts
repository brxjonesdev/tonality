import { ExternalUrls, Followers, Image, PaginatedResults } from "./shared";

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

export type ArtistSearchResults = PaginatedResults<Artist>
