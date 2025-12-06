import { err } from "@/lib/utils";

export interface MusicBrainzService {
   getAlbumCredits(spotifyId: string): Promise<any>;
   getTrackCredits(spotifyId: string): Promise<any>;
}

export const musicBrainzService: MusicBrainzService = {
    async getAlbumCredits(spotifyId: string): Promise<any> {
    // Find MusicBrainz ID from Spotify ID mapping (not implemented)
    // Fetch album credits from MusicBrainz API using MusicBrainz ID (not implemented)
    // Return data
        return err(new Error("Not implemented"));
    },
    async getTrackCredits(spotifyId: string): Promise<any> {
        return err(new Error("Not implemented"));
    }
}