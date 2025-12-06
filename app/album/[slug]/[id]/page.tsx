import { musicBrainzService } from "@/lib/features/api-integrations/music-brainz-integration/music-brainz-service";
import { spotifyService } from "@/lib/features/api-integrations/spotify-integration/spotify.service";
import { reviewService } from "@/lib/features/review";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: { slug: string; id: string };
}): Promise<Metadata> {
  const { slug, id } = await params;
  
  const albumInfo = await spotifyService.getAlbumInfoByID(id);
  
  if (!albumInfo.ok) {
    return {
      title: slug.split("-").map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(" "),
      description: `Album details for ${slug}`,
    };
  }
  
  const info = albumInfo.data;
  const artist = info.artist || "Unknown Artist";
  const title = `${info.name} by ${artist}`;
  
  return {
    title: title,
    description: `Listen to ${info.name} by ${artist}. View tracklist, credits, and reviews on Tonality.`,
  };
}

export default async function AlbumPage({
  params,
}: {
  params: { slug: string; id: string };
}) {
  const { id } = await params;
  const [albumInfo, ratings, tracklist, credits] = await Promise.all([
    spotifyService.getAlbumInfoByID(id),
    reviewService.getAlbumReviews(id),
    spotifyService.getAlbumsTracks(id),
    musicBrainzService.getAlbumCredits(id),
  ]);


  return <div className="flex gap-4 flex-col">
    <p>info {JSON.stringify(albumInfo, null, 2)}</p>
    <p>ratings {JSON.stringify(ratings, null, 2)}</p>
    <p>tracklist {JSON.stringify(tracklist, null, 2)}</p>
    <p>credits {JSON.stringify(credits, null, 2)}</p>

  </div>;
}
