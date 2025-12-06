import { Result, ok, err } from "@/lib/utils";
export interface MusicCacheService {
    cacheTrack(spotifyId: string): Promise<Result<boolean, Error>>;
    cacheAlbum(spotifyId: string): Promise<Result<boolean, Error>>;
    cacheArtist(spotifyId: string): Promise<Result<boolean, Error>>;
}