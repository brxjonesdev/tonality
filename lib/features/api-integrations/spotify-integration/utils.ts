/* eslint-disable @typescript-eslint/no-explicit-any */

import { cache } from 'react';
import { SpotifyError, SpotifyResponse } from './config';
import { Result, err, ok } from '@/lib/utils';

export const getSpotifyToken = cache(async () => {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const tokenRes = await fetch(`${base}/api/spotify/token`, {
    next: { revalidate: 3000 },
  });

  const tokenData: SpotifyResponse | SpotifyError = await tokenRes.json();
  if ('error' in tokenData) throw new Error(tokenData.error);

  return tokenData.access_token;
});

export const generateSlug = (name: string): string =>
  name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
