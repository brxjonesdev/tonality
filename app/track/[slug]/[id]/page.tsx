import { musicBrainzService } from "@/lib/features/api-integrations/music-brainz-integration/music-brainz-service";
import { spotifyService } from "@/lib/features/api-integrations/spotify-integration/spotify.service";
import { cratesService } from "@/lib/features/crates/crates-service";
import { reviewService } from "@/lib/features/review";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: { slug: string; id: string };
}): Promise<Metadata> {
  const { slug, id } = await params;
  
  const trackInfo = await spotifyService.getTrackInfoByID(id);
  if (!trackInfo.ok){
    return {
      title: slug.split("-").map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(" "),
      description: `Track details for ${slug}`,
    };
  }
  const info = trackInfo.data;
  const title = `${info.name} by ${info.artist || "unknown artist"}`;
  
  return {
    title: title,
    description: info?.name 
      ? `Check out ${info.name} by ${info.artist || "unknown artist"} on Tonality.` 
      : `Track details for ${slug}`,
  };
}

export default async function TrackPage({
  params,
}: {
  params: { slug: string; id: string };
}) {
  const { id } = await params;
  const [trackInfo, reviews, credits, crates] =
    await Promise.all([
      spotifyService.getTrackInfoByID(id),
      reviewService.getTrackReviews(id),
      musicBrainzService.getTrackCredits(id),
      cratesService.getCratesIncludingTrack(id),
    ]);
  return <div className="flex gap-4 flex-col">
    <p>{JSON.stringify(trackInfo, null, 2)}</p>
    <p>{JSON.stringify(reviews, null, 2)}</p>
    <p>{JSON.stringify(credits, null, 2)}</p>
    <p>{JSON.stringify(crates, null, 2)}</p>
  </div>;
}
