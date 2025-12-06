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
  
  const artistInfo = await spotifyService.getArtistInfoByID(id);
  
  if (!artistInfo.ok) {
    return {
      title: slug.split("-").map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(" "),
      description: `Artist details for ${slug}`,
    };
  }
  
  const info = artistInfo.data;
  const title = info.name;
  
  return {
    title: title,
    description: `Explore ${info.name}'s music, top tracks, albums, and reviews on Tonality.`,
  };
}


export default async function ArtistPage({
  params,
}: {
  params: { slug: string; id: string };
}) {
  const { id } = await params;
  const [artistInfo, topTracks, albums, reviews] = await Promise.all([
    spotifyService.getArtistInfoByID(id),
    spotifyService.getArtistTopTracks(id),
    spotifyService.getArtistAlbums(id),
    reviewService.getArtistReviews(id),
  ]);
  return <div className="flex gap-4 flex-col">
    <p>info {JSON.stringify(artistInfo, null, 2)}</p>
    <p>topTracks {JSON.stringify(topTracks, null, 2)}</p>
    <p>albums {JSON.stringify(albums, null, 2)}</p>
    <p>reviews {JSON.stringify(reviews, null, 2)}</p>
    </div>;
}
