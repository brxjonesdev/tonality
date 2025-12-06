import { Album } from "./album";
import { SimplifiedArtist } from "./artist";
import { ExternalIds, ExternalUrls, PaginatedResults } from "./shared";

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

export type TrackSearchResults = PaginatedResults<Track>
