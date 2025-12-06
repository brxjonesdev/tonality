/* eslint-disable @typescript-eslint/no-explicit-any */

import { SpotifyError } from "./config";
import { Result, err, ok } from "@/lib/utils";
import { getSpotifyToken } from "./utils";

export async function getAlbum(id: string): Promise<Result<any, SpotifyError>> {
  const token = await getSpotifyToken();
  const res = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "force-cache",
  });

  if (!res.ok) return err(await res.json());
  return ok(await res.json());
}

export async function getTrack(id: string): Promise<Result<any, SpotifyError>> {
  const token = await getSpotifyToken();
  const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "force-cache",
  });

  if (!res.ok) return err(await res.json());
  return ok(await res.json());
}

export async function getArtist(id: string): Promise<Result<any, SpotifyError>> {
  const token = await getSpotifyToken();
  const res = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "force-cache",
  });

  if (!res.ok) return err(await res.json());
  return ok(await res.json());
}

export async function getArtistAlbums(
  id: string
): Promise<Result<any, SpotifyError>> {
  const token = await getSpotifyToken();
  const res = await fetch(`https://api.spotify.com/v1/artists/${id}/albums`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "force-cache",
  });

  if (!res.ok) return err(await res.json());
  return ok(await res.json());
}

export async function getArtistTopTracks(
  id: string
): Promise<Result<any, SpotifyError>> {
  const token = await getSpotifyToken();
  const res = await fetch(
    `https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "force-cache",
    }
  );

  if (!res.ok) return err(await res.json());
  return ok((await res.json()).tracks);
}

export async function getAlbumTracks(
  id: string
): Promise<Result<any, SpotifyError>> {
  const token = await getSpotifyToken();
  const res = await fetch(`https://api.spotify.com/v1/albums/${id}/tracks`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "force-cache",
  });

  if (!res.ok) return err(await res.json());
  return ok((await res.json()).items);
}

export async function getAudioFeatures(
  id: string
): Promise<Result<any, SpotifyError>> {
  const token = await getSpotifyToken();
  const res = await fetch(`https://api.spotify.com/v1/audio-features/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "force-cache",
  });

  if (!res.ok) return err(await res.json());
  return ok(await res.json());
}
