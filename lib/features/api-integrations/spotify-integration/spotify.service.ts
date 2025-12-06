/* eslint-disable @typescript-eslint/no-explicit-any */
import { Result, ok, err } from "@/lib/utils";
import { SimplifiedTrack, Track } from "./types/track";
import { SimplifiedAlbum } from "./types/album";
import { SimplifiedArtist } from "./types/artist";
import {
  getAlbum,
  getAlbumTracks,
  getArtist,
  getArtistAlbums,
  getArtistTopTracks,
  getTrack,
} from "./fetchers";
import {
  formatSpotifyAlbum,
  formatSpotifyTracklist,
  formatSpotifyArtist,
} from "./formatting";


export interface SpotifyService {
  // Album Methods
  getAlbumInfoByID(albumId: string): Promise<Result<SimplifiedAlbum, string>>;
  getAlbumsTracks(albumId: string): Promise<Result<SimplifiedTrack[], string>>;
  // Artist Methods
  getArtistInfoByID(
    artistId: string
  ): Promise<Result<SimplifiedArtist, string>>;
  getArtistTopTracks(artistId: string): Promise<Result<SimplifiedTrack[], string>>;
  getArtistAlbums(artistId: string): Promise<Result<SimplifiedAlbum[], string>>;
  // Track Methods
  getTrackInfoByID(trackId: string): Promise<Result<SimplifiedTrack, string>>;
}

export const spotifyService: SpotifyService = {
  async getAlbumInfoByID(
    albumId: string
  ): Promise<Result<SimplifiedAlbum, string>> {
    if (!albumId) {
      return err("Album ID is required");
    }
    const albumResult = await getAlbum(albumId);
    if (!albumResult.ok) {
      return err("Failed to fetch album info");
    }
    const album = formatSpotifyAlbum(albumResult.data);

    return ok(album);
  },

  async getAlbumsTracks(albumId: string): Promise<Result<SimplifiedTrack[], string>> {
    if (!albumId) {
      return err("Album ID is required");
    }
    const tracklistResult = await getAlbumTracks(albumId);
    if (!tracklistResult.ok) {
      return err(JSON.stringify(tracklistResult.error));
    }
    const tracklist = formatSpotifyTracklist(tracklistResult.data);
    return ok(tracklist as SimplifiedTrack[]);
  },

  async getArtistInfoByID(
    artistId: string
  ): Promise<Result<SimplifiedArtist, string>> {
    if (!artistId) {
      return err("Artist ID is required");
    }
    const artistResult = await getArtist(artistId);
    if (!artistResult.ok) {
      return err("Failed to fetch artist info");
    }
    const artist = formatSpotifyArtist(artistResult.data);
    return ok(artist);
  },

  async getArtistTopTracks(artistId: string): Promise<Result<SimplifiedTrack[], string>> {
    if (!artistId) {
      return err("Artist ID is required");
    }
    const topTracksResult = await getArtistTopTracks(artistId);
    if (!topTracksResult.ok) {
      return err("Failed to fetch artist top tracks");
    }
    const topTracks = formatSpotifyTracklist(topTracksResult.data);
    return ok(topTracks as SimplifiedTrack[]);
  },

  async getArtistAlbums(
    artistId: string
  ): Promise<Result<SimplifiedAlbum[], string>> {
    if (!artistId) {
      return err("Artist ID is required");
    }
    const artistAlbumsResult = await getArtistAlbums(artistId);
    if (!artistAlbumsResult.ok) {
      return err("Failed to fetch artist albums");
    }
    const albums = artistAlbumsResult.data.items.map(formatSpotifyAlbum);
    return ok(albums);
  },

  async getTrackInfoByID(trackId: string): Promise<Result<SimplifiedTrack, string>> {
    if (!trackId) {
      return err("Track ID is required");
    }
    const trackResult = await getTrack(trackId);
    if (!trackResult.ok) {
      return err("Failed to fetch track info");
    }
    const track = formatSpotifyTracklist(trackResult.data);
    return ok(track as SimplifiedTrack);
  },
};
