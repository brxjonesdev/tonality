/* eslint-disable @typescript-eslint/no-explicit-any */

import { ResultItemProps } from "../../search/components/searchresult";
import { SpotifySearchType } from "./config";
import { SimplifiedTrack, Track } from "./types/track";
import { generateSlug } from "./utils";

export function formatSpotifyResults(
  data: any,
  type: SpotifySearchType
): ResultItemProps[] {
  switch (type) {
    case "album":
      return data.items.map((album: any) => ({
        type: "album",
        id: album.id,
        spotifyId: album.id,
        title: album.name,
        albumArtUrl: album.images[0]?.url,
        artistName: album.artists.map((a: any) => a.name).join(", "),
        slug: generateSlug(album.name),
      }));

    case "artist":
      return data.items.map((artist: any) => ({
        type: "artist",
        id: artist.id,
        spotifyId: artist.id,
        title: artist.name,
        albumArtUrl: artist.images[0]?.url,
        slug: generateSlug(artist.name),
      }));

    case "track":
      return data.items.map((track: any) => ({
        type: "track",
        id: track.id,
        spotifyId: track.id,
        title: track.name,
        albumArtUrl: track.album.images[0]?.url,
        albumTitle: track.album.name,
        artistName: track.artists.map((a: any) => a.name).join(", "),
        slug: generateSlug(track.name),
      }));

    default:
      return [];
  }
}

export function formatSpotifyAlbum(data: any): any {
  return {
    id: data.id,
    name: data.name,
    artist: data.artists[0]?.name,
    artistId: data.artists[0]?.id,
    releaseDate: data.release_date,
    totalTracks: data.total_tracks,
    image: data.images[0]?.url,
    spotifyUrl: data.external_urls?.spotify,
    popularity: data.popularity,
    upc: data.external_ids?.upc,
  };
}

export function formatSpotifyTracklist(data: any): SimplifiedTrack | SimplifiedTrack[] {
if (!Array.isArray(data)) {
    return {
      id: data.id,
      artist : data.artists?.map((artist: any) => artist.name).join(", "),
      name: data.name,
      images: data.album?.images,
      track_number: data.track_number,
      duration_ms: data.duration_ms,
      explicit: data.explicit,
      preview_url: data.preview_url,
      uri: data.uri,
      isrc: data.external_ids?.isrc,
    };
  }

  return data.map((track: any) => ({
    id: track.id,
    name: track.name,
    artist : track.artists?.map((artist: any) => artist.name).join(", "),
    images: track.album?.images,
    track_number: track.track_number,
    duration_ms: track.duration_ms,
    explicit: track.explicit,
    preview_url: track.preview_url,
    uri: track.uri
  }));
}

export function formatSpotifyArtist(data: any): any {
  return {
    id: data.id,
    name: data.name,
    genres: data.genres,
    images: data.images,
    type: data.type,
    uri: data.uri,
  }
}
